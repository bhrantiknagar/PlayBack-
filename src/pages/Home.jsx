import React from 'react';
import { Play, Sparkles, Flame, Radio } from 'lucide-react';
import { sampleTracks } from '../data/sampleTracks';
import { mockPlaylists } from '../data/mockData';
import { TrackCard } from '../components/music/TrackCard';
import { TrackList } from '../components/music/TrackList';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

export function Home() {
  const { playTrack, searchQuery } = usePlayer();

  const filteredTracks = sampleTracks.filter(track => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.genre.toLowerCase().includes(q)
    );
  });

  const featuredTrack = sampleTracks[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Featured Hero Banner (when not searching) */}
      {!searchQuery && (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '48px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(14, 17, 26, 0.95) 100%), url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              width: 'fit-content'
            }}>
              <Sparkles size={14} color="#ec4899" />
              <span>Featured Album Spotlight</span>
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-1px' }}>
              {featuredTrack.album}
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
              Immerse yourself in neon aesthetics and cinematic beats curated by {featuredTrack.artist}.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={() => playTrack(featuredTrack, sampleTracks)}
              >
                Listen Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Songs Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={22} color="#f43f5e" />
            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {filteredTracks.map(track => (
            <TrackCard key={track.id} track={track} trackList={filteredTracks} />
          ))}
        </div>
      </div>

      {/* Curated Playlists */}
      {!searchQuery && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Radio size={22} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Curated Moods & Playlists</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {mockPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </div>
      )}

      {/* Top Chart Tracklist */}
      {!searchQuery && (
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Top Streamed Tracks</h2>
          <TrackList tracks={sampleTracks.slice(0, 5)} />
        </div>
      )}
    </div>
  );
}
