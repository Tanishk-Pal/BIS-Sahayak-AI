import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: 'Assistant' }
]

export default function Navbar() {
  const location = useLocation()

  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)'
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-text-primary)' }}>
          BIS Sahayak <span style={{ color: 'var(--color-primary)' }}>AI</span>
        </Link>

        <nav style={{ display: 'flex', gap: 20 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color:
                  location.pathname === link.to
                    ? 'var(--color-primary)'
                    : 'var(--color-text-secondary)',
                fontWeight: location.pathname === link.to ? 600 : 500
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
