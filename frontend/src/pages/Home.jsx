import React, { useMemo } from 'react';
import { Play, Flame, Radio, Zap, Clock, Heart, Disc } from 'lucide-react';
import { mockPlaylists } from '../data/mockData';
import { TrackCard } from '../components/music/TrackCard';
import { TrackList } from '../components/music/TrackList';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { PrimaryButton } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

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
    globalTracks: tracks,
    isLibraryLoading,
    libraryError,
    playTrack,
    searchQuery, setSearchQuery,
    selectedEnergy, setSelectedEnergy,
    favorites,
    recentlyPlayed,
    playlists
  } = usePlayer();
  const { user } = useAuth();

  const energyFilters = ['All', 'Focus', 'Drive', 'Euphoria', 'Chill', 'Late Night'];
  const normalizedQuery = (searchQuery || '').trim().toLowerCase();
  const isFiltered = Boolean(normalizedQuery || selectedEnergy !== 'All');

  // ── Search / Energy filtered tracks (Memoized) ──────────────────────
  const filteredTracks = useMemo(() => {
    if (!Array.isArray(tracks)) return [];
    return tracks.filter(track => {
      if (!track) return false;
      const matchesCategory =
        selectedEnergy === 'All' ||
        (track.category && track.category.toLowerCase() === selectedEnergy.toLowerCase()) ||
        (track.energy && track.energy.toLowerCase() === selectedEnergy.toLowerCase());
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
  }, [tracks, selectedEnergy, normalizedQuery]);

  // ── Personalized sections (Memoized) ────────────────────
  const trackById = useMemo(() => Object.fromEntries(tracks.map(t => [t.id, t])), [tracks]);

  // Helper format time
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Continue Listening - tracks with position > 5s
  const continueListeningTracks = useMemo(() => {
    return recentlyPlayed
      .filter(item => item.position > 5)
      .map(item => {
         const track = trackById[item.id];
         if (track) {
           return {
             ...track,
             artwork: track.artwork || track.coverUrl || track.cover || '/images/albums/album-01.jpg',
             savedPosition: item.position
           };
         }
         return null;
      })
      .filter(Boolean)
      .slice(0, 6);
  }, [recentlyPlayed, trackById]);

  // Recently Played — ordered by most recent play, limit 6
  const recentTracks = useMemo(() => {
    return recentlyPlayed
      .map(item => {
        const track = trackById[item.id];
        if (track) {
          return {
            ...track,
            artwork: track.artwork || track.coverUrl || track.cover || '/images/albums/album-01.jpg'
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 6);
  }, [recentlyPlayed, trackById]);

  // Your Favorites — tracks that are liked
  const favoriteTracks = useMemo(() => {
    return tracks.filter(t => favorites.includes(t.id));
  }, [tracks, favorites]);

  // Recently Added — sorted by addedDate if present, otherwise first 6 tracks
  const recentlyAdded = useMemo(() => {
    return [...tracks]
      .sort((a, b) => {
        if (a.addedDate && b.addedDate) return new Date(b.addedDate) - new Date(a.addedDate);
        return 0;
      })
      .slice(0, 6);
  }, [tracks]);

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

  const topResumeTrack = continueListeningTracks[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── Hero Banner ── */}
      {!isFiltered && (
        user ? (
          <div style={{ marginBottom: '10px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px' }}>
              Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user.name ? user.name.split(' ')[0] : 'User'}</span>
            </h1>
            {topResumeTrack && (
              <div style={{
                position: 'relative',
                marginTop: '20px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.14) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(15, 23, 42, 0.8) 100%)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'relative',
                  width: '70px',
                  height: '70px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img
                    src={topResumeTrack.artwork}
                    alt={topResumeTrack.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/albums/album-01.jpg';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Clock size={20} color="#38bdf8" />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#38bdf8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}>
                      Continue Listening
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatTime(topResumeTrack.savedPosition)}
                      {topResumeTrack.duration ? ` / ${formatTime(topResumeTrack.duration)}` : ''}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: '2px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {topResumeTrack.title}
                  </h3>
                  <p style={{
                    fontSize: '13.5px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {topResumeTrack.artist}
                  </p>

                  {topResumeTrack.duration > 0 && (
                    <div style={{
                      width: '100%',
                      maxWidth: '320px',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(100, Math.round((topResumeTrack.savedPosition / topResumeTrack.duration) * 100))}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #38bdf8, #6366f1)',
                        borderRadius: '2px'
                      }} />
                    </div>
                  )}
                </div>

                <PrimaryButton
                  icon={Play}
                  onClick={() => playTrack(topResumeTrack, tracks)}
                  style={{ boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)', flexShrink: 0 }}
                >
                  Resume
                </PrimaryButton>
              </div>
            )}
          </div>
        ) : featuredTrack ? (
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
        ) : null
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
          {/* Continue Listening Grid */}
          {continueListeningTracks.length > 0 && (
            <div>
              <SectionHeader icon={Clock} iconColor="#38bdf8" title="Continue Listening" count={continueListeningTracks.length} />
              <TrackGrid tracks={continueListeningTracks} />
            </div>
          )}

          {/* Recently Played */}
          {recentTracks.length >= SECTION_MIN && (
            <div>
              <SectionHeader icon={Clock} iconColor="#94a3b8" title="Recently Played" count={recentTracks.length} />
              <TrackGrid tracks={recentTracks} />
            </div>
          )}

          {/* Your Playlists (Only if Logged In & Has Playlists) */}
          {user && playlists.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <Radio size={18} color="var(--accent-secondary)" />
                <h2 style={{ fontSize: '19px', fontWeight: '700' }}>Your Playlists</h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '18px'
              }}>
                {playlists.map(pl => (
                  <PlaylistCard key={pl.id} playlist={pl} />
                ))}
              </div>
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

          {/* Curated Sound Vaults (Only for guests or if user has no playlists yet, or just keep it below) */}
          {(!user || playlists.length === 0) && (
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
