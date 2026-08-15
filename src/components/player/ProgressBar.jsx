import React, { useState, useRef, useCallback } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer();
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPos, setHoverPos] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(null);
  const barRef = useRef(null);

  const displayTime = isDragging && dragTime !== null ? dragTime : currentTime;
  const percentage = duration > 0 ? Math.min(100, Math.max(0, (displayTime / duration) * 100)) : 0;

  const calculateTimeFromPointer = useCallback((e) => {
    if (!barRef.current || !duration) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    return pos * duration;
  }, [duration]);

  const handlePointerDown = (e) => {
    if (!duration) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const targetTime = calculateTimeFromPointer(e);
    setDragTime(targetTime);
    seek(targetTime);
  };

  const handlePointerMove = (e) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPos(pos * 100);
    setHoverTime(pos * duration);

    if (isDragging) {
      const targetTime = pos * duration;
      setDragTime(targetTime);
      seek(targetTime);
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
      const targetTime = calculateTimeFromPointer(e);
      seek(targetTime);
      setDragTime(null);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', userSelect: 'none' }}>
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
        {formatTime(displayTime)}
      </span>

      {/* Scrub Track Area */}
      <div
        ref={barRef}
        onPointerEnter={() => setIsHovering(true)}
        onPointerLeave={() => {
          if (!isDragging) setIsHovering(false);
        }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          flex: 1,
          position: 'relative',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          touchAction: 'none'
        }}
        role="slider"
        aria-label="Track playback timeline"
        aria-valuenow={displayTime}
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        tabIndex={0}
      >
        {/* Hover Timestamp Preview Tooltip */}
        {(isHovering || isDragging) && hoverTime !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: '18px',
              left: `${isDragging ? percentage : hoverPos}%`,
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
              zIndex: 10,
              whiteSpace: 'nowrap'
            }}
          >
            {formatTime(isDragging ? displayTime : hoverTime)}
          </div>
        )}

        {/* Outer Inactive Rail */}
        <div
          style={{
            width: '100%',
            height: isHovering || isDragging ? '5px' : '4px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.1)',
            position: 'relative',
            transition: 'height var(--transition-fast)'
          }}
        >
          {/* Active Solid Progress Fill */}
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: isHovering || isDragging ? '#6366f1' : '#e2e8f0',
              position: 'relative',
              transition: isDragging ? 'none' : 'background var(--transition-fast)'
            }}
          >
            {/* Draggable Progress Thumb */}
            <div
              style={{
                position: 'absolute',
                right: '-5px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: isHovering || isDragging ? '12px' : '10px',
                height: isHovering || isDragging ? '12px' : '10px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                opacity: isHovering || isDragging ? 1 : 0.85,
                transition: isDragging ? 'none' : 'width 0.15s ease, height 0.15s ease, opacity 0.15s ease'
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
        {duration > 0 ? formatTime(duration) : '--:--'}
      </span>
    </div>
  );
}
