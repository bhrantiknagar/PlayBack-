import React from 'react';

export function Loader({ type = 'cards', count = 4 }) {
  if (type === 'tracks') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer"
            style={{
              height: '56px',
              borderRadius: 'var(--radius-sm)',
              width: '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
      gap: '18px',
      width: '100%'
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div
            className="skeleton-shimmer"
            style={{
              width: '100%',
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-sm)'
            }}
          />
          <div className="skeleton-shimmer" style={{ width: '70%', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ width: '45%', height: '12px', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
}
