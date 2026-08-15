import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { AudioPlayer } from '../player/AudioPlayer';
import { QueueDrawer } from '../player/QueueDrawer';
import { NowPlayingModal } from '../player/NowPlayingModal';
import { usePlayer } from '../../context/PlayerContext';

export function MainLayout() {
  const { currentTrack, isPlaying } = usePlayer();

  // Dynamic ambient glow mapping based on track energy/mood
  const getAmbientGlowStyle = () => {
    if (!currentTrack) return {};
    const moodColors = {
      'Drive': 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(236, 72, 153, 0.08) 45%, transparent 70%)',
      'Euphoria': 'radial-gradient(circle, rgba(236, 72, 153, 0.16) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 70%)',
      'Focus': 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(99, 102, 241, 0.06) 45%, transparent 70%)',
      'Chill': 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.06) 45%, transparent 70%)',
      'Late Night': 'radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, rgba(245, 158, 11, 0.06) 45%, transparent 70%)'
    };
    return {
      background: moodColors[currentTrack.energy] || moodColors['Drive'],
      opacity: isPlaying ? 0.55 : 0.25
    };
  };

  return (
    <div className="app-container">
      {/* Reactive Ambient Artwork Glow */}
      <div
        className="ambient-glow-layer"
        style={getAmbientGlowStyle()}
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

      {/* Mobile Navigation Bar (<850px) */}
      <MobileNav />

      {/* Fullscreen Listening Space & Queue Drawer */}
      <QueueDrawer />
      <NowPlayingModal />
    </div>
  );
}
