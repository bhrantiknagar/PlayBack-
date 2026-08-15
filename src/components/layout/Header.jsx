import React from 'react';
import { Search, Bell, User, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export function Header() {
  const { searchQuery, setSearchQuery } = usePlayer();

  return (
    <header className="app-header">
      {/* Search Input */}
      <div className="search-bar-container">
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="search-input"
          placeholder="Search songs, artists, or albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Controls / User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Bell size={18} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 12px 4px 6px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <User size={16} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Alex Turner</span>
        </div>
      </div>
    </header>
  );
}
