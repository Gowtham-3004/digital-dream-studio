'use client'

import { useMemo, useState, FormEvent } from 'react'
import type { DateRange } from 'react-day-picker'
import DateFilter, { type DateField } from './DateFilter'
import styles from './page.module.css'

type Row = {
  Timestamp: string
  Name: string
  Partner: string
  Email: string
  Phone: string
  Date: string
  Service: string
  Message: string
}

// Event dates arrive as "YYYY-MM-DD" from <input type="date">; parse those as local
// days so IST doesn't shift them. Anything else (e.g. an ISO string from Sheets) goes to Date.
const parseRowDate = (row: Row, field: DateField): Date | null => {
  const raw = field === 'submitted' ? row.Timestamp : row.Date
  if (!raw) return null
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
  const d = ymd ? new Date(+ymd[1], +ymd[2] - 1, +ymd[3]) : new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

export default function ResponsesPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dateField, setDateField] = useState<DateField>('submitted')
  const [range, setRange] = useState<DateRange | undefined>()

  const filteredRows = useMemo(() => {
    if (!range?.from) return rows
    const from = dayStart(range.from)
    const to = dayStart(range.to ?? range.from)
    const matches = rows.filter(r => {
      const d = parseRowDate(r, dateField)
      if (!d) return false
      const day = dayStart(d)
      return day >= from && day <= to
    })
    if (dateField === 'event') {
      // Upcoming-first view: earliest event date at the top
      matches.sort((a, b) => parseRowDate(a, 'event')!.getTime() - parseRowDate(b, 'event')!.getTime())
    }
    return matches
  }, [rows, range, dateField])

  const isFiltered = !!range?.from

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.status === 401) {
        setError('Incorrect password.')
        return
      }
      if (!res.ok) {
        setError('Failed to fetch responses. Try again.')
        return
      }

      const data: Row[] = await res.json()
      // Newest submissions first; rows without a valid timestamp sink to the bottom
      const toTime = (r: Row) => new Date(r.Timestamp).getTime() || 0
      setRows([...data].sort((a, b) => toTime(b) - toTime(a)))
      setAuthenticated(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <main className={styles.loginWrap}>
        <form className={styles.loginCard} onSubmit={handleLogin}>
          <h1 className={styles.loginTitle}>Responses</h1>
          <p className={styles.loginSub}>Enter the admin password to view form submissions.</p>
          <input
            className={styles.passwordInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button className={styles.loginBtn} type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'View Responses →'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className={styles.tableWrap}>
      <div className={styles.header}>
        <h1 className={styles.tableTitle}>Form Responses</h1>
        <span className={styles.count}>
          {isFiltered && `${filteredRows.length} of `}
          {rows.length} submission{rows.length !== 1 ? 's' : ''}
        </span>
        {rows.length > 0 && (
          <div className={styles.filterBar}>
            <DateFilter
              field={dateField}
              onFieldChange={setDateField}
              range={range}
              onRangeChange={setRange}
            />
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>No submissions yet.</p>
      ) : filteredRows.length === 0 ? (
        <p className={styles.empty}>
          No submissions in this date range.{' '}
          <button type="button" className={styles.clearLink} onClick={() => setRange(undefined)}>
            Clear filter
          </button>
        </p>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Date Submitted</th>
                <th>Name</th>
                <th>Partner</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event Date</th>
                <th>Service</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{row.Timestamp ? new Date(row.Timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td>{row.Name || '—'}</td>
                  <td>{row.Partner || '—'}</td>
                  <td><a href={`mailto:${row.Email}`} className={styles.link}>{row.Email || '—'}</a></td>
                  <td>{row.Phone || '—'}</td>
                  <td>{row.Date || '—'}</td>
                  <td>{row.Service || '—'}</td>
                  <td className={styles.messageCell}>{row.Message || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
