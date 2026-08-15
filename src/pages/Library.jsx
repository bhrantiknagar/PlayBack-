import React, { useState } from 'react';
import { Library as LibraryIcon, Heart, Plus } from 'lucide-react';
import { mockPlaylists } from '../data/mockData';
import { tracks } from '../data/tracks';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { TrackList } from '../components/music/TrackList';
import { PrimaryButton, SecondaryButton } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { usePlayer } from '../context/PlayerContext';

export function Library() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'vaults' | 'liked'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [userPlaylists, setUserPlaylists] = useState(mockPlaylists);

  const { favorites } = usePlayer();
  const likedTracks = tracks.filter(t => favorites.includes(t.id));

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      title: newPlaylistTitle,
      description: newPlaylistDesc || 'Custom user audio frequency collection.',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      trackCount: 0,
      creator: 'Master Acoustic',
      duration: '0 min'
    };

    setUserPlaylists(prev => [newPl, ...prev]);
    setNewPlaylistTitle('');
    setNewPlaylistDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
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
            <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>Sound Vaults</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Personal collections, custom mixes, and liked frequencies.</p>
          </div>
        </div>

        <PrimaryButton icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          New Vault
        </PrimaryButton>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {[
          { key: 'all', label: 'All Vaults' },
          { key: 'vaults', label: `Playlists (${userPlaylists.length})` },
          { key: 'liked', label: `Liked Frequencies (${likedTracks.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === tab.key ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: activeTab === tab.key ? '#a5b4fc' : 'var(--text-secondary)',
              border: activeTab === tab.key ? '1px solid var(--accent-primary)' : '1px solid transparent',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'var(--transition-fast)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Playlists Grid */}
      {(activeTab === 'all' || activeTab === 'vaults') && (
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

      {/* Liked Tracks Vault */}
      {(activeTab === 'all' || activeTab === 'liked') && (
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          marginTop: activeTab === 'all' ? '16px' : '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Heart size={20} color="#ec4899" fill="#ec4899" />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Liked Audio Streams</h2>
          </div>

          {likedTracks.length > 0 ? (
            <TrackList tracks={likedTracks} />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
              No liked frequencies in vault yet. Mark songs with heart icon to collect them.
            </p>
          )}
        </div>
      )}

      {/* Create Vault Modal */}
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
