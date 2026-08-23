import React from 'react';
import { Play, Flame, Radio, Zap, Clock, Heart, Disc } from 'lucide-react';
import { tracks } from '../data/tracks';
import { mockPlaylists } from '../data/mockData';
import { TrackCard } from '../components/music/TrackCard';
import { TrackList } from '../components/music/TrackList';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { PrimaryButton } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';

const SECTION_MIN = 1; // Minimum tracks needed to show a section

// Reusable section header component
function SectionHeader({ icon: Icon, iconColor, title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={18} color={iconColor} />
        <h2 style={{ fontSize: '19px', fontWeight: '700' }}>{title}</h2>
      </div>
      {count != null && (
        <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {count} {count === 1 ? 'track' : 'tracks'}
        </span>
      )}
    </div>
  );
}

// Track card grid
function TrackGrid({ tracks: trackList }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
      gap: '18px'
    }}>
      {trackList.map(track => (
        <TrackCard key={track.id} track={track} trackList={trackList} />
      ))}
    </div>
  );
}

export function Home() {
  const {
    playTrack,
    searchQuery, setSearchQuery,
    selectedEnergy, setSelectedEnergy,
    favorites,
    recentlyPlayed
  } = usePlayer();

  const energyFilters = ['All', 'Focus', 'Drive', 'Euphoria', 'Chill', 'Late Night'];
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();
  const isFiltered = normalizedQuery || selectedEnergy !== 'All';

  // ── Search / Energy filtered tracks ──────────────────────────────────────
  const filteredTracks = tracks.filter(track => {
    const matchesCategory =
      selectedEnergy === 'All' ||
      track.category === selectedEnergy ||
      track.energy === selectedEnergy;
    if (!matchesCategory) return false;
    if (normalizedQuery) {
      return (
        track.title?.toLowerCase().includes(normalizedQuery) ||
        track.artist?.toLowerCase().includes(normalizedQuery) ||
        track.album?.toLowerCase().includes(normalizedQuery) ||
        track.genre?.toLowerCase().includes(normalizedQuery)
      );
    }
    return true;
  });

  // ── Personalized sections (only on unfiltered home) ────────────────────
  const trackById = Object.fromEntries(tracks.map(t => [t.id, t]));

  // Recently Played — ordered by most recent play, limit 6
  const recentTracks = recentlyPlayed
    .map(id => trackById[id])
    .filter(Boolean)
    .slice(0, 6);

  // Your Favorites — tracks that are liked
  const favoriteTracks = tracks.filter(t => favorites.includes(t.id));

  // Recently Added — sorted by addedDate if present, otherwise first 6 tracks
  const recentlyAdded = [...tracks]
    .sort((a, b) => {
      if (a.addedDate && b.addedDate) return new Date(b.addedDate) - new Date(a.addedDate);
      return 0;
    })
    .slice(0, 6);

  const featuredTrack = tracks[0];

  // Dynamic section title
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

      {/* ── Hero Banner ── */}
      {!isFiltered && (
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
            <h1 style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-1.2px', fontFamily: 'var(--font-display)', color: '#ffffff' }}>
              {featuredTrack.album}
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.82)', lineHeight: '1.55' }}>
              Experience state-of-the-art cyberpunk synthesis, atmospheric sub-bass, and cinematic spatial acoustics.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
              <PrimaryButton size="lg" icon={Play} onClick={() => playTrack(featuredTrack, tracks)}>
                Listen Now
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* ── Energy Filter Pills ── */}
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

      {/* ── Search / Filter Results ── */}
      <div>
        <SectionHeader icon={Zap} iconColor="var(--accent-primary)" title={sectionHeading} count={filteredTracks.length} />
        {filteredTracks.length === 0 ? (
          <EmptyState
            type="search"
            title="No results found"
            description={
              normalizedQuery && selectedEnergy !== 'All'
                ? `No tracks matching "${searchQuery}" in ${selectedEnergy}.`
                : normalizedQuery
                ? 'Try another song, artist, or album.'
                : `No tracks found in ${selectedEnergy} category.`
            }
            actionText={normalizedQuery && selectedEnergy !== 'All' ? 'Reset All Filters' : normalizedQuery ? 'Clear Search' : 'Show All Tracks'}
            onAction={() => {
              if (normalizedQuery) setSearchQuery('');
              if (selectedEnergy !== 'All') setSelectedEnergy('All');
            }}
          />
        ) : (
          <TrackGrid tracks={filteredTracks} />
        )}
      </div>

      {/* ── Personalized sections — only on clean unfiltered home ── */}
      {!isFiltered && (
        <>
          {/* Recently Played */}
          {recentTracks.length >= SECTION_MIN && (
            <div>
              <SectionHeader icon={Clock} iconColor="#38bdf8" title="Recently Played" count={recentTracks.length} />
              <TrackGrid tracks={recentTracks} />
            </div>
          )}

          {/* Your Favorites */}
          {favoriteTracks.length >= SECTION_MIN && (
            <div>
              <SectionHeader icon={Heart} iconColor="#ec4899" title="Your Favorites" count={favoriteTracks.length} />
              <TrackGrid tracks={favoriteTracks} />
            </div>
          )}

          {/* Recently Added */}
          {recentlyAdded.length >= SECTION_MIN && (
            <div>
              <SectionHeader icon={Disc} iconColor="#a855f7" title="Recently Added" count={recentlyAdded.length} />
              <TrackGrid tracks={recentlyAdded} />
            </div>
          )}

          {/* Curated Sound Vaults */}
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

          {/* Popular Tracks table */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Flame size={18} color="#f43f5e" />
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Popular Tracks</h2>
            </div>
            <TrackList tracks={tracks} />
          </div>
        </>
      )}
    </div>
  );
}
