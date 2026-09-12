import { useCallback, useState } from 'react'
import { sendChatMessage } from '../services/chatService'
import { useAppContext } from '../context/AppContext'

// Manages the message list + loading/error state for the chat interface.
// The AI orchestration itself lives entirely in the backend (ai_engine/agents/orchestrator.py);
// this hook is intentionally "dumb" - it just sends/receives.
export function useChat() {
  const { userType } = useAppContext()
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  const sendMessage = useCallback(
    async (text) => {
      if (!text?.trim()) return

      const userMessage = { role: 'user', content: text, id: crypto.randomUUID() }
      setMessages((prev) => [...prev, userMessage])
      setIsSending(true)
      setError(null)

      try {
        const data = await sendChatMessage({ message: text, userType, sessionId })
        setSessionId(data.sessionId ?? sessionId)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            sources: data.sources ?? [],
            id: crypto.randomUUID()
          }
        ])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsSending(false)
      }
    },
    [userType, sessionId]
  )

  return { messages, sendMessage, isSending, error }
}
