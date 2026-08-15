import React from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Slider } from '../ui/Slider';

export function VolumeControl() {
  const { volume, setVolume, isMuted, setIsMuted } = usePlayer();

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '130px' }}>
      <button
        onClick={toggleMute}
        style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
}
