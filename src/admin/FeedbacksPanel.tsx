import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BellRing, Bug, LoaderCircle, RefreshCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  fetchFeedbackEntries,
  isFeedbackGoogleSheetsConfigured,
  updateFeedbackStatus,
  type FeedbackEntry,
  type FeedbackSheetName,
} from '@/lib/google-sheets-client'

const FEEDBACK_SHEETS: FeedbackSheetName[] = ['Bugs', 'Features']

const FEEDBACK_TAB_META: Record<
  FeedbackSheetName,
  {
    label: string
    icon: typeof Bug
    emptyTitle: string
    emptyDescription: string
  }
> = {
  Bugs: {
    label: 'Bug Reports',
    icon: Bug,
    emptyTitle: 'No bug reports yet',
    emptyDescription: 'New bug submissions from the `Bugs` sheet will appear here.',
  },
  Features: {
    label: 'Feature Requests',
    icon: Sparkles,
    emptyTitle: 'No feature requests yet',
    emptyDescription: 'New feature submissions from the `Features` sheet will appear here.',
  },
}

const POLL_INTERVAL_MS = 45_000

type FeedbackMap = Record<FeedbackSheetName, FeedbackEntry[]>

type NotificationState = NotificationPermission | 'unsupported'

const buildEmptyFeedbackMap = (): FeedbackMap => ({
  Bugs: [],
  Features: [],
})

const buildFeedbackId = (sheet: FeedbackSheetName, entry: FeedbackEntry) =>
  `${sheet}::${entry.row}::${entry.timestamp}::${entry.email}::${entry.title}`

const buildFeedbackSnapshot = (feedbackMap: FeedbackMap) => ({
  Bugs: new Set(feedbackMap.Bugs.map((entry) => buildFeedbackId('Bugs', entry))),
  Features: new Set(feedbackMap.Features.map((entry) => buildFeedbackId('Features', entry))),
})

const sortFeedbackEntries = (entries: FeedbackEntry[]) =>
  [...entries].sort((left, right) => Number(left.status) - Number(right.status) || right.row - left.row)

const formatTimestamp = (value: string) => {
  if (!value) {
    return '—'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

const formatNotificationState = (value: NotificationState) => {
  switch (value) {
    case 'granted':
      return 'Notifications enabled'
    case 'denied':
      return 'Notifications blocked'
    case 'unsupported':
      return 'Notifications unavailable'
    default:
      return 'Notifications pending'
  }
}

type FeedbacksPanelProps = {
  refreshToken?: number
}

const FeedbacksPanel = ({ refreshToken = 0 }: FeedbacksPanelProps) => {
  const [activeSheet, setActiveSheet] = useState<FeedbackSheetName>('Bugs')
  const [feedbackMap, setFeedbackMap] = useState<FeedbackMap>(buildEmptyFeedbackMap)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [notificationState, setNotificationState] = useState<NotificationState>('default')
  const [updatingRows, setUpdatingRows] = useState<Record<string, boolean>>({})
  const hasLoadedOnceRef = useRef(false)
  const feedbackSnapshotRef = useRef<ReturnType<typeof buildFeedbackSnapshot> | null>(null)
  const isFetchInFlightRef = useRef(false)
  const notificationRequestRef = useRef(false)

  const activeEntries = feedbackMap[activeSheet]

  const entryCountBySheet = useMemo(
    () =>
      FEEDBACK_SHEETS.reduce<Record<FeedbackSheetName, number>>((accumulator, sheet) => {
        accumulator[sheet] = feedbackMap[sheet].length
        return accumulator
      }, { Bugs: 0, Features: 0 }),
    [feedbackMap],
  )

  const pendingCountBySheet = useMemo(
    () =>
      FEEDBACK_SHEETS.reduce<Record<FeedbackSheetName, number>>((accumulator, sheet) => {
        accumulator[sheet] = feedbackMap[sheet].filter((entry) => !entry.status).length
        return accumulator
      }, { Bugs: 0, Features: 0 }),
    [feedbackMap],
  )

  const updateEntryList = (
    currentEntries: FeedbackEntry[],
    row: number,
    updater: (entry: FeedbackEntry) => FeedbackEntry,
  ) => sortFeedbackEntries(currentEntries.map((entry) => (entry.row === row ? updater(entry) : entry)))

  const maybeNotifyForNewEntries = useCallback((nextFeedbackMap: FeedbackMap) => {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
      feedbackSnapshotRef.current = buildFeedbackSnapshot(nextFeedbackMap)
      return
    }

    const previousSnapshot = feedbackSnapshotRef.current
    const nextSnapshot = buildFeedbackSnapshot(nextFeedbackMap)

    if (!previousSnapshot) {
      feedbackSnapshotRef.current = nextSnapshot
      return
    }

    for (const sheet of FEEDBACK_SHEETS) {
      const newEntries = nextFeedbackMap[sheet].filter(
        (entry) => !previousSnapshot[sheet].has(buildFeedbackId(sheet, entry)),
      )

      if (!newEntries.length) {
        continue
      }

      const { label } = FEEDBACK_TAB_META[sheet]
      const latestEntry = newEntries[0]

      new Notification(
        newEntries.length === 1 ? `New ${label.slice(0, -1)}` : `${newEntries.length} new ${label.toLowerCase()}`,
        {
          body:
            newEntries.length === 1
              ? latestEntry.title || latestEntry.description || 'A new feedback row was added.'
              : `Latest: ${latestEntry.title || latestEntry.description || 'New feedback received.'}`,
          tag: `revisit-${sheet.toLowerCase()}-feedback`,
        },
      )
    }

    feedbackSnapshotRef.current = nextSnapshot
  }, [])

  const loadFeedbacks = useCallback(
    async ({ notifyNew = false, showRefreshState = false }: { notifyNew?: boolean; showRefreshState?: boolean } = {}) => {
      if (!isFeedbackGoogleSheetsConfigured || isFetchInFlightRef.current) {
        if (!isFeedbackGoogleSheetsConfigured) {
          setIsLoading(false)
          hasLoadedOnceRef.current = true
        }
        return
      }

      isFetchInFlightRef.current = true

      if (!hasLoadedOnceRef.current) {
        setIsLoading(true)
      } else if (showRefreshState) {
        setIsRefreshing(true)
      }

      try {
        const [bugs, features] = await Promise.all([
          fetchFeedbackEntries('Bugs'),
          fetchFeedbackEntries('Features'),
        ])
        const nextFeedbackMap = {
          Bugs: sortFeedbackEntries(bugs),
          Features: sortFeedbackEntries(features),
        }

        setFeedbackMap(nextFeedbackMap)
        setError('')

        if (notifyNew) {
          maybeNotifyForNewEntries(nextFeedbackMap)
        } else {
          feedbackSnapshotRef.current = buildFeedbackSnapshot(nextFeedbackMap)
        }
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to load feedback rows from Google Sheets.'
        setError(message)
      } finally {
        isFetchInFlightRef.current = false
        hasLoadedOnceRef.current = true
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [maybeNotifyForNewEntries],
  )

  useEffect(() => {
    void loadFeedbacks()
  }, [loadFeedbacks])

  useEffect(() => {
    if (!refreshToken) {
      return
    }

    void loadFeedbacks({ showRefreshState: true })
  }, [loadFeedbacks, refreshToken])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationState('unsupported')
      return
    }

    setNotificationState(Notification.permission)

    if (Notification.permission !== 'default' || notificationRequestRef.current) {
      return
    }

    notificationRequestRef.current = true

    void Notification.requestPermission().then((permission) => {
      setNotificationState(permission)
    })
  }, [])

  useEffect(() => {
    if (!isFeedbackGoogleSheetsConfigured) {
      return
    }

    const intervalId = window.setInterval(() => {
      void loadFeedbacks({ notifyNew: true })
    }, POLL_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadFeedbacks])

  const handleToggleStatus = async (sheet: FeedbackSheetName, entry: FeedbackEntry, nextStatus: boolean) => {
    const rowKey = `${sheet}:${entry.row}`

    if (updatingRows[rowKey]) {
      return
    }

    setUpdatingRows((currentRows) => ({
      ...currentRows,
      [rowKey]: true,
    }))
    setError('')
    setFeedbackMap((currentMap) => ({
      ...currentMap,
      [sheet]: updateEntryList(currentMap[sheet], entry.row, (currentEntry) => ({
        ...currentEntry,
        status: nextStatus,
      })),
    }))

    try {
      const updatedEntry = await updateFeedbackStatus({
        sheet,
        row: entry.row,
        status: nextStatus,
      })

      setFeedbackMap((currentMap) => ({
        ...currentMap,
        [sheet]: updateEntryList(currentMap[sheet], entry.row, (currentEntry) => ({
          ...currentEntry,
          ...updatedEntry,
        })),
      }))
    } catch (caughtError) {
      setFeedbackMap((currentMap) => ({
        ...currentMap,
        [sheet]: updateEntryList(currentMap[sheet], entry.row, (currentEntry) => ({
          ...currentEntry,
          status: entry.status,
        })),
      }))
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to update the feedback status in Google Sheets.',
      )
    } finally {
      setUpdatingRows((currentRows) => {
        const nextRows = { ...currentRows }
        delete nextRows[rowKey]
        return nextRows
      })
    }
  }

  return (
    <Card className="border-white/60 bg-white/90 shadow-card min-w-0">
      <CardHeader className="gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="font-heading text-2xl">Feedbacks</CardTitle>
            <CardDescription className="mt-2 max-w-3xl leading-6">
              `Bugs` and `Features` sheet rows are synced here. Open items stay pinned to the top, completed rows stay struck out at the bottom, and new submissions trigger browser notifications while this dashboard is open.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-revisit-border bg-revisit-bg/70 px-4 py-2 text-xs font-medium text-revisit-text-secondary">
              <BellRing className="h-4 w-4 text-revisit-accent" />
              {formatNotificationState(notificationState)}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void loadFeedbacks({ showRefreshState: true })}
              disabled={isRefreshing || !isFeedbackGoogleSheetsConfigured}
              className="rounded-full border-revisit-border bg-white"
            >
              <RefreshCcw className={cn('h-4 w-4', isRefreshing ? 'animate-spin' : '')} />
              Refresh feedbacks
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {FEEDBACK_SHEETS.map((sheet) => {
            const meta = FEEDBACK_TAB_META[sheet]
            const Icon = meta.icon
            const isActive = activeSheet === sheet

            return (
              <button
                key={sheet}
                type="button"
                onClick={() => setActiveSheet(sheet)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'border-revisit-accent bg-revisit-accent text-white shadow-sm'
                    : 'border-revisit-border bg-revisit-bg/70 text-revisit-text-secondary hover:border-revisit-accent/40 hover:text-revisit-text',
                )}
              >
                <Icon className="h-4 w-4" />
                {meta.label}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-revisit-text-secondary',
                  )}
                >
                  {entryCountBySheet[sheet]}
                </span>
              </button>
            )
          })}
        </div>

        {!isFeedbackGoogleSheetsConfigured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Feedback Google Sheets sync is not configured yet. Set `VITE_FEEDBACK_GOOGLE_APPS_SCRIPT_URL` or
            `NEXT_PUBLIC_FEEDBACK_GOOGLE_APPS_SCRIPT_URL` before redeploying on Vercel.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-revisit-border bg-revisit-bg/60 px-4 py-4 text-sm text-revisit-text-secondary">
            <LoaderCircle className="h-4 w-4 animate-spin text-revisit-accent" />
            Loading feedback rows...
          </div>
        ) : activeEntries.length ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-revisit-border bg-revisit-bg/60 px-4 py-3 text-sm text-revisit-text-secondary">
              <span>
                {pendingCountBySheet[activeSheet]} open of {entryCountBySheet[activeSheet]} total
              </span>
              <span>Resolved rows stay at the bottom automatically.</span>
            </div>

            <div className="rounded-2xl border border-revisit-border bg-revisit-bg/60 px-3 py-2 text-xs text-revisit-text-secondary md:hidden">
              Swipe horizontally to view all feedback columns.
            </div>

            <Table className="min-w-[980px]" containerClassName="pb-2 [scrollbar-gutter:stable]">
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[120px] text-right">Resolved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeEntries.map((entry) => {
                  const rowKey = `${activeSheet}:${entry.row}`
                  const isResolved = entry.status
                  const isUpdating = Boolean(updatingRows[rowKey])

                  return (
                    <TableRow key={buildFeedbackId(activeSheet, entry)} className={isResolved ? 'bg-revisit-bg/40' : ''}>
                      <TableCell className={cn('whitespace-normal text-sm text-revisit-text-secondary', isResolved && 'line-through opacity-60')}>
                        {formatTimestamp(entry.timestamp)}
                      </TableCell>
                      <TableCell className={cn('max-w-[16rem] whitespace-normal font-medium text-revisit-text', isResolved && 'line-through opacity-60')}>
                        {entry.title || 'Untitled feedback'}
                      </TableCell>
                      <TableCell className={cn('max-w-[28rem] whitespace-normal text-revisit-text-secondary', isResolved && 'line-through opacity-60')}>
                        {entry.description || '—'}
                      </TableCell>
                      <TableCell className={cn('max-w-[16rem] whitespace-normal text-revisit-text-secondary', isResolved && 'line-through opacity-60')}>
                        {entry.email || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-revisit-text-secondary">
                            {isResolved ? 'Done' : 'Open'}
                          </span>
                          <Switch
                            checked={isResolved}
                            onCheckedChange={(checked) => {
                              void handleToggleStatus(activeSheet, entry, checked)
                            }}
                            disabled={isUpdating || !isFeedbackGoogleSheetsConfigured}
                            className="data-[state=checked]:bg-revisit-accent data-[state=unchecked]:bg-revisit-border"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-revisit-border bg-revisit-bg/55 px-6 py-10 text-center">
            <div className="font-heading text-xl text-revisit-text">{FEEDBACK_TAB_META[activeSheet].emptyTitle}</div>
            <p className="mt-2 text-sm text-revisit-text-secondary">
              {FEEDBACK_TAB_META[activeSheet].emptyDescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FeedbacksPanel
