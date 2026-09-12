import api from './api'

// Wraps calls to backend/app/api/routes/chat.py
// Expected backend contract (adjust once chat.py's real schema is confirmed):
//   POST /api/chat
//   body: { message: string, userType: 'consumer' | 'manufacturer', sessionId?: string }
//   response: { reply: string, sources?: Array<{ title, url, section }>, sessionId: string }
export async function sendChatMessage({ message, userType, sessionId }) {
  const { data } = await api.post('/chat', { message, userType, sessionId })
  return data
}

export async function fetchHealth() {
  const { data } = await api.get('/health')
  return data
}
