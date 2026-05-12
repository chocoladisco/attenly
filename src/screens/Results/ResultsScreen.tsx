import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../context/SessionContext'
import { Button } from '../../components/Button/Button'
import type { TestEvent, TestResult } from '../../types/session'

// ─── CSV download ─────────────────────────────────────────────────────────────
function downloadResultCsv(result: TestResult) {
  const headers = ['type', 'timestampMs', 'reactionMs', 'shape', 'isTarget']
  const rows = result.rawEvents.map((e) => [
    e.type,
    e.timestampMs,
    e.reactionMs ?? '',
    e.shape ?? '',
    e.isTarget ?? '',
  ])
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `attenly-${result.testId}-${result.completedAt}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Chart constants ──────────────────────────────────────────────────────────
const SVG_W = 460
const PAD_L = 44
const PAD_R = 8
const PAD_T = 10
const PAD_B = 20
const CHART_W = SVG_W - PAD_L - PAD_R
const CHART_H = 110

const HIT_COLOR = '#4ade80'
const MISS_COLOR = '#f87171'
const ERR_COLOR = '#fb923c'

// ─── Reaction-time bar chart ──────────────────────────────────────────────────
function ReactionTimeChart({ events }: { events: ReadonlyArray<TestEvent> }) {
  const { t } = useTranslation()
  const hits = events.filter((e) => e.type === 'response_correct' && e.reactionMs != null)

  if (hits.length === 0) {
    return (
      <p style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.8rem' }}>
        {t('results.noHits')}
      </p>
    )
  }

  const maxMs = Math.max(...hits.map((h) => h.reactionMs!), 100)
  const midMs = Math.round(maxMs / 2)
  const totalH = PAD_T + CHART_H + PAD_B
  const baseline = PAD_T + CHART_H

  const avgMs = hits.reduce((s, h) => s + h.reactionMs!, 0) / hits.length
  const avgY = PAD_T + CHART_H - (avgMs / maxMs) * CHART_H

  const pointX = (i: number) =>
    hits.length === 1 ? PAD_L + CHART_W / 2 : PAD_L + (i / (hits.length - 1)) * CHART_W
  const pointY = (h: (typeof hits)[number]) => PAD_T + CHART_H - (h.reactionMs! / maxMs) * CHART_H

  const polylinePoints = hits.map((h, i) => `${pointX(i)},${pointY(h)}`).join(' ')

  return (
    <svg
      data-testid="reaction-time-chart"
      viewBox={`0 0 ${SVG_W} ${totalH}`}
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Y gridlines */}
      {[0, 0.5, 1].map((frac) => {
        const y = PAD_T + CHART_H - frac * CHART_H
        const label = frac === 0 ? '0' : frac === 0.5 ? `${midMs}` : `${maxMs}`
        return (
          <g key={frac}>
            <line x1={PAD_L} y1={y} x2={SVG_W - PAD_R} y2={y} stroke="#222" strokeWidth={1} />
            <text x={PAD_L - 4} y={y + 4} fill="#555" fontSize={9} textAnchor="end">
              {label}
            </text>
          </g>
        )
      })}

      {/* Axes */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={baseline} stroke="#444" strokeWidth={1} />
      <line x1={PAD_L} y1={baseline} x2={SVG_W - PAD_R} y2={baseline} stroke="#444" strokeWidth={1} />

      {/* Line */}
      <polyline points={polylinePoints} fill="none" stroke={HIT_COLOR} strokeWidth={2} opacity={0.85} />

      {/* Dots */}
      {hits.map((h, i) => (
        <circle key={i} cx={pointX(i)} cy={pointY(h)} r={3} fill={HIT_COLOR} opacity={0.9} />
      ))}

      {/* Average line */}
      <line
        x1={PAD_L}
        y1={avgY}
        x2={SVG_W - PAD_R}
        y2={avgY}
        stroke={HIT_COLOR}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />
      <text x={SVG_W - PAD_R - 2} y={avgY - 3} fill={HIT_COLOR} fontSize={8} textAnchor="end" opacity={0.7}>
        {t('results.avgMs', { ms: Math.round(avgMs) })}
      </text>

      {/* Y-axis unit label */}
      <text x={PAD_L - 4} y={PAD_T - 2} fill="#555" fontSize={9} textAnchor="end">
        ms
      </text>
    </svg>
  )
}

// ─── Event timeline ───────────────────────────────────────────────────────────
function EventTimeline({
  events,
  completedAt,
}: {
  events: ReadonlyArray<TestEvent>
  completedAt: number
}) {
  const relevant = events.filter(
    (e) =>
      e.type === 'response_correct' || e.type === 'response_incorrect' || e.type === 'miss',
  )

  if (relevant.length === 0) return null

  const startMs = events[0]?.timestampMs ?? 0
  const duration = Math.max(completedAt - startMs, 1)
  const PAD_X = 8
  const lineW = SVG_W - PAD_X * 2
  const timelineH = 44
  const lineY = 20

  const dotColor = (type: string) => {
    if (type === 'response_correct') return HIT_COLOR
    if (type === 'miss') return MISS_COLOR
    return ERR_COLOR
  }

  return (
    <svg
      data-testid="event-timeline"
      viewBox={`0 0 ${SVG_W} ${timelineH}`}
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Track line */}
      <line x1={PAD_X} y1={lineY} x2={SVG_W - PAD_X} y2={lineY} stroke="#333" strokeWidth={1} />

      {/* Start / end labels */}
      <text x={PAD_X} y={timelineH - 4} fill="#444" fontSize={9}>
        0s
      </text>
      <text x={SVG_W - PAD_X} y={timelineH - 4} fill="#444" fontSize={9} textAnchor="end">
        {Math.round(duration / 1000)}s
      </text>

      {/* Event markers */}
      {relevant.map((e, i) => {
        const x = PAD_X + ((e.timestampMs - startMs) / duration) * lineW
        return (
          <circle key={i} cx={x} cy={lineY} r={5} fill={dotColor(e.type)} opacity={0.85} />
        )
      })}
    </svg>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function TimelineLegend() {
  const { t } = useTranslation()
  const items = [
    { color: HIT_COLOR, label: t('results.legend.hit') },
    { color: MISS_COLOR, label: t('results.legend.miss') },
    { color: ERR_COLOR, label: t('results.legend.commissionError') },
  ]
  return (
    <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#aaa' }}>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <svg width={10} height={10} viewBox="0 0 10 10">
            <circle cx={5} cy={5} r={4} fill={color} />
          </svg>
          {label}
        </span>
      ))}
    </div>
  )
}

// ─── Section heading ─────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: '0 0 0.5rem',
      }}
    >
      {children}
    </p>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function ResultsScreen() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const { state } = useSession()
  const { result } = state
  const { t } = useTranslation()

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h2
        style={{
          fontFamily: 'monospace',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          marginBottom: '2rem',
        }}
      >
        {t('results.title')}
      </h2>

      {result === null ? (
        <p style={{ color: '#aaa' }}>{t('results.noResults')}</p>
      ) : (
        <>
          {/* Stats table */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '2rem',
              fontFamily: 'monospace',
            }}
          >
            {[
              [t('results.score'), result.score],
              [t('results.accuracy'), `${Math.round(result.accuracy * 100)}%`],
              [t('results.avgReactionTime'), `${Math.round(result.reactionTimeMs)} ms`],
              [t('results.hits'), result.hits],
              [t('results.misses'), result.misses],
              [t('results.commissionErrors'), result.commissions],
            ].map(([label, value]) => (
              <div key={label as string}>
                <span style={{ color: '#aaa' }}>{label}</span>
                <span style={{ float: 'right' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Reaction time chart */}
          <div style={{ marginBottom: '2rem' }}>
            <SectionLabel>{t('results.reactionTimeSection')}</SectionLabel>
            <ReactionTimeChart events={result.rawEvents} />
          </div>

          {/* Event timeline */}
          <div style={{ marginBottom: '2rem' }}>
            <SectionLabel>{t('results.eventTimelineSection')}</SectionLabel>
            <EventTimeline events={result.rawEvents} completedAt={result.completedAt} />
            <div style={{ marginTop: '0.5rem' }}>
              <TimelineLegend />
            </div>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => navigate('/')}>{t('results.home')}</Button>
        <Button variant="secondary" onClick={() => navigate(`/tests/${testId}/configure`)}>
          {t('results.tryAgain')}
        </Button>
        {result !== null && (
          <Button variant="secondary" onClick={() => downloadResultCsv(result)}>
            {t('results.downloadCsv')}
          </Button>
        )}
      </div>
    </div>
  )
}
