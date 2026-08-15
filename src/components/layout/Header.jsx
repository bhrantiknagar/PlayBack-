import React from 'react';
import { Search, Headphones, Bell, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import logoImg from '../../assets/images/logo.png';

export function Header() {
  const { searchQuery, setSearchQuery, selectedEnergy, setSelectedEnergy } = usePlayer();

  const energyFilters = ['All', 'Focus', 'Drive', 'Euphoria', 'Chill', 'Late Night'];

  return (
    <header className="app-header">
      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="search-bar-wrap">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search frequencies, artists, albums, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Energy/Vibe Filter Chips */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {energyFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedEnergy(filter)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: '600',
                background: selectedEnergy === filter ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedEnergy === filter ? '#a5b4fc' : 'var(--text-muted)',
                border: selectedEnergy === filter ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Right Control Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Output Device Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)'
        }}>
          <Headphones size={14} color="#34d399" />
          <span>OUTPUT: DIRECT DSP</span>
        </div>

        {/* User Identity */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 12px 4px 6px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer'
        }}>
          <img
            src={logoImg}
            alt="PlayBack"
            style={{
              width: '26px',
              height: '26px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Master Acoustic</span>
        </div>
      </div>
    </header>
  );
}
