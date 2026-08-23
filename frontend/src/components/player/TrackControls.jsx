import React from 'react';
import { SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayPauseButton } from './PlayPauseButton';
import { IconButton } from '../ui/IconButton';

export function TrackControls() {
  const {
    isPlaying,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat
  } = usePlayer();

  const getRepeatTitle = () => {
    if (repeatMode === 'one') return 'Repeat: One Track';
    if (repeatMode === 'all') return 'Repeat: All Tracks';
    return 'Repeat: Off';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {/* Shuffle Button (Subtle accent only when active) */}
      <IconButton
        icon={Shuffle}
        onClick={toggleShuffle}
        variant={isShuffle ? 'active' : 'default'}
        aria-label={isShuffle ? 'Shuffle is on. Click to turn off.' : 'Shuffle is off. Click to turn on.'}
        title={isShuffle ? 'Shuffle: On' : 'Shuffle: Off'}
        size="sm"
        style={{
          color: isShuffle ? 'var(--accent-primary)' : 'var(--text-secondary)'
        }}
      />

      <IconButton
        icon={SkipBack}
        onClick={handlePrevTrack}
        aria-label="Previous track"
        title="Previous"
        size="md"
      />

      <PlayPauseButton
        isPlaying={isPlaying}
        onClick={togglePlay}
        size={44}
      />

      <IconButton
        icon={SkipForward}
        onClick={() => handleNextTrack(true)}
        aria-label="Next track"
        title="Next"
        size="md"
      />

      {/* Repeat Button (OFF / ALL / ONE with subtle badge) */}
      <div style={{ position: 'relative' }}>
        <IconButton
          icon={Repeat}
          onClick={toggleRepeat}
          variant={repeatMode !== 'off' ? 'active' : 'default'}
          aria-label={getRepeatTitle()}
          title={getRepeatTitle()}
          size="sm"
          style={{
            color: repeatMode !== 'off' ? 'var(--accent-primary)' : 'var(--text-secondary)'
          }}
        />
        {repeatMode === 'one' && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            fontSize: '8.5px',
            fontWeight: 'bold',
            background: 'var(--accent-primary)',
            color: '#fff',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            1
          </span>
        )}
      </div>
    </div>
  );
}
