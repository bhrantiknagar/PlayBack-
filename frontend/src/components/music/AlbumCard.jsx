import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Disc } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayPauseButton } from '../player/PlayPauseButton';
import { getAlbumTracks } from '../../data/albums';

export function AlbumCard({ album }) {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const albumTracks = getAlbumTracks(album);
  const isCurrentAlbum = currentTrack?.album === album.title;

  const handlePlayAlbum = (e) => {
    e.stopPropagation();
    if (isCurrentAlbum) {
      togglePlay();
      return;
    }
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0], albumTracks);
    }
  };

  return (
    <div
      onClick={() => navigate(`/album/${album.id}`)}
      className="music-card-root"
      style={{ cursor: 'pointer' }}
    >
      <div className="music-card-cover-box">
        <img
          src={album.artwork}
          alt={album.title}
          className="music-card-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/albums/album-01.jpg';
          }}
        />

        {/* Hover / Active Play Button Overlay */}
        <div className={`music-card-play-overlay ${isCurrentAlbum && isPlaying ? 'is-playing' : ''}`}>
          <PlayPauseButton
            isPlaying={isPlaying && isCurrentAlbum}
            onClick={handlePlayAlbum}
            size={42}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <h4 style={{
          fontSize: '14.5px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {album.title}
        </h4>
        <p style={{
          fontSize: '12.5px',
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {album.artist}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginTop: '2px'
        }}>
          <span>{album.releaseYear || '2024'}</span>
          <span>•</span>
          <span>{albumTracks.length} {albumTracks.length === 1 ? 'track' : 'tracks'}</span>
        </div>
      </div>
    </div>
  );
}
