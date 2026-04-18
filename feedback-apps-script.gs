const FEEDBACK_HEADERS = ['Timestamp', 'Title', 'Description', 'Email', 'App Version', 'Status']

function doGet(e) {
  try {
    const action = String(e?.parameter?.action || '').trim()

    if (action === 'listFeedback') {
      const sheetName = resolveFeedbackSheetName_(e?.parameter?.sheet)
      const rows = listFeedback_(sheetName)
      return jsonResponse_(rows)
    }

    return errorResponse_('Unsupported GET action.')
  } catch (err) {
    return errorResponse_(err)
  }
}

function doPost(e) {
  try {
    const payload = parseRequestBody_(e)
    const action = String(payload.action || '').trim()

    if (action === 'updateFeedbackStatus') {
      const updatedRow = updateFeedbackStatus_(payload)
      return jsonResponse_(updatedRow)
    }

    if (action === 'submitFeedback' || payload.type || payload.sheet) {
      const createdRow = appendFeedback_(payload)
      return jsonResponse_(createdRow)
    }

    return errorResponse_('Unsupported POST action.')
  } catch (err) {
    return errorResponse_(err)
  }
}

function appendFeedback_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheetName = resolveFeedbackSheetName_(payload.sheet || payload.type)
  const sheet = getOrCreateFeedbackSheet_(ss, sheetName)

  const rowValues = [
    new Date(),
    String(payload.title || '').trim(),
    String(payload.description || '').trim(),
    String(payload.email || 'anonymous').trim() || 'anonymous',
    String(payload.appVersion || 'unknown').trim() || 'unknown',
    false,
  ]

  sheet.appendRow(rowValues)
  const rowNumber = sheet.getLastRow()

  return buildFeedbackRow_(sheet, rowNumber, rowValues)
}

function listFeedback_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = getOrCreateFeedbackSheet_(ss, sheetName)
  const lastRow = sheet.getLastRow()

  if (lastRow <= 1) {
    return []
  }

  const values = sheet.getRange(2, 1, lastRow - 1, FEEDBACK_HEADERS.length).getValues()

  return values.map((row, index) => buildFeedbackRow_(sheet, index + 2, row))
}

function updateFeedbackStatus_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheetName = resolveFeedbackSheetName_(payload.sheet)
  const sheet = getOrCreateFeedbackSheet_(ss, sheetName)
  const rowNumber = Number(payload.row)

  if (!Number.isInteger(rowNumber) || rowNumber < 2 || rowNumber > sheet.getLastRow()) {
    throw new Error('Invalid feedback row.')
  }

  const nextStatus = parseBoolean_(payload.status)
  const statusColumn = FEEDBACK_HEADERS.indexOf('Status') + 1

  sheet.getRange(rowNumber, statusColumn).setValue(nextStatus)

  const updatedValues = sheet.getRange(rowNumber, 1, 1, FEEDBACK_HEADERS.length).getValues()[0]
  return buildFeedbackRow_(sheet, rowNumber, updatedValues)
}

function getOrCreateFeedbackSheet_(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName)
  }

  ensureFeedbackHeaders_(sheet)
  return sheet
}

function ensureFeedbackHeaders_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length)
  const existingHeaders = sheet.getLastRow() >= 1
    ? sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length).getValues()[0]
    : []

  let shouldWriteHeaders = sheet.getLastRow() === 0

  for (var i = 0; i < FEEDBACK_HEADERS.length; i += 1) {
    if (String(existingHeaders[i] || '').trim() !== FEEDBACK_HEADERS[i]) {
      shouldWriteHeaders = true
      break
    }
  }

  if (shouldWriteHeaders) {
    headerRange.setValues([FEEDBACK_HEADERS])
  }
}

function buildFeedbackRow_(sheet, rowNumber, rowValues) {
  const values = rowValues || sheet.getRange(rowNumber, 1, 1, FEEDBACK_HEADERS.length).getValues()[0]

  return {
    row: rowNumber,
    timestamp: serializeCell_(values[0]),
    title: String(values[1] || ''),
    description: String(values[2] || ''),
    email: String(values[3] || ''),
    appVersion: String(values[4] || ''),
    status: parseBoolean_(values[5]),
  }
}

function resolveFeedbackSheetName_(value) {
  const normalized = String(value || '').trim().toLowerCase()

  if (!normalized) {
    throw new Error('Feedback sheet or type is required.')
  }

  if (
    normalized === 'bug' ||
    normalized === 'bugs' ||
    normalized === 'bug report' ||
    normalized === 'bug reports' ||
    normalized === 'bug and glitches' ||
    normalized === 'bugs and glitches'
  ) {
    return 'Bugs'
  }

  if (
    normalized === 'feature' ||
    normalized === 'features' ||
    normalized === 'feature request' ||
    normalized === 'feature requests'
  ) {
    return 'Features'
  }

  throw new Error('Unsupported feedback sheet.')
}

function parseBoolean_(value) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  return String(value || '').trim().toLowerCase() === 'true'
}

function serializeCell_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value.toISOString()
  }

  return String(value || '')
}

function parseRequestBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request body.')
  }

  return JSON.parse(e.postData.contents)
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON)
}

function errorResponse_(err) {
  const message = err instanceof Error ? err.message : String(err || 'Unknown error')

  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, success: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON)
}
