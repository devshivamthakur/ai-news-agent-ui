import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'
import { useAuth } from '../auth-context.jsx'

export default function Dashboard() {
  const { logout } = useAuth()
  const nav = useNavigate()
  const [me, setMe] = useState(null)
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [toggleBusy, setToggleBusy] = useState(false)

  const load = useCallback(async () => {
    setErr('')
    setLoading(true)
    try {
      const [profile, items] = await Promise.all([
        apiFetch('/api/v1/auth/me'),
        apiFetch('/api/v1/news?limit=8'),
      ])
      setMe(profile)
      setNews(items || [])
    } catch (e) {
      if (e.status === 401) {
        logout()
        nav('/login', { replace: true })
        return
      }
      setErr(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [nav, logout])

  useEffect(() => {
    load()
  }, [load])

  async function setSubscribed(next) {
    setToggleBusy(true)
    setErr('')
    try {
      const profile = await apiFetch('/api/v1/auth/me/subscription', {
        method: 'PATCH',
        body: JSON.stringify({ digest_subscribed: next }),
      })
      setMe(profile)
    } catch (e) {
      setErr(e.message || 'Update failed')
    } finally {
      setToggleBusy(false)
    }
  }

  function onLogout() {
    logout()
    nav('/login', { replace: true })
  }

  if (loading && !me) {
    return (
      <div className="card">
        <p className="muted">Loading…</p>
      </div>
    )
  }

  const subscribed = me?.digest_subscribed

  return (
    <div className="dashboard">
      <div className="card">
        <div className="row spread">
          <div>
            <h1>Dashboard</h1>
            <p className="muted">
              Signed in as <strong>{me?.email}</strong>
              {me?.name ? ` · ${me.name}` : ''}
            </p>
          </div>
          <button type="button" className="ghost" onClick={onLogout}>
            Log out
          </button>
        </div>

        {err ? <p className="error">{err}</p> : null}

        <section className="subscription-panel">
          <h2>Daily digest email</h2>
          <p className="muted">
            When subscribed, the aggregator includes you when it sends digest
            emails (along with your interest filters on the backend).
          </p>
          <div className={`status-pill ${subscribed ? 'on' : 'off'}`}>
            {subscribed ? 'Subscribed' : 'Unsubscribed'}
          </div>
          <div className="row actions">
            <button
              type="button"
              disabled={toggleBusy || subscribed}
              onClick={() => setSubscribed(true)}
            >
              Subscribe
            </button>
            <button
              type="button"
              className="ghost"
              disabled={toggleBusy || !subscribed}
              onClick={() => setSubscribed(false)}
            >
              Unsubscribe
            </button>
          </div>
        </section>
      </div>

      <div className="card">
        <h2>Recent headlines</h2>
        <p className="muted">Latest items from your tracked sources.</p>
        {news.length === 0 ? (
          <p className="muted">No articles yet.</p>
        ) : (
          <ul className="news-list">
            {news.map((n) => (
              <li key={n.id}>
                <a href={n.url} target="_blank" rel="noreferrer">
                  {n.title}
                </a>
                <span className="meta">
                  {n.category || '—'} · {n.news_type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
