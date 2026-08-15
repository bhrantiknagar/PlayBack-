import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart } from 'lucide-react';

export function MobileNav() {
  const navItems = [
    { to: '/', label: 'Space', icon: Home },
    { to: '/explore', label: 'Matrix', icon: Compass },
    { to: '/library', label: 'Vaults', icon: Library },
    { to: '/favorites', label: 'Liked', icon: Heart }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isActive ? '#a5b4fc' : 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: isActive ? '600' : '400',
            padding: '6px 12px',
            transition: 'color var(--transition-fast)'
          })}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
