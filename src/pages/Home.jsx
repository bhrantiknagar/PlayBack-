import React from 'react';
import { Play, Flame, Radio, Zap } from 'lucide-react';
import { sampleTracks } from '../data/sampleTracks';
import { mockPlaylists } from '../data/mockData';
import { TrackCard } from '../components/music/TrackCard';
import { TrackList } from '../components/music/TrackList';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { PrimaryButton } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

export function Home() {
  const { playTrack, searchQuery, selectedEnergy } = usePlayer();

  const filteredTracks = sampleTracks.filter(track => {
    // Energy filter
    if (selectedEnergy !== 'All' && track.energy !== selectedEnergy) {
      return false;
    }
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q) ||
        (track.format && track.format.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featuredTrack = sampleTracks[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Featured Hero Banner */}
      {!searchQuery && selectedEnergy === 'All' && (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '44px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(14, 18, 26, 0.85) 60%, #080a10 100%), url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ maxWidth: '620px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="flac-hi-res-tag">SPOTLIGHT RELEASE</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.7)' }}>
                {featuredTrack.format}
              </span>
            </div>

            {/* Level 1 Hierarchy: Album Title */}
            <h1 style={{
              fontSize: '40px',
              fontWeight: '900',
              lineHeight: '1.1',
              letterSpacing: '-1.5px',
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {featuredTrack.album}
            </h1>

            {/* Level 2 Hierarchy: Description */}
            <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.55' }}>
              Experience state-of-the-art cyberpunk synthesis, sub-harmonic textures and spatial acoustic architecture curated by <strong style={{ color: '#fff' }}>{featuredTrack.artist}</strong>.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
              <PrimaryButton
                size="lg"
                icon={Play}
                onClick={() => playTrack(featuredTrack, sampleTracks)}
              >
                Listen Master
              </PrimaryButton>

              {/* Level 3 Hierarchy: Technical Specs */}
              <div style={{ display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span>BPM: <strong style={{ color: '#fff' }}>{featuredTrack.bpm}</strong></span>
                <span>•</span>
                <span>KEY: <strong style={{ color: '#fff' }}>{featuredTrack.key}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Frequencies Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedEnergy !== 'All' ? `${selectedEnergy} Frequencies` : 'Sonic Frequencies'}
            </h2>
          </div>
          <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {filteredTracks.length} tracks
          </span>
        </div>

        {filteredTracks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '13.5px' }}>
            No tracks found matching your filter.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {filteredTracks.map(track => (
              <TrackCard key={track.id} track={track} trackList={filteredTracks} />
            ))}
          </div>
        )}
      </div>

      {/* Curated Sound Vaults */}
      {!searchQuery && selectedEnergy === 'All' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Radio size={20} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Curated Sound Vaults</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px'
          }}>
            {mockPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </div>
      )}

      {/* Top Streamed Audio Tracks Table */}
      {!searchQuery && selectedEnergy === 'All' && (
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#f43f5e" />
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Real-time Stream Matrix</h2>
            </div>
            <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              LOSSLESS 24-BIT / 96kHz ACTIVE
            </span>
          </div>

          <TrackList tracks={sampleTracks} />
        </div>
      )}
    </div>
  );
}
