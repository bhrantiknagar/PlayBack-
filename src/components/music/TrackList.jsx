import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import { IconButton } from '../ui/IconButton';

export function TrackList({ tracks = [], showHeader = true }) {
  const { currentTrack, isPlaying, playTrack, favorites, toggleFavorite } = usePlayer();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px 2.5fr 1.8fr 70px 48px',
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
          <span style={{ textAlign: 'right' }}><Clock size={12} /></span>
          <span style={{ textAlign: 'right' }}>Like</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {tracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          const isLiked = favorites.includes(track.id);
          const isHighQuality = track.quality === 'Hi-Res' || track.quality === 'Lossless';

          return (
            <div
              key={track.id}
              onClick={() => playTrack(track, tracks)}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 2.5fr 1.8fr 70px 48px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: isCurrent ? '600' : '500',
                      color: isCurrent ? '#ffffff' : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {track.title}
                    </span>
                    {isHighQuality && (
                      <span className="flac-hi-res-tag" style={{ fontSize: '8.5px', padding: '1px 4px' }}>
                        {track.quality}
                      </span>
                    )}
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

              {/* Album */}
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>
                {track.album || 'Single'}
              </span>

              {/* Duration */}
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                {formatTime(track.duration)}
              </span>

              {/* Favorite Action Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
