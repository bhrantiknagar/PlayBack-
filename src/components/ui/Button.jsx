import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className = '', 
  onClick, 
  ...props 
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    transition: 'all var(--transition-normal)',
    cursor: 'pointer',
    border: 'none',
    outline: 'none'
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: '12px' },
    md: { padding: '10px 22px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
    icon: { padding: '10px', borderRadius: '50%' }
  };

  const variants = {
    primary: {
      background: 'var(--accent-gradient)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'var(--text-primary)',
      backdropFilter: 'blur(8px)'
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)'
    }
  };

  return (
    <button
      style={{ ...baseStyles, ...sizes[size], ...variants[variant] }}
      className={`btn ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}
