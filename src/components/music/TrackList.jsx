import React from 'react';
import { Heart, Plus, Clock } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import { IconButton } from '../ui/IconButton';

export function TrackList({ tracks = [], showHeader = true }) {
  const { currentTrack, isPlaying, playTrack, favorites, toggleFavorite, addToQueue } = usePlayer();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px 2fr 1.5fr 1fr 70px 76px',
          padding: '8px 16px',
          color: 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: '600',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '6px'
        }}>
          <span>#</span>
          <span>Title / Artist</span>
          <span>Album</span>
          <span>Spec</span>
          <span style={{ textAlign: 'right' }}><Clock size={12} /></span>
          <span style={{ textAlign: 'right' }}>Actions</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {tracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          const isLiked = favorites.includes(track.id);

          return (
            <div
              key={track.id}
              onClick={() => playTrack(track, tracks)}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 2fr 1.5fr 1fr 70px 76px',
                alignItems: 'center',
                padding: '9px 16px',
                borderRadius: 'var(--radius-sm)',
                background: isCurrent ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                border: isCurrent ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'background var(--transition-fast), border-color var(--transition-fast)'
              }}
              className="track-row-hover"
            >
              {/* Index or Soft Mini-Wave Indicator */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isCurrent && isPlaying ? (
                  // Soft 3-bar sinusoidal mini-wave
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                    <span style={{ width: '2.5px', borderRadius: '1px', background: '#06b6d4', animation: 'softWave1 0.9s ease-in-out infinite' }} />
                    <span style={{ width: '2.5px', borderRadius: '1px', background: '#6366f1', animation: 'softWave2 0.7s ease-in-out infinite 0.15s' }} />
                    <span style={{ width: '2.5px', borderRadius: '1px', background: '#ec4899', animation: 'softWave3 0.85s ease-in-out infinite 0.3s' }} />
                  </div>
                ) : (
                  <span style={{
                    color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                )}
              </div>

              {/* Title & Artist with Artwork */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingRight: '12px' }}>
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-xs)', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '13.5px',
                    fontWeight: isCurrent ? '600' : '500',
                    color: isCurrent ? '#ffffff' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {track.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: isCurrent ? '#a5b4fc' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '1px'
                  }}>
                    {track.artist}
                  </div>
                </div>
              </div>

              {/* Album (Level 2 Hierarchy) */}
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>
                {track.album || 'Single'}
              </span>

              {/* Technical Spec (Level 3 Hierarchy - Quieter) */}
              <div>
                <span style={{
                  fontSize: '10.5px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {track.bpm ? `${track.bpm} BPM` : 'FLAC'}
                </span>
              </div>

              {/* Duration */}
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                {formatTime(track.duration)}
              </span>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <IconButton
                  icon={Plus}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(track);
                  }}
                  size="sm"
                  aria-label="Add to playback queue"
                  title="Add to queue"
                />

                <IconButton
                  icon={Heart}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(track.id);
                  }}
                  variant={isLiked ? 'danger' : 'default'}
                  className={isLiked ? 'animate-heart-pop' : ''}
                  size="sm"
                  aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                  title="Favorite"
                  style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
