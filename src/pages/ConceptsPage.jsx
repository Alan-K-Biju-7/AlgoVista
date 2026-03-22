import { Link } from 'react-router-dom';

const card = {
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  padding: '1.5rem',
};

const badge = (color) => ({
  display: 'inline-block',
  padding: '0.2rem 0.55rem',
  borderRadius: '0.35rem',
  fontSize: '0.7rem',
  fontWeight: '700',
  background: color + '22',
  color: color,
  border: '1px solid ' + color + '44',
  marginRight: '0.4rem',
});

const complexity = (label, value, color) => (
  <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '1rem' }}>
    {label}: <span style={{ color }}>{value}</span>
  </span>
);

function ConceptsPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Concepts</h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: '42rem', lineHeight: 1.7 }}>
        Every data structure and algorithm in AlgoVista — with a plain-English explanation,
        time complexity, and a direct link into the live simulator.
      </p>
