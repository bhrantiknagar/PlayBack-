import React, { useState } from 'react';

export function IconButton({
  icon: Icon,
  onClick,
  'aria-label': ariaLabel,
  title,
  size = 'md',
  variant = 'default', // 'default' | 'active' | 'danger'
  className = '',
  disabled = false,
  iconProps = {},
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeStyles = {
    sm: { width: '32px', height: '32px', iconSize: 16 },
    md: { width: '38px', height: '38px', iconSize: 19 },
    lg: { width: '44px', height: '44px', iconSize: 22 }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const getVariantStyles = () => {
    if (variant === 'active') {
      return {
        color: 'var(--accent-primary)',
        background: 'rgba(99, 102, 241, 0.12)'
      };
    }
    if (variant === 'danger') {
      return {
        color: '#f43f5e',
        background: 'transparent'
      };
    }
    return {
      color: 'var(--text-secondary)',
      background: 'transparent'
    };
  };

  const handlePointerDown = () => {
    setIsPressed(true);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      aria-label={ariaLabel || title}
      title={title || ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background var(--transition-fast), color var(--transition-fast), transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isPressed ? 'scale(0.92)' : 'scale(1)',
        ...getVariantStyles()
      }}
      className={`icon-btn ${className}`}
      {...props}
    >
      {Icon && <Icon size={currentSize.iconSize} {...iconProps} />}
    </button>
  );
}
