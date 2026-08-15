import React from 'react';
import { Heart, Play, Shuffle } from 'lucide-react';
import { tracks } from '../data/tracks';
import { TrackList } from '../components/music/TrackList';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

export function Favorites() {
  const { favorites, playTrack, setIsShuffle } = usePlayer();
  const navigate = useNavigate();

  const likedTracks = tracks.filter(t => favorites.includes(t.id));

  const handleShuffleLiked = () => {
    if (likedTracks.length === 0) return;
    setIsShuffle(true);
    const randomTrack = likedTracks[Math.floor(Math.random() * likedTracks.length)];
    playTrack(randomTrack, likedTracks);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Liked Vault Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '28px',
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.22) 0%, rgba(99, 102, 241, 0.16) 60%, rgba(14, 18, 26, 0.9) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(236, 72, 153, 0.18)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 28px rgba(236, 72, 153, 0.35)',
          flexShrink: 0
        }}>
          <Heart size={56} color="#fff" fill="#fff" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="flac-hi-res-tag">PERSONAL VAULT</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#f472b6' }}>ENCRYPTED ARCHIVE</span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1px' }}>
            Liked Frequencies
          </h1>

          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            {likedTracks.length} high-fidelity {likedTracks.length === 1 ? 'track' : 'tracks'} collected in your personal archive.
          </p>
        </div>
      </div>

      {likedTracks.length > 0 ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <PrimaryButton
              size="lg"
              icon={Play}
              onClick={() => playTrack(likedTracks[0], likedTracks)}
            >
              Play Liked
            </PrimaryButton>

            <SecondaryButton
              size="lg"
              icon={Shuffle}
              onClick={handleShuffleLiked}
            >
              Shuffle Liked
            </SecondaryButton>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <TrackList tracks={likedTracks} />
          </div>
        </>
      ) : (
        <EmptyState
          icon={Heart}
          title="No Liked Frequencies Yet"
          description="Click the heart icon on any frequency while listening to preserve it in your personal vault."
          actionText="Discover Frequencies"
          onAction={() => navigate('/explore')}
        />
      )}
    </div>
  );
}
