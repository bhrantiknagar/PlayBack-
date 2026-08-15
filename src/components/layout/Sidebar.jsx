import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart, Disc, Radio, PlusCircle, Sparkles } from 'lucide-react';
import { mockPlaylists } from '../../data/mockData';

export function Sidebar() {
  const mainNav = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/library', label: 'Your Library', icon: Library },
    { to: '/favorites', label: 'Liked Tracks', icon: Heart }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Disc size={20} className="animate-spin-slow" />
        </div>
        <span>PlayBack</span>
      </div>

      {/* Main Nav Links */}
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

      <div className="sidebar-divider" />

      {/* Playlists Quick Access */}
      <div style={{ padding: '0 24px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          Playlists
        </span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
        {mockPlaylists.map(pl => (
          <NavLink
            key={pl.id}
            to={`/playlist/${pl.id}`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ fontSize: '13px', padding: '8px 12px' }}
          >
            <Radio size={15} style={{ opacity: 0.7 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {pl.title}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Pro Badge / Footer promo */}
      <div style={{ padding: '16px', margin: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontSize: '13px', fontWeight: '600' }}>
          <Sparkles size={16} />
          <span>High Fidelity</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Experience 320kbps lossless streaming.
        </p>
      </div>
    </aside>
  );
}
