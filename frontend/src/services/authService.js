import api from './api'

export async function signup({ email, password, full_name }) {
  const { data } = await api.post('/signup', { email, password, full_name })
  return data
}

export async function login({ email, password }) {
  const { data } = await api.post('/login', { email, password })
  return data
}

export async function loginWithGoogle(idToken) {
  const { data } = await api.post('/auth/google', { id_token: idToken })
  return data
}

export async function fetchCurrentUser() {
  // Token is attached automatically by the api.js request interceptor.
  const { data } = await api.get('/me')
  return data
}

export async function setUserType(userType) {
  const { data } = await api.post('/user-type', { user_type: userType })
  return data
}
