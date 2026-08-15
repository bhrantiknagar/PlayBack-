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
    setIsShuffle,
    repeatMode,
    toggleRepeat
  } = usePlayer();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <IconButton
        icon={Shuffle}
        onClick={() => setIsShuffle(!isShuffle)}
        variant={isShuffle ? 'active' : 'default'}
        aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
        title="Shuffle"
        size="sm"
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
        onClick={handleNextTrack}
        aria-label="Next track"
        title="Next"
        size="md"
      />

      <div style={{ position: 'relative' }}>
        <IconButton
          icon={Repeat}
          onClick={toggleRepeat}
          variant={repeatMode !== 'off' ? 'active' : 'default'}
          aria-label={`Repeat mode: ${repeatMode}`}
          title={`Repeat: ${repeatMode}`}
          size="sm"
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
