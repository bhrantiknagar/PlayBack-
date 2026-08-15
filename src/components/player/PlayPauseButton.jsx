import React, { useState } from 'react';

export function PlayPauseButton({
  isPlaying = false,
  onClick,
  size = 46,
  'aria-label': ariaLabel,
  className = ''
}) {
  const [isPressing, setIsPressing] = useState(false);

  const handlePointerDown = () => {
    setIsPressing(true);
  };

  const handlePointerUp = () => {
    setIsPressing(false);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel || (isPlaying ? 'Pause' : 'Play')}
      title={isPlaying ? 'Pause' : 'Play'}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'var(--play-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px var(--accent-glow-primary)',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        transform: isPressing ? 'scale(0.92)' : 'scale(1)',
        border: 'none',
        outline: 'none',
        flexShrink: 0,
        cursor: 'pointer'
      }}
      className={`play-pause-morph-btn ${className}`}
    >
      <svg
        width={size * 0.44}
        height={size * 0.44}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{
          color: '#ffffff',
          transition: 'transform 0.2s ease',
          transform: isPlaying ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        {isPlaying ? (
          // Pause Bars (▮ ▮)
          <g>
            <rect x="5" y="4" width="4.5" height="16" rx="1.5" />
            <rect x="14.5" y="4" width="4.5" height="16" rx="1.5" />
          </g>
        ) : (
          // Play Triangle (▶)
          <path
            d="M7 4.5V19.5C7 20.3 7.9 20.8 8.6 20.4L20.2 12.9C20.8 12.5 20.8 11.5 20.2 11.1L8.6 3.6C7.9 3.2 7 3.7 7 4.5Z"
            style={{ transform: 'translateX(1px)' }}
          />
        )}
      </svg>
    </button>
  );
}
