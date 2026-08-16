import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Shuffle, Flame, Disc, CheckCircle2 } from 'lucide-react';
import { getArtistByIdOrName } from '../data/artists';
import { TrackList } from '../components/music/TrackList';
import { AlbumCard } from '../components/music/AlbumCard';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

export function ArtistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, setIsShuffle } = usePlayer();

  const artist = getArtistByIdOrName(id);
  const isCurrentArtistPlaying = isPlaying && currentTrack?.artist === artist.name;

  const handlePlayArtist = () => {
    if (artist.tracks && artist.tracks.length > 0) {
      playTrack(artist.tracks[0], artist.tracks);
    }
  };

  const handleShuffleArtist = () => {
    if (!artist.tracks || artist.tracks.length === 0) return;
    setIsShuffle(true);
    const randomIndex = Math.floor(Math.random() * artist.tracks.length);
    playTrack(artist.tracks[randomIndex], artist.tracks);
  };

  const ambientColor = artist.ambientColor || '#6366f1';

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
        <span>Back to Music Library</span>
      </button>

      {/* Artist Hero Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        padding: '36px',
        background: `linear-gradient(135deg, ${ambientColor}28 0%, rgba(14, 18, 26, 0.9) 65%, #08090d 100%)`,
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${ambientColor}44`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px ${ambientColor}15`,
        flexWrap: 'wrap'
      }}>
        {/* Artist Portrait */}
        <div style={{
          position: 'relative',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
          border: `3px solid ${ambientColor}`
        }}>
          <img
            src={artist.avatar}
            alt={artist.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/albums/album-01.jpg';
            }}
          />
        </div>

        {/* Artist Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#34d399" />
            <span className="flac-hi-res-tag">VERIFIED ARTIST</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#a5b4fc', marginLeft: '4px' }}>
              {artist.genre || 'Electronic / Audiophile'}
            </span>
          </div>

          <h1 style={{
            fontSize: '40px',
            fontWeight: '900',
            letterSpacing: '-1.2px',
            lineHeight: '1.1',
            color: '#ffffff',
            margin: '2px 0'
          }}>
            {artist.name}
          </h1>

          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            lineHeight: '1.5'
          }}>
            Original audio productions and studio frequency recordings available in high-resolution master quality.
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
            <span>{artist.tracks.length} {artist.tracks.length === 1 ? 'TRACK' : 'TRACKS'}</span>
            <span>•</span>
            <span>{artist.albums.length} {artist.albums.length === 1 ? 'ALBUM' : 'ALBUMS'}</span>
            <span>•</span>
            <span>{artist.playsFormatted || '1.2M'} PLAYS</span>
          </div>
        </div>
      </div>

      {/* Transport Action Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <PrimaryButton
          size="lg"
          icon={Play}
          onClick={handlePlayArtist}
        >
          {isCurrentArtistPlaying ? 'Playing Artist' : 'Play Artist'}
        </PrimaryButton>

        <SecondaryButton
          size="lg"
          icon={Shuffle}
          onClick={handleShuffleArtist}
        >
          Shuffle Artist
        </SecondaryButton>
      </div>

      {/* Popular Tracks Section */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Flame size={18} color="#f43f5e" />
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Popular Tracks</h2>
        </div>

        <TrackList tracks={artist.tracks} />
      </div>

      {/* Albums / Discography Section */}
      {artist.albums && artist.albums.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Disc size={18} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Albums & Releases</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {artist.albums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
