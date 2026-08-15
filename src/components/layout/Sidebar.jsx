import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart, Radio } from 'lucide-react';
import { mockPlaylists } from '../../data/mockData';
import logoImg from '../../assets/images/logo.png';

export function Sidebar() {
  const mainNav = [
    { to: '/', label: 'Acoustic Space', icon: Home },
    { to: '/explore', label: 'Discovery Matrix', icon: Compass },
    { to: '/library', label: 'Sound Vaults', icon: Library },
    { to: '/favorites', label: 'Liked Frequencies', icon: Heart }
  ];

  return (
    <aside className="app-sidebar" aria-label="Sidebar navigation">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <img
          src={logoImg}
          alt="PlayBack Logo"
          style={{
            width: '34px',
            height: '34px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.4))'
          }}
          className="brand-logo-img"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>PlayBack</span>
          <span className="brand-badge">STUDIO</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {mainNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={to === '/'}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-title">
        Curated Vaults
      </div>

      {/* Curated Playlists / Mixes with plenty of breathing room */}
      <div style={{
        padding: '0 14px 24px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
        flex: 1
      }}>
        {mockPlaylists.map(pl => (
          <NavLink
            key={pl.id}
            to={`/playlist/${pl.id}`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ fontSize: '13px', padding: '8px 12px' }}
          >
            <Radio size={14} style={{ opacity: 0.6 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pl.title}
            </span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
