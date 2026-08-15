import React from 'react';
import { Search, X } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import logoImg from '../../assets/images/logo.png';

export function Header() {
  const { searchQuery, setSearchQuery, selectedEnergy, setSelectedEnergy } = usePlayer();

  const energyFilters = ['All', 'Focus', 'Drive', 'Euphoria', 'Chill', 'Late Night'];

  return (
    <header className="app-header" aria-label="Main header">
      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '720px' }}>
        <div className="search-bar-wrap">
          <Search size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search songs, artists, albums, or playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search music"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Energy/Vibe Filter Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0' }}>
          {energyFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedEnergy(filter)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11.5px',
                fontWeight: '600',
                background: selectedEnergy === filter ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedEnergy === filter ? '#a5b4fc' : 'var(--text-secondary)',
                border: selectedEnergy === filter ? '1px solid var(--accent-primary)' : '1px solid transparent',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Right User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px 4px 6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer'
        }}>
          <img
            src={logoImg}
            alt="PlayBack"
            style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.35))'
            }}
          />
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>Alex Turner</span>
        </div>
      </div>
    </header>
  );
}
