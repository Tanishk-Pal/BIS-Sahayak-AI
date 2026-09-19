import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Sits inside ProtectedRoute, specifically around the chat experience.
// If a logged-in user hasn't picked Consumer/Manufacturer yet, send them
// to the picker instead of straight into chat.
export default function RequireUserType({ children }) {
  const { user } = useAuth()

  if (!user?.user_type) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
