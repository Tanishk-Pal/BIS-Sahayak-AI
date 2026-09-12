// Requires vitest + @testing-library/react to be added to frontend/package.json
// (see tests/README.md). Written against the component as built; adjust
// selectors if UserTypeSelector.jsx changes.
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProvider } from '../../frontend/src/context/AppContext'
import UserTypeSelector from '../../frontend/src/components/UserTypeSelector'

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>
  )
}

describe('UserTypeSelector', () => {
  it('renders both consumer and manufacturer options', () => {
    renderWithProviders(<UserTypeSelector />)
    expect(screen.getByText(/consumer/i)).toBeInTheDocument()
    expect(screen.getByText(/manufacturer/i)).toBeInTheDocument()
  })
})
