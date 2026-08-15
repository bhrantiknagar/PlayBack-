import React, { useState, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer();
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPos, setHoverPos] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const barRef = useRef(null);

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePointerMove = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPos(pos * 100);
    setHoverTime(pos * duration);
  };

  const handlePointerDown = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pos * duration);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      {/* Current Time Monospace Display */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: '500',
        color: 'var(--text-muted)',
        width: '36px',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {formatTime(currentTime)}
      </span>

      {/* Scrub Track Area */}
      <div
        ref={barRef}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => setIsHovering(false)}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        style={{
          flex: 1,
          position: 'relative',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        role="slider"
        aria-label="Track playback timeline"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        tabIndex={0}
      >
        {/* Hover Timestamp Preview Tooltip */}
        {isHovering && hoverTime !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: '18px',
              left: `${hoverPos}%`,
              transform: 'translateX(-50%)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: '#ffffff',
              pointerEvents: 'none',
              boxShadow: 'var(--shadow-md)',
              whiteSpace: 'nowrap'
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Background Track */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: isHovering ? '6px' : '4px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.08)',
            transition: 'height var(--transition-fast)'
          }}
        >
          {/* Active Gradient Progress Fill */}
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: 'var(--progress-gradient)',
              position: 'relative'
            }}
          >
            {/* Draggable Progress Thumb */}
            <div
              style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: isHovering ? '12px' : '10px',
                height: isHovering ? '12px' : '10px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.5), 0 0 6px var(--accent-primary)',
                opacity: isHovering ? 1 : 0.85,
                transition: 'width 0.15s ease, height 0.15s ease, opacity 0.15s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Duration Monospace Display */}
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: '500',
        color: 'var(--text-muted)',
        width: '36px',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {formatTime(duration)}
      </span>
    </div>
  );
}
