import { createContext, useContext, useState } from 'react'

// Holds cross-page state:
// - userType: 'consumer' | 'manufacturer' | null
// - productContext: the manufacturer's product details collected so far
// Kept minimal on purpose. Expand as Phase 6 (Product Intelligence) and
// Phase 7 (Compliance Engine) add real fields.
const AppContext = createContext(undefined)

export function AppProvider({ children }) {
  const [userType, setUserType] = useState(null)
  const [productContext, setProductContext] = useState(null)

  const value = {
    userType,
    setUserType,
    productContext,
    setProductContext
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (ctx === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return ctx
}
