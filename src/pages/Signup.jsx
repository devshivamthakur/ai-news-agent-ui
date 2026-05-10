import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'
import { useAuth } from '../auth-context.jsx'

export default function Signup() {
  const { setToken } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const trimmedName = name.trim()
      if (!trimmedName) {
        setError('Name is required')
        setLoading(false)
        return
      }
      const body = { email, password, name: trimmedName }
      const data = await apiFetch('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setToken(data.access_token)
      nav('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card narrow">
      <h1>Sign up</h1>
      <p className="muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
      <form onSubmit={onSubmit} className="form">
        <label>
          Name
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password <span className="muted">(min 8 characters)</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? '…' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
