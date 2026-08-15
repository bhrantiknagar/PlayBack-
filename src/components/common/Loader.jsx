import React from 'react';

export function Loader({ text = 'Loading vibes...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'rotateVinyl 1s linear infinite'
      }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{text}</span>
    </div>
  );
}
