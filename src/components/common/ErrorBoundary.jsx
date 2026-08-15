import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PrimaryButton } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PlayBack caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: 'var(--text-primary)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          margin: '32px auto',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ec4899'
          }}>
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Playback Interrupted</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '380px' }}>
            We encountered a temporary issue while loading this view.
          </p>
          <PrimaryButton
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '8px' }}
          >
            Reload Audio Space
          </PrimaryButton>
        </div>
      );
    }

    return this.props.children;
  }
}
