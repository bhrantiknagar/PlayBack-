import React, { useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { IconButton } from '../ui/IconButton';

export function VolumeControl() {
  const { volume, setVolume, isMuted, setIsMuted } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);

  const effectiveVolume = isMuted ? 0 : volume;

  const calculateVolumeFromPointer = useCallback((e) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    const val = calculateVolumeFromPointer(e);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      const val = calculateVolumeFromPointer(e);
      setVolume(val);
      if (isMuted && val > 0) setIsMuted(false);
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const getVolumeIcon = () => {
    if (effectiveVolume === 0) return VolumeX;
    if (effectiveVolume < 0.5) return Volume1;
    return Volume2;
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '130px', userSelect: 'none' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsHovering(false);
      }}
    >
      <IconButton
        icon={getVolumeIcon()}
        onClick={() => setIsMuted(!isMuted)}
        size="sm"
        aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
        title={isMuted ? 'Unmute' : 'Mute'}
        style={{ color: isMuted ? '#f43f5e' : 'var(--text-secondary)' }}
      />

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          flex: 1,
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
          touchAction: 'none'
        }}
        role="slider"
        aria-label="Volume level"
        aria-valuenow={Math.round(effectiveVolume * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
      >
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
          {/* Solid Volume Level Bar */}
          <div
            style={{
              width: `${effectiveVolume * 100}%`,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: isHovering || isDragging ? '#6366f1' : 'rgba(255, 255, 255, 0.8)',
              position: 'relative',
              transition: isDragging ? 'none' : 'background var(--transition-fast)'
            }}
          >
            {/* Slider Thumb */}
            <div
              style={{
                position: 'absolute',
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: isHovering || isDragging ? '10px' : '8px',
                height: isHovering || isDragging ? '10px' : '8px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 6px rgba(0, 0, 0, 0.5)',
                opacity: isHovering || isDragging ? 1 : 0.75,
                transition: isDragging ? 'none' : 'all var(--transition-fast)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
