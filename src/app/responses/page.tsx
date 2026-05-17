'use client'

import { useState, FormEvent } from 'react'
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

export default function ResponsesPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      setRows(data)
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
        <span className={styles.count}>{rows.length} submission{rows.length !== 1 ? 's' : ''}</span>
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>No submissions yet.</p>
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
              {rows.map((row, i) => (
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
