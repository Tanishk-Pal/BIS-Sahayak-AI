import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

// The first real decision point in the product: is this a consumer
// question or a manufacturer compliance journey? Sets userType in
// AppContext, which the chat/backend use to route to the right agent
// (consumer_agent.py vs manufacturer_agent.py).
export default function UserTypeSelector() {
  const { setUserType } = useAppContext()
  const navigate = useNavigate()

  const choose = (type) => {
    setUserType(type)
    navigate('/chat')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <button
        className="card"
        onClick={() => choose('consumer')}
        style={{ textAlign: 'left', border: '1px solid var(--color-border)' }}
      >
        <h3 style={{ margin: '0 0 8px' }}>I'm a Consumer</h3>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Check ISI marks, verify a BIS licence, understand hallmarking, or file a complaint.
        </p>
      </button>

      <button
        className="card"
        onClick={() => choose('manufacturer')}
        style={{ textAlign: 'left', border: '1px solid var(--color-border)' }}
      >
        <h3 style={{ margin: '0 0 8px' }}>I'm a Manufacturer</h3>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Find which standards and QCOs apply to your product and get a compliance roadmap.
        </p>
      </button>
    </div>
  )
}
