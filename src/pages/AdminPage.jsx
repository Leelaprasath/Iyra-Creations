import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field } from '../components/forms/Field'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import styles from './AdminPage.module.css'

/**
 * /admin — sign in with the admin email + password (checked server-side by
 * api/admin/login.js) and browse contact-form enquiries read from Google Sheets.
 */

const DATE_FMT = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
const formatDate = (iso) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : DATE_FMT.format(d)
}
const DAY_MS = 24 * 60 * 60 * 1000
/** Milliseconds for a stored date (ISO or Apps Script's long date string); 0 when unparseable. */
const toTime = (value) => new Date(value).getTime() || 0

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

/** Fetches enquiries for the signed-in admin. Never throws; touches no React state. */
async function requestEnquiries() {
  try {
    const res = await fetch('/api/admin/enquiries', { cache: 'no-store' })
    if (res.status === 401) return { signedOut: true }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { error: data.error || `Request failed (${res.status})` }
    return { email: data.email, rows: data.rows || [], at: Date.now() }
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' }
  }
}

function downloadCsv(rows) {
  const cols = ['submittedAt', 'name', 'email', 'phone', 'company', 'service', 'budget', 'message']
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `iyra-enquiries-${new Date().toISOString().slice(0, 10)}.csv`,
  })
  a.click()
  URL.revokeObjectURL(url)
}

function LoginForm({ onSignedIn, notice = '' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(notice)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!email.trim() || !password) {
      setError('Enter your admin email and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Sign-in failed.')
      setPassword('')
      onSignedIn()
    } catch (err) {
      setError(err.message || 'Sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.loginWrap}>
      <form className={styles.login} onSubmit={submit} noValidate aria-labelledby="admin-login-title">
        <Logo height={36} />
        <h1 id="admin-login-title" className={styles.loginTitle}>
          Admin sign in<span className="accent">.</span>
        </h1>
        <Field
          name="admin-email"
          label="Email"
          required
          type="email"
          autoComplete="username"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          name="admin-password"
          label="Password"
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className={styles.loginError} role="alert">
          {error}
        </p>
        <Button type="submit" disabled={busy} aria-disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}

function EnquiryCard({ e }) {
  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <div>
          <h2 className={styles.name}>{e.name || '—'}</h2>
          {e.company && <p className={styles.company}>{e.company}</p>}
        </div>
        <time className={styles.date} dateTime={e.submittedAt}>
          {formatDate(e.submittedAt)}
        </time>
      </header>
      <dl className={styles.meta}>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${e.email}`}>{e.email}</a>
          </dd>
        </div>
        {e.phone && (
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${e.phone.replace(/[^\d+]/g, '')}`}>{e.phone}</a>
            </dd>
          </div>
        )}
        <div>
          <dt>Service</dt>
          <dd>{e.service || '—'}</dd>
        </div>
        <div>
          <dt>Budget</dt>
          <dd>{e.budget || '—'}</dd>
        </div>
      </dl>
      <p className={styles.message}>{e.message}</p>
    </article>
  )
}

function Dashboard({ email, rows, loadedAt, loading, error, onRefresh, onSignOut }) {
  const [query, setQuery] = useState('')
  const [service, setService] = useState('')

  const sorted = useMemo(() => [...rows].sort((a, b) => toTime(b.submittedAt) - toTime(a.submittedAt)), [rows])
  const services = useMemo(() => [...new Set(rows.map((r) => r.service).filter(Boolean))].sort(), [rows])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter(
      (r) =>
        (!service || r.service === service) &&
        (!q || [r.name, r.email, r.phone, r.company, r.message].some((v) => String(v).toLowerCase().includes(q))),
    )
  }, [sorted, query, service])

  const lastWeek = rows.filter((r) => loadedAt - toTime(r.submittedAt) < 7 * DAY_MS).length

  return (
    <div className={styles.dash}>
      <header className={styles.top}>
        <div className={styles.brand}>
          <Logo height={28} />
          <span className="label">Enquiries</span>
        </div>
        <div className={styles.account}>
          <span className={styles.who}>{email}</span>
          <button type="button" className={styles.ghost} onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <div className={styles.stat}>
          <span className={styles.statValue}>{rows.length}</span>
          <span className="label">Total enquiries</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{lastWeek}</span>
          <span className="label">Last 7 days</span>
        </div>
      </section>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className="visually-hidden">Search enquiries</span>
          <input
            type="search"
            placeholder="Search name, email, company, message…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className={styles.filter}>
          <span className="visually-hidden">Filter by service</span>
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">All services</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className={styles.ghost} onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        <button type="button" className={styles.ghost} onClick={() => downloadCsv(filtered)} disabled={!filtered.length}>
          Export CSV
        </button>
      </div>

      <div aria-live="polite">
        {error && <p className={styles.alert}>{error}</p>}
        {!error && !loading && filtered.length === 0 && (
          <p className={styles.empty}>{rows.length ? 'No enquiries match your search.' : 'No enquiries yet.'}</p>
        )}
        {filtered.length > 0 && (
          <p className={styles.count}>
            Showing {filtered.length} of {rows.length}
          </p>
        )}
      </div>

      <div className={styles.list}>
        {filtered.map((e) => (
          <EnquiryCard key={e.row} e={e} />
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  useDocumentMeta({ title: 'Admin' })
  useNoIndex()

  // checking | login | ready
  const [view, setView] = useState('checking')
  const [email, setEmail] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loadedAt, setLoadedAt] = useState(0)

  const apply = useCallback((result) => {
    setLoading(false)
    if (result.signedOut) {
      setError('')
      setView('login')
    } else if (result.error) {
      setError(result.error)
      setView((v) => (v === 'checking' ? 'login' : v))
    } else {
      setEmail(result.email)
      setRows(result.rows)
      setLoadedAt(result.at)
      setError('')
      setView('ready')
    }
  }, [])

  const load = () => {
    setLoading(true)
    return requestEnquiries().then(apply)
  }

  useEffect(() => {
    let active = true
    requestEnquiries().then((result) => active && apply(result))
    return () => {
      active = false
    }
  }, [apply])

  const signOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setRows([])
    setEmail('')
    setView('login')
  }

  return (
    <main className={styles.page} id="main">
      {view === 'checking' && <p className={styles.checking}>Loading…</p>}
      {view === 'login' && <LoginForm onSignedIn={load} notice={error} />}
      {view === 'ready' && (
        <Dashboard
          email={email}
          rows={rows}
          loadedAt={loadedAt}
          loading={loading}
          error={error}
          onRefresh={load}
          onSignOut={signOut}
        />
      )}
    </main>
  )
}
