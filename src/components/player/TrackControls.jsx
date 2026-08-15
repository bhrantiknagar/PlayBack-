import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

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
    <div className="control-buttons-row">
      <button
        onClick={() => setIsShuffle(!isShuffle)}
        style={{
          color: isShuffle ? 'var(--accent-primary)' : 'var(--text-muted)',
          transition: 'color var(--transition-fast)'
        }}
        title="Shuffle"
      >
        <Shuffle size={18} />
      </button>

      <button
        onClick={handlePrevTrack}
        style={{ color: 'var(--text-secondary)' }}
        title="Previous Track"
      >
        <SkipBack size={20} fill="currentColor" />
      </button>

      <button
        onClick={togglePlay}
        className="play-pause-circle"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={20} fill="#0b0d13" /> : <Play size={20} fill="#0b0d13" style={{ marginLeft: '2px' }} />}
      </button>

      <button
        onClick={handleNextTrack}
        style={{ color: 'var(--text-secondary)' }}
        title="Next Track"
      >
        <SkipForward size={20} fill="currentColor" />
      </button>

      <button
        onClick={toggleRepeat}
        style={{
          color: repeatMode !== 'off' ? 'var(--accent-primary)' : 'var(--text-muted)',
          position: 'relative',
          transition: 'color var(--transition-fast)'
        }}
        title={`Repeat: ${repeatMode}`}
      >
        <Repeat size={18} />
        {repeatMode === 'one' && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-6px',
            fontSize: '9px',
            fontWeight: 'bold',
            background: 'var(--accent-primary)',
            color: '#fff',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            1
          </span>
        )}
      </button>
    </div>
  );
}
