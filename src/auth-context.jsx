import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getToken as readToken, setToken as writeToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(readToken)

  const setToken = useCallback((next) => {
    writeToken(next)
    setTokenState(readToken())
  }, [])

  const logout = useCallback(() => {
    writeToken(null)
    setTokenState(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthed: Boolean(token),
      setToken,
      logout,
    }),
    [token, setToken, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth requires AuthProvider')
  return ctx
}
