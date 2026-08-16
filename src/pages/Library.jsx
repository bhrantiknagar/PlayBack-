import React, { useState, useMemo } from 'react';
import { Library as LibraryIcon, Disc, Users, Music2, Radio, Plus, ArrowUpDown, Play } from 'lucide-react';
import { mockPlaylists } from '../data/mockData';
import { tracks } from '../data/tracks';
import { albums } from '../data/albums';
import { getArtists } from '../data/artists';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { TrackList } from '../components/music/TrackList';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { usePlayer } from '../context/PlayerContext';

export function Library() {
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' | 'artists' | 'songs' | 'vaults'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'alpha' | 'popular'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [userPlaylists, setUserPlaylists] = useState(mockPlaylists);

  const { playTrack } = usePlayer();

  // Distinct artists derived from centralized dataset
  const artistsList = useMemo(() => {
    return getArtists();
  }, []);

  // Sorted Albums
  const sortedAlbums = useMemo(() => {
    const list = [...albums];
    if (sortBy === 'alpha') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'popular') {
      return list.sort((a, b) => (b.playCountNumber || 0) - (a.playCountNumber || 0));
    }
    // Default 'recent'
    return list.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));
  }, [sortBy]);

  // Sorted Songs
  const sortedTracks = useMemo(() => {
    const list = [...tracks];
    if (sortBy === 'alpha') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'popular') {
      return list.sort((a, b) => {
        const pA = parseInt(String(a.plays || '0').replace(/,/g, ''), 10) || 0;
        const pB = parseInt(String(b.plays || '0').replace(/,/g, ''), 10) || 0;
        return pB - pA;
      });
    }
    return list;
  }, [sortBy]);

  // Sorted Artists
  const sortedArtists = useMemo(() => {
    const list = [...artistsList];
    if (sortBy === 'alpha') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'popular') {
      return list.sort((a, b) => b.totalPlays - a.totalPlays);
    }
    return list;
  }, [artistsList, sortBy]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      title: newPlaylistTitle,
      description: newPlaylistDesc || 'Custom user audio frequency collection.',
      coverUrl: '/images/albums/album-02.jpg',
      trackCount: 0,
      creator: 'Master Acoustic',
      duration: '0 min'
    };

    setUserPlaylists(prev => [newPl, ...prev]);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setIsCreateModalOpen(false);
  };

  const tabs = [
    { key: 'albums', label: 'Albums', icon: Disc, count: albums.length },
    { key: 'artists', label: 'Artists', icon: Users, count: artistsList.length },
    { key: 'songs', label: 'Songs', icon: Music2, count: tracks.length },
    { key: 'vaults', label: 'Sound Vaults', icon: Radio, count: userPlaylists.length }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a5b4fc'
          }}>
            <LibraryIcon size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Music Library</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Browse your curated master recordings by albums, artists, songs, and vaults.</p>
          </div>
        </div>

        {activeTab === 'vaults' && (
          <PrimaryButton icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
            New Vault
          </PrimaryButton>
        )}
      </div>

      {/* Tabs and Sorting Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        {/* Category Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }} className="hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  opacity: 0.7,
                  marginLeft: '2px'
                }}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown (Available for Albums, Artists, Songs) */}
        {activeTab !== 'vaults' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={12} /> SORT BY:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '12.5px',
                fontWeight: '500',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="recent" style={{ background: '#0e121a', color: '#fff' }}>Recently Added</option>
              <option value="alpha" style={{ background: '#0e121a', color: '#fff' }}>Alphabetical (A-Z)</option>
              <option value="popular" style={{ background: '#0e121a', color: '#fff' }}>Most Played</option>
            </select>
          </div>
        )}
      </div>

      {/* 1. Albums Tab View */}
      {activeTab === 'albums' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {sortedAlbums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {/* 2. Artists Tab View */}
      {activeTab === 'artists' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '20px'
        }}>
          {sortedArtists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}

      {/* 3. Songs Tab View */}
      {activeTab === 'songs' && (
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <TrackList tracks={sortedTracks} />
        </div>
      )}

      {/* 4. Vaults (Playlists) Tab View */}
      {activeTab === 'vaults' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px'
          }}>
            {userPlaylists.map(pl => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </div>
      )}

      {/* Create Sound Vault Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Sound Vault">
        <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Vault Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midnight Cyber Drive"
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '13.5px'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Acoustic Description
            </label>
            <textarea
              rows={3}
              placeholder="Sonic mood, tempo range, or intended listening environment..."
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '13.5px',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <SecondaryButton type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit">Create Vault</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
