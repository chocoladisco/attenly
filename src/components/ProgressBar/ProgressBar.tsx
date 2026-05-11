interface ProgressBarProps {
  /** A value between 0 and 1. Clamped automatically. */
  value: number
  label?: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{
        width: '100%',
        height: '6px',
        background: '#333',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: '#ffffff',
          transition: 'width 0.2s linear',
        }}
      />
    </div>
  )
}
