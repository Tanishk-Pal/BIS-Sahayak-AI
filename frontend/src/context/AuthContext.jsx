import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCurrentUser } from '../services/authService'

// Kept separate from AppContext.jsx on purpose - AppContext owns chat/UI
// state, this owns *who's logged in* and their onboarding state. Wrapped
// around AppProvider in main.jsx so both are available everywhere.
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('bis_token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch {
        localStorage.removeItem('bis_token')
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [token])

  const loginSuccess = (data) => {
    localStorage.setItem('bis_token', data.access_token)
    setToken(data.access_token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('bis_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, isLoading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
