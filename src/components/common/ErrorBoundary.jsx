import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Playback Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-primary)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          margin: '20px'
        }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {this.state.error?.message || 'An unexpected playback error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '16px',
              padding: '8px 20px',
              background: 'var(--accent-gradient)',
              color: '#fff',
              borderRadius: 'var(--radius-full)'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
