import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export function TrackCard({ track, trackList }) {
  const { currentTrack, isPlaying, togglePlay, playTrack, favorites, toggleFavorite } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const isLiked = favorites.includes(track.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, trackList);
    }
  };

  return (
    <div
      onClick={() => playTrack(track, trackList)}
      style={{
        background: isCurrent ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
        boxShadow: isCurrent ? '0 0 20px var(--accent-glow)' : 'var(--shadow-sm)',
        transition: 'all var(--transition-normal)',
        cursor: 'pointer',
        position: 'relative'
      }}
      className="track-card-hover"
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <img
          src={track.coverUrl}
          alt={track.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={handlePlayClick}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            transform: isCurrent && isPlaying ? 'scale(1)' : 'translateY(8px)',
            opacity: isCurrent && isPlaying ? 1 : 0.9,
            transition: 'all var(--transition-fast)'
          }}
        >
          {isCurrent && isPlaying ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ overflow: 'hidden' }}>
          <h4 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: isCurrent ? '#a5b4fc' : 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {track.title}
          </h4>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {track.artist}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
          style={{
            color: isLiked ? '#ec4899' : 'var(--text-muted)',
            padding: '4px'
          }}
        >
          <Heart size={18} fill={isLiked ? '#ec4899' : 'none'} />
        </button>
      </div>
    </div>
  );
}
