import React, { useState } from 'react';
import { Library as LibraryIcon, Heart, Plus, FolderHeart } from 'lucide-react';
import { mockPlaylists } from '../data/mockData';
import { sampleTracks } from '../data/sampleTracks';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { TrackList } from '../components/music/TrackList';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

export function Library() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'playlists' | 'liked'
  const { favorites } = usePlayer();

  const likedTracks = sampleTracks.filter(t => favorites.includes(t.id));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LibraryIcon size={28} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Your Music Library</h1>
        </div>
        <Button variant="primary" icon={Plus}>Create Playlist</Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {['all', 'playlists', 'liked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'capitalize',
              transition: 'var(--transition-fast)'
            }}
          >
            {tab === 'liked' ? `Liked Songs (${likedTracks.length})` : tab}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {(activeTab === 'all' || activeTab === 'playlists') && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Saved Playlists</h2>
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

      {(activeTab === 'all' || activeTab === 'liked') && (
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginTop: activeTab === 'all' ? '16px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Heart size={20} color="#ec4899" fill="#ec4899" />
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Liked Tracks</h2>
          </div>
          {likedTracks.length > 0 ? (
            <TrackList tracks={likedTracks} />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No liked tracks yet. Click the heart icon on any song to add it to your collection.</p>
          )}
        </div>
      )}
    </div>
  );
}
