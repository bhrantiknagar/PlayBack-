import React from 'react';

export function Badge({ children, variant = 'primary', className = '' }) {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    background: variant === 'primary' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.08)',
    color: variant === 'primary' ? '#a5b4fc' : 'var(--text-secondary)',
    border: variant === 'primary' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-subtle)'
  };

  return (
    <span style={styles} className={className}>
      {children}
    </span>
  );
}
