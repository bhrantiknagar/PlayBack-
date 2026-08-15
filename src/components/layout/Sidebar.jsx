import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart, Radio, Activity, Sparkles, Cpu, Layers } from 'lucide-react';
import { mockPlaylists } from '../../data/mockData';
import { usePlayer } from '../../context/PlayerContext';
import logoImg from '../../assets/images/logo.png';

export function Sidebar() {
  const { isPlaying, currentTrack } = usePlayer();

  const mainNav = [
    { to: '/', label: 'Acoustic Space', icon: Home },
    { to: '/explore', label: 'Discovery Matrix', icon: Compass },
    { to: '/library', label: 'Sound Vaults', icon: Library },
    { to: '/favorites', label: 'Liked Frequencies', icon: Heart }
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <img
          src={logoImg}
          alt="PlayBack Logo"
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.45))',
            transition: 'transform var(--transition-normal)'
          }}
          className="brand-logo-img"
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>PlayBack</span>
            <span className="brand-badge">STUDIO</span>
          </div>
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

      {/* Playlists / Curated Mixes */}
      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
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

      {/* Live Audio Engine DSP Monitor */}
      <div style={{
        margin: '14px',
        padding: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <Cpu size={13} color="var(--accent-primary)" />
            <span>AUDIO ENGINE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isPlaying ? '#10b981' : '#64748b',
              boxShadow: isPlaying ? '0 0 8px #10b981' : 'none'
            }} />
            <span style={{ fontSize: '10px', color: isPlaying ? '#34d399' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {isPlaying ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: '#a5b4fc', display: 'flex', justifyContent: 'space-between' }}>
          <span>STREAM:</span>
          <span>{currentTrack?.format ? currentTrack.format.split('/')[0] : '24-BIT / 96kHz'}</span>
        </div>
      </div>
    </aside>
  );
}
