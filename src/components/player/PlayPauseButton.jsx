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
        boxShadow: '0 4px 14px var(--accent-glow-subtle)',
        transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        transform: isPressing ? 'scale(0.94)' : 'scale(1)',
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
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease'
        }}
      >
        {isPlaying ? (
          // Two clean, vertical, centered pause bars (▮ ▮)
          <g>
            <rect x="6" y="4.5" width="3.5" height="15" rx="1.2" />
            <rect x="14.5" y="4.5" width="3.5" height="15" rx="1.2" />
          </g>
        ) : (
          // Centered Play Triangle (▶)
          <path
            d="M8 5.14v13.72c0 .8.88 1.3 1.58.88l11.02-6.86c.68-.42.68-1.4 0-1.82L9.58 4.26C8.88 3.84 8 4.34 8 5.14Z"
          />
        )}
      </svg>
    </button>
  );
}
