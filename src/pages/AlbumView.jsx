import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, ArrowLeft, Shuffle, Disc, Sparkles } from 'lucide-react';
import { albums, getAlbumTracks } from '../data/albums';
import { TrackList } from '../components/music/TrackList';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatTime';

export function AlbumView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, setIsShuffle } = usePlayer();

  const album = albums.find(a => a.id === id) || albums[0];
  const albumTracks = getAlbumTracks(album);

  const totalDurationSeconds = albumTracks.reduce((acc, t) => acc + (t.duration || 180), 0);
  const isCurrentAlbumPlaying = isPlaying && currentTrack?.album === album.title;

  const handlePlayAlbum = () => {
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0], albumTracks);
    }
  };

  const handleShuffleAlbum = () => {
    if (albumTracks.length === 0) return;
    setIsShuffle(true);
    const randomIndex = Math.floor(Math.random() * albumTracks.length);
    playTrack(albumTracks[randomIndex], albumTracks);
  };

  const ambientColor = album.ambientColor || '#6366f1';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/library')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: '500',
          width: 'fit-content',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)'
        }}
        className="back-nav-btn"
      >
        <ArrowLeft size={15} />
        <span>Back to Sound Vaults</span>
      </button>

      {/* Album Hero Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '32px',
        padding: '36px',
        background: `linear-gradient(180deg, ${ambientColor}33 0%, rgba(14, 18, 26, 0.85) 100%)`,
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${ambientColor}44`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px ${ambientColor}15`
      }}>
        {/* Album Cover */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          flexShrink: 0,
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)'
        }}>
          <img
            src={album.artwork}
            alt={album.title}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/albums/album-01.jpg';
            }}
          />
        </div>

        {/* Album Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="flac-hi-res-tag">STUDIO MASTER</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>
              {album.genre || 'Audiophile Release'}
            </span>
          </div>

          <h1 style={{
            fontSize: '38px',
            fontWeight: '900',
            letterSpacing: '-1px',
            lineHeight: '1.15',
            color: '#ffffff',
            margin: '2px 0'
          }}>
            {album.title}
          </h1>

          <h3 style={{
            fontSize: '17px',
            fontWeight: '600',
            color: 'var(--text-secondary)'
          }}>
            By <span style={{ color: '#ffffff' }}>{album.artist}</span> • <span style={{ color: 'var(--text-muted)' }}>{album.releaseYear || '2024'}</span>
          </h3>

          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            lineHeight: '1.5'
          }}>
            {album.description}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            marginTop: '4px'
          }}>
            <span>{albumTracks.length} {albumTracks.length === 1 ? 'TRACK' : 'TRACKS'}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {formatTime(totalDurationSeconds)}
            </span>
            <span>•</span>
            <span>{album.plays || '1.2M'} PLAYS</span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <PrimaryButton
          size="lg"
          icon={Play}
          onClick={handlePlayAlbum}
        >
          {isCurrentAlbumPlaying ? 'Playing Album' : 'Play Album'}
        </PrimaryButton>

        <SecondaryButton
          size="lg"
          icon={Shuffle}
          onClick={handleShuffleAlbum}
        >
          Shuffle Album
        </SecondaryButton>
      </div>

      {/* Album Tracks Listing */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Disc size={18} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Album Tracklist</h2>
        </div>

        <TrackList tracks={albumTracks} />
      </div>
    </div>
  );
}
