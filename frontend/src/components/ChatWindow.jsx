import { useState } from 'react'
import { useChat } from '../hooks/useChat'
import { useAppContext } from '../context/AppContext'
import SourceCitation from './SourceCitation'

export default function ChatWindow() {
  const { userType } = useAppContext()
  const { messages, sendMessage, isSending, error } = useChat()
  const [draft, setDraft] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = draft
    setDraft('')
    sendMessage(text)
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        Mode: <strong>{userType ?? 'not selected'}</strong>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Ask about a standard, a certification, or describe the product you manufacture.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: msg.role === 'user' ? 'var(--color-primary)' : '#f0f2f5',
              color: msg.role === 'user' ? '#fff' : 'var(--color-text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px'
            }}
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            {msg.role === 'assistant' && <SourceCitation sources={msg.sources} />}
          </div>
        ))}

        {isSending && (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            BIS Sahayak is thinking…
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your question…"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}
        />
        <button type="submit" className="btn-primary" disabled={isSending || !draft.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
