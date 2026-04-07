import { Component } from 'react';

export default class TracerErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e.message || 'Unknown error' }; }
  componentDidCatch(e) { console.error('[Tracer Error]', e); }
  render() {
    if (this.state.error) return (
      <div style={{ padding: '1.5rem', borderRadius: '0.5rem', background: '#ff6b6b12', border: '1px solid #ff6b6b40', color: '#ff6b6b', fontSize: '0.83rem', lineHeight: 1.6 }}>
        <strong>Tracer crashed:</strong> {this.state.error}
        <br /><br />
        <button onClick={() => this.setState({ error: null })} style={{ padding: '0.3rem 0.75rem', borderRadius: '0.35rem', border: '1px solid #ff6b6b60', background: 'transparent', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.78rem' }}>
          Reset Tracer
        </button>
      </div>
    );
    return this.props.children;
  }
}
