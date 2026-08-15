import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { sampleTracks } from '../../data/sampleTracks';

export function PlaylistCard({ playlist }) {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (sampleTracks.length > 0) {
      playTrack(sampleTracks[0], sampleTracks);
    }
  };

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'all var(--transition-normal)'
      }}
      className="playlist-card-hover"
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={handlePlay}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
            transition: 'transform var(--transition-fast)'
          }}
        >
          <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />
        </button>
      </div>

      <div>
        <h4 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {playlist.title}
        </h4>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginTop: '4px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {playlist.description}
        </p>
      </div>
    </div>
  );
}
