import React from 'react';
import { Play, Flame, Radio, Zap } from 'lucide-react';
import { tracks } from '../data/tracks';
import { mockPlaylists } from '../data/mockData';
import { TrackCard } from '../components/music/TrackCard';
import { TrackList } from '../components/music/TrackList';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { PrimaryButton } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';

export function Home() {
  const { playTrack, searchQuery, setSearchQuery, selectedEnergy, setSelectedEnergy } = usePlayer();

  const energyFilters = ['All', 'Focus', 'Drive', 'Euphoria', 'Chill', 'Late Night'];
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();

  const filteredTracks = tracks.filter(track => {
    // 1. Category / Energy filter
    const matchesCategory =
      selectedEnergy === 'All' ||
      track.category === selectedEnergy ||
      track.energy === selectedEnergy;

    if (!matchesCategory) return false;

    // 2. Real-time multi-field search across title, artist, album, genre
    if (normalizedQuery) {
      const titleMatch = track.title ? track.title.toLowerCase().includes(normalizedQuery) : false;
      const artistMatch = track.artist ? track.artist.toLowerCase().includes(normalizedQuery) : false;
      const albumMatch = track.album ? track.album.toLowerCase().includes(normalizedQuery) : false;
      const genreMatch = track.genre ? track.genre.toLowerCase().includes(normalizedQuery) : false;
      return titleMatch || artistMatch || albumMatch || genreMatch;
    }

    return true;
  });

  const featuredTrack = tracks[0];

  // Dynamic Section Title reflecting Category + Search
  let sectionHeading = 'Sonic Frequencies';
  if (normalizedQuery && selectedEnergy !== 'All') {
    sectionHeading = `Results for "${searchQuery}" in ${selectedEnergy}`;
  } else if (normalizedQuery) {
    sectionHeading = `Search Results for "${searchQuery}"`;
  } else if (selectedEnergy !== 'All') {
    sectionHeading = `${selectedEnergy} Frequencies`;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Featured Hero Banner (Shown on clean unfiltered Home) */}
      {!normalizedQuery && selectedEnergy === 'All' && (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          padding: '44px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.45) 0%, rgba(10, 13, 20, 0.92) 55%, #08090d 100%), url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="flac-hi-res-tag">FEATURED ALBUM</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.7)' }}>
                {featuredTrack.artist}
              </span>
            </div>

            <h1 style={{
              fontSize: '38px',
              fontWeight: '900',
              lineHeight: '1.1',
              letterSpacing: '-1.2px',
              fontFamily: 'var(--font-display)',
              color: '#ffffff'
            }}>
              {featuredTrack.album}
            </h1>

            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.82)', lineHeight: '1.55' }}>
              Experience state-of-the-art cyberpunk synthesis, atmospheric sub-bass, and cinematic spatial acoustics.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
              <PrimaryButton
                size="lg"
                icon={Play}
                onClick={() => playTrack(featuredTrack, tracks)}
              >
                Listen Now
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Energy Vibe Category Filter Pills (Always accessible and synchronized) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '2px 0' }} className="hide-scrollbar">
        {energyFilters.map(filter => {
          const isActive = selectedEnergy === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedEnergy(filter)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12.5px',
                fontWeight: '600',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Recommended Frequencies Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '19px', fontWeight: '700' }}>
              {sectionHeading}
            </h2>
          </div>
          <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'}
          </span>
        </div>

        {filteredTracks.length === 0 ? (
          <EmptyState
            type="search"
            title="No results found"
            description={
              normalizedQuery && selectedEnergy !== 'All'
                ? `No tracks matching "${searchQuery}" in ${selectedEnergy}.`
                : normalizedQuery
                ? "Try another song, artist, or album."
                : `No tracks found in ${selectedEnergy} category.`
            }
            actionText={normalizedQuery && selectedEnergy !== 'All' ? "Reset All Filters" : normalizedQuery ? "Clear Search" : "Show All Tracks"}
            onAction={() => {
              if (normalizedQuery) setSearchQuery('');
              if (selectedEnergy !== 'All') setSelectedEnergy('All');
            }}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
            gap: '18px'
          }}>
            {filteredTracks.map(track => (
              <TrackCard key={track.id} track={track} trackList={filteredTracks} />
            ))}
          </div>
        )}
      </div>

      {/* Curated Sound Vaults (Shown when unfiltered) */}
      {!normalizedQuery && selectedEnergy === 'All' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Radio size={18} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '19px', fontWeight: '700' }}>Curated Sound Vaults</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '18px'
          }}>
            {mockPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </div>
      )}

      {/* Popular Tracks Table (Shown when unfiltered) */}
      {!normalizedQuery && selectedEnergy === 'All' && (
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#f43f5e" />
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Popular Tracks</h2>
            </div>
          </div>

          <TrackList tracks={tracks} />
        </div>
      )}
    </div>
  );
}
