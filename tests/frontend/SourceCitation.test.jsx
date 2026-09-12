import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SourceCitation from '../../frontend/src/components/SourceCitation'

describe('SourceCitation', () => {
  it('renders nothing when there are no sources', () => {
    const { container } = render(<SourceCitation sources={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a source title and section when provided', () => {
    render(
      <SourceCitation
        sources={[{ title: 'IS 2082:2018', section: 'Clause 5.2', url: 'https://example.com' }]}
      />
    )
    expect(screen.getByText('IS 2082:2018')).toBeInTheDocument()
    expect(screen.getByText(/Clause 5.2/)).toBeInTheDocument()
  })
})
