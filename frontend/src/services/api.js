import axios from 'axios'

// Single axios instance for the whole app.
// In dev, Vite proxies '/api' -> http://localhost:8000 (see vite.config.js),
// so baseURL stays relative unless VITE_API_BASE_URL is explicitly set
// (e.g. for a production build pointing at a deployed backend).
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach the saved login token to every outgoing request automatically.
// /api/chat and /api/user-type now require login, so callers (AppContext,
// authService) don't each need to remember to add this header themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bis_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Basic response error normalization so components don't each
// have to unwrap axios error shapes individually.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong talking to the BIS Sahayak backend.'
    return Promise.reject(new Error(message))
  }
)

export default api
