import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <h2>Page not found</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  )
}
