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
  const [isHovered, setIsHovered] = useState(false);

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

  const getVariantStyles = () => {
    if (isHovered && !disabled) {
      if (variant === 'primary') {
        return {
          background: '#4f46e5',
          color: '#ffffff',
          fontWeight: '600',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          border: '1px solid #4f46e5'
        };
      }
      if (variant === 'secondary') {
        return {
          background: 'rgba(255, 255, 255, 0.12)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'var(--shadow-sm)'
        };
      }
      if (variant === 'outline') {
        return {
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff'
        };
      }
      if (variant === 'ghost') {
        return {
          background: 'rgba(255, 255, 255, 0.06)',
          color: 'var(--text-primary)'
        };
      }
    }

    if (variant === 'primary') {
      return {
        background: 'var(--accent-primary)',
        color: '#ffffff',
        fontWeight: '600',
        boxShadow: 'none',
        border: '1px solid var(--accent-primary)'
      };
    }
    if (variant === 'secondary') {
      return {
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        boxShadow: 'var(--shadow-sm)'
      };
    }
    if (variant === 'outline') {
      return {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#ffffff'
      };
    }
    return {
      background: 'transparent',
      color: 'var(--text-secondary)'
    };
  };

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ ...baseStyles, ...sizes[size], ...getVariantStyles(), ...style }}
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
