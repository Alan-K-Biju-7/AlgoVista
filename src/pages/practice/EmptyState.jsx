export default function EmptyState({ topicLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Coming soon</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '30ch' }}>Problems for {topicLabel} are being added. Check back soon.</p>
    </div>
  );
}
