import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayPauseButton } from '../player/PlayPauseButton';

export function ArtistCard({ artist }) {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const isCurrentArtistPlaying = isPlaying && currentTrack?.artist === artist.name;

  const handlePlayArtist = (e) => {
    e.stopPropagation();
    if (isCurrentArtistPlaying) {
      togglePlay();
      return;
    }
    if (artist.tracks && artist.tracks.length > 0) {
      playTrack(artist.tracks[0], artist.tracks);
    }
  };

  return (
    <div
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="music-card-root"
      style={{
        cursor: 'pointer',
        alignItems: 'center',
        textAlign: 'center',
        padding: '18px 14px'
      }}
    >
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        border: '2px solid rgba(99, 102, 241, 0.25)',
        marginBottom: '12px'
      }}>
        <img
          src={artist.avatar}
          alt={artist.name}
          className="music-card-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/albums/album-01.jpg';
          }}
        />

        {/* Hover / Active Play Button Overlay */}
        <div
          className={`music-card-play-overlay ${isCurrentArtistPlaying ? 'is-playing' : ''}`}
          style={{ borderRadius: '50%' }}
        >
          <PlayPauseButton
            isPlaying={isCurrentArtistPlaying}
            onClick={handlePlayArtist}
            size={40}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
        <h4 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {artist.name}
        </h4>
        <p style={{
          fontSize: '12px',
          color: '#a5b4fc',
          fontFamily: 'var(--font-mono)'
        }}>
          {artist.genre}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginTop: '2px'
        }}>
          <span>{artist.trackCount || artist.tracks?.length || 1} {artist.trackCount === 1 ? 'track' : 'tracks'}</span>
          {artist.albumCount > 0 && (
            <>
              <span>•</span>
              <span>{artist.albumCount} {artist.albumCount === 1 ? 'album' : 'albums'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
