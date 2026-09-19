import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginWithGoogle } from '../services/authService'

export default function GoogleSignInButton() {
  const { loginSuccess } = useAuth()
  const navigate = useNavigate()
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!window.google || !buttonRef.current) return

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const data = await loginWithGoogle(response.credential)
          loginSuccess(data)
          navigate('/chat')
        } catch (err) {
          console.error('Google sign-in failed:', err.message)
        }
      }
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 320
    })
  }, [loginSuccess, navigate])

  return <div ref={buttonRef} />
}
