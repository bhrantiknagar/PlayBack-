import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { AudioPlayer } from '../player/AudioPlayer';
import { QueueDrawer } from '../player/QueueDrawer';
import { NowPlayingModal } from '../player/NowPlayingModal';
import { AddToPlaylistModal } from '../music/AddToPlaylistModal';
import { usePlayer } from '../../context/PlayerContext';

export function MainLayout() {
  const { currentTrack, isPlaying } = usePlayer();

  const activeColor = currentTrack?.ambientColor || '#6366f1';

  return (
    <div className="app-container">
      {/* Reactive Ambient Artwork Glow synced to current track dominant color */}
      <div
        className="ambient-glow-layer"
        style={{
          background: `radial-gradient(circle, ${activeColor} 0%, rgba(14, 18, 26, 0.08) 55%, transparent 75%)`,
          opacity: isPlaying ? 0.38 : 0.16,
          transition: 'background 1.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease'
        }}
        aria-hidden="true"
      />

      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <AudioPlayer />
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Fullscreen Listening Space & Queue Drawer */}
      <QueueDrawer />
      <NowPlayingModal />
      <AddToPlaylistModal />
    </div>
  );
}
