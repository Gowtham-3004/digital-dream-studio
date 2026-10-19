'use client'

import { useEffect, useRef, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import styles from './DateFilter.module.css'

export type DateField = 'submitted' | 'event'

type DateFilterProps = {
  field: DateField
  onFieldChange: (field: DateField) => void
  range: DateRange | undefined
  onRangeChange: (range: DateRange | undefined) => void
}

const FIELD_LABELS: Record<DateField, string> = {
  submitted: 'Date Submitted',
  event: 'Event Date',
}

const formatDay = (d: Date) =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const daysAgo = (n: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - n)
  return d
}

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: 'Today', range: () => ({ from: daysAgo(0), to: daysAgo(0) }) },
  { label: 'Last 7 days', range: () => ({ from: daysAgo(6), to: daysAgo(0) }) },
  { label: 'Last 30 days', range: () => ({ from: daysAgo(29), to: daysAgo(0) }) },
  {
    label: 'This month',
    range: () => {
      const today = daysAgo(0)
      return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today }
    },
  },
]

export default function DateFilter({ field, onFieldChange, range, onRangeChange }: DateFilterProps) {
  const [open, setOpen] = useState(false)
  const [months, setMonths] = useState(2)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // One month on narrow screens, two otherwise
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setMonths(mq.matches ? 1 : 2)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const label = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${formatDay(range.from)} – ${formatDay(range.to)}`
      : formatDay(range.from)
    : 'All dates'

  return (
    <div className={styles.filter} ref={wrapRef}>
      <div className={styles.toggle} role="group" aria-label="Filter by">
        {(Object.keys(FIELD_LABELS) as DateField[]).map(f => (
          <button
            key={f}
            type="button"
            className={f === field ? styles.toggleActive : styles.toggleBtn}
            aria-pressed={f === field}
            onClick={() => onFieldChange(f)}
          >
            {FIELD_LABELS[f]}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={range?.from ? styles.triggerActive : styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span aria-hidden>📅</span> {label}
      </button>

      {open && (
        <div className={styles.popover} role="dialog" aria-label="Choose date range">
          <div className={styles.presets}>
            {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                className={styles.chip}
                onClick={() => {
                  onRangeChange(p.range())
                  setOpen(false)
                }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              className={styles.clear}
              disabled={!range?.from}
              onClick={() => onRangeChange(undefined)}
            >
              Clear
            </button>
          </div>
          <DayPicker
            mode="range"
            numberOfMonths={months}
            selected={range}
            onSelect={onRangeChange}
            defaultMonth={range?.from ?? (months === 2 ? daysAgo(31) : daysAgo(0))}
            weekStartsOn={1}
          />
        </div>
      )}
    </div>
  )
}
