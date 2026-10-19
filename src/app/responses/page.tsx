'use client'

import { useEffect, useMemo, useRef, useState, FormEvent } from 'react'
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
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const selectAllRef = useRef<HTMLInputElement>(null)

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

  // Selection only ever covers visible rows, so drop it whenever the filter changes
  useEffect(() => {
    setSelected(new Set())
  }, [range, dateField])

  const selectableKeys = useMemo(
    () => filteredRows.map(r => r.Timestamp).filter(Boolean),
    [filteredRows]
  )
  const allSelected = selectableKeys.length > 0 && selectableKeys.every(k => selected.has(k))
  const someSelected = selected.size > 0 && !allSelected

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected
  }, [someSelected])

  const toggleRow = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(selectableKeys))
  }

  const handleDelete = async () => {
    const count = selected.size
    if (!count) return
    if (!confirm(`Delete ${count} response${count !== 1 ? 's' : ''}? This cannot be undone.`)) return

    setDeleting(true)
    setDeleteError('')
    try {
      const timestamps = [...selected]
      const res = await fetch('/api/admin/responses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ timestamps }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setDeleteError(data?.error ?? 'Failed to delete responses.')
        return
      }
      const removed = new Set(timestamps)
      setRows(prev => prev.filter(r => !removed.has(r.Timestamp)))
      setSelected(new Set())
    } catch {
      setDeleteError('Network error. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

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
        {selected.size > 0 && (
          <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : `Delete (${selected.size})`}
          </button>
        )}
        {deleteError && <p className={styles.errorMsg}>{deleteError}</p>}
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
                <th className={styles.checkCell}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all visible responses"
                    checked={allSelected}
                    disabled={selectableKeys.length === 0}
                    onChange={toggleAll}
                  />
                </th>
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
                <tr key={row.Timestamp || i} className={selected.has(row.Timestamp) ? styles.selectedRow : undefined}>
                  <td className={styles.checkCell}>
                    <input
                      type="checkbox"
                      aria-label={`Select response from ${row.Name || 'unknown'}`}
                      checked={selected.has(row.Timestamp)}
                      disabled={!row.Timestamp}
                      onChange={() => toggleRow(row.Timestamp)}
                    />
                  </td>
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
