import React from 'react';

export function Loader({ text = 'Loading music...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      gap: '14px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '2.5px solid rgba(255, 255, 255, 0.08)',
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'rotateVinyl 0.9s linear infinite'
      }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-primary)' }}>{text}</span>
    </div>
  );
}
