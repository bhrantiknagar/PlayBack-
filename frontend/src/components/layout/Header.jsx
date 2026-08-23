import React from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import logoImg from '../../assets/images/logo.png';

export function Header() {
  const { searchQuery, setSearchQuery } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <header className="app-header" aria-label="Main header">
      {/* Pristine Dedicated Search Bar */}
      <div className="search-bar-wrap">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          className="search-input-field"
          placeholder="Search songs, artists, albums, or playlists..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Search songs, artists, albums, or playlists"
          autoComplete="off"
          spellCheck="false"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="search-clear-btn"
            aria-label="Clear search input"
            title="Clear search"
            type="button"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Right User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px 5px 6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          transition: 'background var(--transition-fast)'
        }}>
          <img
            src={logoImg}
            alt="PlayBack"
            style={{
              width: '22px',
              height: '22px',
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
