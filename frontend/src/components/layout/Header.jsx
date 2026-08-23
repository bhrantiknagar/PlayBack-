import React from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/logo.png';

export function Header() {
  const { searchQuery, setSearchQuery } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

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

      {/* Right User Avatar or Auth Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user ? (
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
            <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                background: 'var(--color-primary)',
                border: 'none',
                color: 'white',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
