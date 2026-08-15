import React from 'react';
import { Play, Pause, Heart, Clock } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export function TrackList({ tracks = [], showHeader = true }) {
  const { currentTrack, isPlaying, togglePlay, playTrack, favorites, toggleFavorite } = usePlayer();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr 1fr 80px 48px',
          padding: '10px 16px',
          color: 'var(--text-muted)',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '8px'
        }}>
          <span>#</span>
          <span>Title</span>
          <span>Album</span>
          <span style={{ textAlign: 'right' }}><Clock size={14} /></span>
          <span></span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {tracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          const isLiked = favorites.includes(track.id);

          return (
            <div
              key={track.id}
              onClick={() => playTrack(track, tracks)}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 1fr 80px 48px',
                alignItems: 'center',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)'
              }}
              className="track-row-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isCurrent && isPlaying ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                    <span style={{ width: '3px', background: 'var(--accent-primary)', animation: 'barBounce 0.8s ease-in-out infinite' }} />
                    <span style={{ width: '3px', background: 'var(--accent-primary)', animation: 'barBounce 0.6s ease-in-out infinite 0.2s' }} />
                    <span style={{ width: '3px', background: 'var(--accent-primary)', animation: 'barBounce 0.9s ease-in-out infinite 0.4s' }} />
                  </div>
                ) : (
                  <span style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '13px' }}>
                    {idx + 1}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isCurrent ? '600' : '500',
                    color: isCurrent ? '#a5b4fc' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {track.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {track.artist}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {track.album || 'Single'}
              </span>

              <span style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>
                {formatTime(track.duration)}
              </span>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(track.id);
                  }}
                  style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)', padding: '4px' }}
                >
                  <Heart size={16} fill={isLiked ? '#ec4899' : 'none'} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
