const DEFAULT_PAYMENTS_SHEET = 'Payments';
const DEFAULT_USERS_SHEET = 'Users';
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const PLAN_DURATIONS = {
  monthly: 28,
  yearly: 365,
  lifetime: 0, // No expiry for lifetime
};

function doGet(e) {
  try {
    ensureSheets_();

    const action = (e && e.parameter && e.parameter.action) || '';

    if (action === 'listUsers') {
      return jsonResponse_({ ok: true, data: listUsers_() });
    }

    if (action === 'paymentHistory') {
      const email = normalizeEmail_((e && e.parameter && e.parameter.email) || '');
      return jsonResponse_({ ok: true, data: paymentHistory_(email) });
    }

    return jsonResponse_({ ok: false, error: 'Unsupported GET action.' });
  } catch (error) {
    return jsonResponse_({ ok: false, error: error.message || 'Unknown GET error.' });
  }
}

function doPost(e) {
  try {
    ensureSheets_();

    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = body.action || '';

    if (action === 'addPayment') {
      return jsonResponse_({ ok: true, data: addPayment_(body) });
    }

    return jsonResponse_({ ok: false, error: 'Unsupported POST action.' });
  } catch (error) {
    return jsonResponse_({ ok: false, error: error.message || 'Unknown POST error.' });
  }
}

function addPayment_(payload) {
  const email = normalizeEmail_(payload.email || '');
  const plan = String(payload.plan || '').toLowerCase();
  const paidOn = String(payload.paidOn || '');

  if (!email) {
    throw new Error('Email is required.');
  }

  if (!PLAN_DURATIONS.hasOwnProperty(plan)) {
    throw new Error('Plan must be monthly, yearly, or lifetime.');
  }

  const paymentDate = parseDateOnly_(paidOn);
  const usersSheet = getUsersSheet_();
  const paymentsSheet = getPaymentsSheet_();
  const usersData = getSheetRecords_(usersSheet);
  const now = new Date();
  const today = startOfDay_(now);
  const previousUser = usersData.find(function (row) {
    return normalizeEmail_(row.email) === email;
  });
  const previousExpiry = previousUser && previousUser.current_plan_expires_at
    ? parseDateOnly_(previousUser.current_plan_expires_at)
    : null;
  
  // For lifetime, no expiry is set
  let newExpiry = null;
  let daysAdded = 0;
  let carryForwardDays = 0;
  
  if (plan === 'lifetime') {
    newExpiry = null;
    daysAdded = null;
    carryForwardDays = 0;
  } else {
    carryForwardDays = previousExpiry ? Math.max(0, diffDays_(today, previousExpiry)) : 0;
    daysAdded = PLAN_DURATIONS[plan];
    newExpiry = addDays_(paymentDate, daysAdded + carryForwardDays);
  }
  
  const paymentId = generateUniquePaymentId_(paymentsSheet);

  paymentsSheet.appendRow([
    paymentId,
    email,
    plan,
    formatDateOnly_(paymentDate),
    daysAdded || '',
    carryForwardDays,
    previousExpiry ? formatDateOnly_(previousExpiry) : '',
    newExpiry ? formatDateOnly_(newExpiry) : '',
    now.toISOString(),
  ]);

  upsertUserRow_(usersSheet, {
    email: email,
    current_plan: plan,
    current_plan_expires_at: newExpiry ? formatDateOnly_(newExpiry) : '',
    last_payment_date: formatDateOnly_(paymentDate),
    days_left: newExpiry ? Math.max(0, diffDays_(today, newExpiry)) : 0,
    payment_count: previousUser ? Number(previousUser.payment_count || 0) + 1 : 1,
    updated_at: now.toISOString(),
  });

  syncProfilePlanToSupabase_(email, plan, newExpiry ? formatDateOnly_(newExpiry) : null);
  recalculateUsersSheet_();

  return {
    summary: getUserSummaryByEmail_(email),
    payment: {
      paymentId: paymentId,
      email: email,
      plan: plan,
      paidOn: formatDateOnly_(paymentDate),
      daysAdded: daysAdded || 0,
      carryForwardDays: carryForwardDays,
      previousExpiry: previousExpiry ? formatDateOnly_(previousExpiry) : '',
      newExpiry: newExpiry ? formatDateOnly_(newExpiry) : '',
      recordedAt: now.toISOString(),
    },
  };
}

function listUsers_() {
  recalculateUsersSheet_();
  var usersSheet = getUsersSheet_();
  var rows = getSheetRecords_(usersSheet);

  return rows
    .filter(function (row) { return row.email; })
    .map(function (row) {
      return {
        email: row.email,
        currentPlan: row.current_plan || '',
        currentPlanExpiresAt: row.current_plan_expires_at || '',
        lastPaymentDate: row.last_payment_date || '',
        daysLeft: Number(row.days_left || 0),
        paymentCount: Number(row.payment_count || 0),
        updatedAt: row.updated_at || '',
      };
    })
    .sort(function (a, b) {
      return String(a.email).localeCompare(String(b.email));
    });
}

function paymentHistory_(email) {
  if (!email) {
    throw new Error('Email is required.');
  }

  var paymentsSheet = getPaymentsSheet_();
  var rows = getSheetRecords_(paymentsSheet);

  return rows
    .filter(function (row) {
      return normalizeEmail_(row.email) === email;
    })
    .map(function (row) {
      return {
        paymentId: row.payment_id,
        email: row.email,
        plan: row.plan,
        paidOn: row.paid_on,
        daysAdded: Number(row.days_added || 0),
        carryForwardDays: Number(row.carry_forward_days || 0),
        previousExpiry: row.previous_expiry || '',
        newExpiry: row.new_expiry || '',
        recordedAt: row.recorded_at || '',
      };
    })
    .sort(function (a, b) {
      return String(b.recordedAt).localeCompare(String(a.recordedAt));
    });
}

function recalculateUsersSheet_() {
  var usersSheet = getUsersSheet_();
  var rows = getSheetRecords_(usersSheet);
  var today = startOfDay_(new Date());
  var rangeValues = rows.map(function (row) {
    var expiry = row.current_plan_expires_at ? parseDateOnly_(row.current_plan_expires_at) : null;
    var daysLeft = expiry ? Math.max(0, diffDays_(today, expiry)) : 0;

    return [
      row.email || '',
      row.current_plan || '',
      row.current_plan_expires_at || '',
      row.last_payment_date || '',
      daysLeft,
      Number(row.payment_count || 0),
      row.updated_at || '',
    ];
  });

  if (!rangeValues.length) {
    return;
  }

  usersSheet.getRange(2, 1, rangeValues.length, 7).setValues(rangeValues);
}

function getUserSummaryByEmail_(email) {
  var rows = listUsers_();
  var match = rows.find(function (row) {
    return normalizeEmail_(row.email) === email;
  });

  if (!match) {
    throw new Error('Unable to find the updated user summary.');
  }

  return match;
}

function upsertUserRow_(sheet, userData) {
  var rows = getSheetRecords_(sheet);
  var targetIndex = rows.findIndex(function (row) {
    return normalizeEmail_(row.email) === normalizeEmail_(userData.email);
  });
  var rowValues = [[
    userData.email,
    userData.current_plan,
    userData.current_plan_expires_at,
    userData.last_payment_date,
    userData.days_left,
    userData.payment_count,
    userData.updated_at,
  ]];

  if (targetIndex >= 0) {
    sheet.getRange(targetIndex + 2, 1, 1, 7).setValues(rowValues);
    return;
  }

  sheet.appendRow(rowValues[0]);
}

function generateUniquePaymentId_(paymentsSheet) {
  var existingIds = getSheetRecords_(paymentsSheet).reduce(function (set, row) {
    if (row.payment_id) {
      set[String(row.payment_id)] = true;
    }
    return set;
  }, {});

  var candidate = Utilities.getUuid();

  while (existingIds[candidate]) {
    candidate = Utilities.getUuid();
  }

  return candidate;
}

function syncProfilePlanToSupabase_(email, plan, planExpiresAt) {
  var supabaseUrl = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
  var serviceRoleKey = PropertiesService.getScriptProperties().getProperty('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY script property.');
  }

  var response = UrlFetchApp.fetch(
    supabaseUrl + '/rest/v1/profiles?email=eq.' + encodeURIComponent(normalizeEmail_(email)),
    {
      method: 'patch',
      contentType: 'application/json',
      muteHttpExceptions: true,
      headers: {
        apikey: serviceRoleKey,
        Authorization: 'Bearer ' + serviceRoleKey,
        Prefer: 'return=minimal',
      },
      payload: JSON.stringify({
        subscription: plan,
        plan_expires_at: planExpiresAt,
      }),
    }
  );

  if (response.getResponseCode() >= 300) {
    throw new Error('Supabase sync failed: ' + response.getContentText());
  }
}

function ensureSheets_() {
  var paymentsSheet = getOrCreateSheet_(
    getPaymentsSpreadsheet_(),
    getProperty_('PAYMENTS_SHEET_NAME', DEFAULT_PAYMENTS_SHEET)
  );
  var usersSheet = getOrCreateSheet_(
    getUsersSpreadsheet_(),
    getProperty_('USERS_SHEET_NAME', DEFAULT_USERS_SHEET)
  );

  ensureHeaders_(paymentsSheet, [
    'payment_id',
    'email',
    'plan',
    'paid_on',
    'days_added',
    'carry_forward_days',
    'previous_expiry',
    'new_expiry',
    'recorded_at',
  ]);

  ensureHeaders_(usersSheet, [
    'email',
    'current_plan',
    'current_plan_expires_at',
    'last_payment_date',
    'days_left',
    'payment_count',
    'updated_at',
  ]);
}

function ensureHeaders_(sheet, headers) {
  var currentHeaders = sheet.getLastRow() > 0 ? sheet.getRange(1, 1, 1, headers.length).getValues()[0] : [];
  var shouldWriteHeaders = headers.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (shouldWriteHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function getSheetRecords_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  return values.map(function (row) {
    var record = {};
    headers.forEach(function (header, index) {
      record[header] = row[index];
    });
    return record;
  });
}

function getPaymentsSpreadsheet_() {
  return openSpreadsheetByProperty_('PAYMENTS_SPREADSHEET_ID');
}

function getUsersSpreadsheet_() {
  var usersSpreadsheetId = PropertiesService.getScriptProperties().getProperty('USERS_SPREADSHEET_ID');
  return usersSpreadsheetId ? openSpreadsheetByProperty_('USERS_SPREADSHEET_ID') : getPaymentsSpreadsheet_();
}

function getPaymentsSheet_() {
  return getOrCreateSheet_(
    getPaymentsSpreadsheet_(),
    getProperty_('PAYMENTS_SHEET_NAME', DEFAULT_PAYMENTS_SHEET)
  );
}

function getUsersSheet_() {
  return getOrCreateSheet_(
    getUsersSpreadsheet_(),
    getProperty_('USERS_SHEET_NAME', DEFAULT_USERS_SHEET)
  );
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function getProperty_(key, fallback) {
  return PropertiesService.getScriptProperties().getProperty(key) || fallback;
}

function openSpreadsheetByProperty_(propertyName) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty(propertyName);

  if (!spreadsheetId) {
    throw new Error('Missing ' + propertyName + ' script property.');
  }

  if (/^\d+$/.test(String(spreadsheetId))) {
    throw new Error(
      'Invalid ' + propertyName + ': "' + spreadsheetId + '" looks like a sheet gid, not a spreadsheet ID. ' +
      'Use the value between /d/ and /edit in the Google Sheets URL.'
    );
  }

  try {
    return SpreadsheetApp.openById(spreadsheetId);
  } catch (error) {
    throw new Error('Unable to open ' + propertyName + ': ' + spreadsheetId + '. ' + error.message);
  }
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function parseDateOnly_(value) {
  if (!value) {
    throw new Error('Invalid date value.');
  }

  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  var normalized = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    var isoParts = normalized.split('-');
    return new Date(Number(isoParts[0]), Number(isoParts[1]) - 1, Number(isoParts[2]));
  }

  var dayFirstMatch = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (dayFirstMatch) {
    return new Date(
      Number(dayFirstMatch[3]),
      Number(dayFirstMatch[2]) - 1,
      Number(dayFirstMatch[1])
    );
  }

  var parsed = new Date(normalized);

  if (!isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  throw new Error('Dates must use YYYY-MM-DD format.');
}

function formatDateOnly_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function startOfDay_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays_(date, days) {
  return new Date(startOfDay_(date).getTime() + days * MS_PER_DAY);
}

function diffDays_(startDate, endDate) {
  return Math.floor((startOfDay_(endDate).getTime() - startOfDay_(startDate).getTime()) / MS_PER_DAY);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}