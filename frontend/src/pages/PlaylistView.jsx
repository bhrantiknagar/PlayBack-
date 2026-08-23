import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, ArrowLeft, Shuffle, Radio } from 'lucide-react';
import { tracks as allTracks } from '../data/tracks';
import { TrackList } from '../components/music/TrackList';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';

export function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, playTrack, setIsShuffle, removeTrackFromPlaylist } = usePlayer();

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Vault Not Found</h2>
        <SecondaryButton onClick={() => navigate('/library')}>Back to Library</SecondaryButton>
      </div>
    );
  }

  // Get the actual track objects from the track IDs
  const playlistTracks = (playlist.trackIds || [])
    .map(trackId => allTracks.find(t => t.id === trackId))
    .filter(Boolean);

  const handleShufflePlay = () => {
    if (playlistTracks.length === 0) return;
    setIsShuffle(true);
    const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];
    playTrack(randomTrack, playlistTracks);
  };

  const handlePlayAll = () => {
    if (playlistTracks.length === 0) return;
    playTrack(playlistTracks[0], playlistTracks);
  };

  const handleRemoveTrack = (trackId) => {
    removeTrackFromPlaylist(playlist.id, trackId);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Custom Back Button */}
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
          transition: 'all var(--transition-fast)'
        }}
        className="back-nav-btn"
      >
        <ArrowLeft size={15} />
        <span>Back to Vaults</span>
      </button>

      {/* Playlist Hero Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '32px',
        padding: '36px',
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.22) 0%, rgba(14, 18, 26, 0.8) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="flac-hi-res-tag">CURATED VAULT</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>USER COLLECTION</span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1px', lineHeight: '1.1' }}>
            {playlist.title}
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: '1.5' }}>
            {playlist.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <span>CURATOR: <strong style={{ color: '#fff' }}>{playlist.creator}</strong></span>
            <span>•</span>
            <span>{playlistTracks.length} TRACKS</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {playlist.duration}
            </span>
          </div>
        </div>
      </div>

      {playlistTracks.length > 0 ? (
        <>
          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <PrimaryButton
              size="lg"
              icon={Play}
              onClick={handlePlayAll}
            >
              Play Vault
            </PrimaryButton>

            <SecondaryButton
              size="lg"
              icon={Shuffle}
              onClick={handleShufflePlay}
            >
              Shuffle
            </SecondaryButton>
          </div>

          {/* Track Listing */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <TrackList tracks={playlistTracks} onRemoveTrack={handleRemoveTrack} />
          </div>
        </>
      ) : (
        <EmptyState
          icon={Radio}
          title="This Vault is Empty"
          description="Browse your library or explore to find tracks and add them to this vault."
          actionText="Discover Frequencies"
          onAction={() => navigate('/explore')}
        />
      )}
    </div>
  );
}
