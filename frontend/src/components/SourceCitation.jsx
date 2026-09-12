// Renders the "no important BIS answer without evidence" principle in the UI.
// Expects sources in the shape returned by ai_engine/rag/pipeline.py, e.g.:
// { title: 'IS 2082:2018', section: 'Clause 5.2', url: 'https://...' }
export default function SourceCitation({ sources = [] }) {
  if (!sources.length) return null

  return (
    <div
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px dashed var(--color-border)',
        fontSize: 13
      }}
    >
      <div style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>Sources</div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {sources.map((source, idx) => (
          <li key={idx}>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
            ) : (
              <span>{source.title}</span>
            )}
            {source.section ? (
              <span style={{ color: 'var(--color-text-secondary)' }}> — {source.section}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
