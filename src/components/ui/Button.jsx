import React, { useState } from 'react';

export function Button({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon, 
  className = '', 
  onClick, 
  disabled = false,
  'aria-label': ariaLabel,
  style = {},
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-fast), transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: isPressed ? 'scale(0.96)' : 'scale(1)',
    fontFamily: 'var(--font-primary)'
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: '12px' },
    md: { padding: '9px 20px', fontSize: '13.5px' },
    lg: { padding: '12px 26px', fontSize: '14.5px' }
  };

  const variants = {
    primary: {
      background: '#6366f1',
      color: '#ffffff',
      fontWeight: '600',
      boxShadow: 'none',
      border: '1px solid #6366f1'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      boxShadow: 'var(--shadow-sm)'
    },
    outline: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#ffffff'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)'
    }
  };

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      style={{ ...baseStyles, ...sizes[size], ...variants[variant], ...style }}
      className={`playback-btn ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
    </button>
  );
}

export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props) {
  return <Button variant="secondary" {...props} />;
}

export function GhostButton(props) {
  return <Button variant="ghost" {...props} />;
}
