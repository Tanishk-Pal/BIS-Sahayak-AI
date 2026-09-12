import UserTypeSelector from '../components/UserTypeSelector'

export default function HomePage() {
  return (
    <div>
      <h1 style={{ marginBottom: 6 }}>BIS Sahayak AI</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Your AI-powered guide to Indian Standards, BIS certification, and consumer services.
      </p>
      <UserTypeSelector />
    </div>
  )
}
