import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { IconButton } from '../ui/IconButton';

export function VolumeControl() {
  const { volume, setVolume, isMuted, setIsMuted } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);
  const trackRef = useRef(null);

  const effectiveVolume = isMuted ? 0 : volume;

  const handlePointerDown = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const val = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  const getVolumeIcon = () => {
    if (effectiveVolume === 0) return VolumeX;
    if (effectiveVolume < 0.5) return Volume1;
    return Volume2;
  };

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '130px' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
        style={{
          flex: 1,
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative'
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
            height: isHovering ? '5px' : '4px',
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
              background: isHovering ? '#6366f1' : 'rgba(255, 255, 255, 0.8)',
              position: 'relative',
              transition: 'background var(--transition-fast)'
            }}
          >
            {/* Slider Thumb */}
            <div
              style={{
                position: 'absolute',
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: isHovering ? '10px' : '8px',
                height: isHovering ? '10px' : '8px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 0 6px rgba(0, 0, 0, 0.5)',
                opacity: isHovering ? 1 : 0.75,
                transition: 'all var(--transition-fast)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
