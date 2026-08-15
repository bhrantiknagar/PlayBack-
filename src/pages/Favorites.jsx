import React from 'react';
import { Heart, Play } from 'lucide-react';
import { sampleTracks } from '../data/sampleTracks';
import { TrackList } from '../components/music/TrackList';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

export function Favorites() {
  const { favorites, playTrack } = usePlayer();
  const navigate = useNavigate();

  const likedTracks = sampleTracks.filter(t => favorites.includes(t.id));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '24px',
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Heart size={64} color="#fff" fill="#fff" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#f472b6' }}>
            Collection
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800' }}>Liked Songs</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {likedTracks.length} favorite {likedTracks.length === 1 ? 'track' : 'tracks'}
          </p>
        </div>
      </div>

      {likedTracks.length > 0 ? (
        <>
          <div>
            <Button
              variant="primary"
              size="lg"
              icon={Play}
              onClick={() => playTrack(likedTracks[0], likedTracks)}
            >
              Play Liked Tracks
            </Button>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <TrackList tracks={likedTracks} />
          </div>
        </>
      ) : (
        <EmptyState
          icon={Heart}
          title="No Liked Songs Yet"
          description="Click the heart icon on songs as you listen to build your personal favorite collection."
          actionText="Discover Songs"
          onAction={() => navigate('/explore')}
        />
      )}
    </div>
  );
}
