import React from 'react';
import { Heart, Maximize2, ListMusic } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';
import { IconButton } from '../ui/IconButton';

const DEFAULT_ARTWORK = '/images/albums/album-01.jpg';

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    favorites,
    toggleFavorite,
    setIsNowPlayingOpen,
    isQueueOpen,
    setIsQueueOpen
  } = usePlayer();

  if (!currentTrack) return null;

  const isLiked = favorites.includes(currentTrack.id);
  const artworkSrc = currentTrack.artwork || currentTrack.coverUrl || DEFAULT_ARTWORK;
  const title = currentTrack.title || 'Untitled Track';
  const artist = currentTrack.artist || 'Unknown Artist';
  const quality = currentTrack.quality || 'Standard';
  const activeColor = currentTrack.ambientColor || '#6366f1';

  return (
    <aside
      className={`player-dock-floating ${isPlaying ? 'is-playing' : ''}`}
      aria-label="Now playing bar"
      style={{
        boxShadow: isPlaying
          ? `0 16px 45px rgba(0, 0, 0, 0.85), 0 0 35px ${activeColor}35`
          : '0 16px 45px rgba(0, 0, 0, 0.75), 0 0 20px rgba(99, 102, 241, 0.08)',
        borderColor: isPlaying ? `${activeColor}44` : 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Top Edge Progress Bar for Mobile */}
      <div className="mobile-mini-player-progress">
        <ProgressBar isMiniPlayer={true} />
      </div>

      {/* Left: Track Artwork & Metadata */}
      <div className="player-dock-left">
        <div
          onClick={() => setIsNowPlayingOpen(true)}
          style={{ cursor: 'pointer', position: 'relative' }}
          title="Open Listening Space"
        >
          {/* Dynamic Ambient Backlight under Artwork */}
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: 'var(--radius-sm)',
              background: activeColor,
              filter: 'blur(10px)',
              opacity: isPlaying ? 0.75 : 0.2,
              transition: 'all 0.6s ease',
              zIndex: 0
            }}
          />

          <div style={{
            position: 'relative',
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            zIndex: 1
          }}>
            <img
              src={artworkSrc}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ARTWORK;
              }}
            />
            {isPlaying && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="playing-equalizer-bars">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>
        </div>

        <div onClick={() => setIsNowPlayingOpen(true)} style={{ minWidth: 0, flex: 1, overflow: 'hidden', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '13.5px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                color: '#ffffff'
              }}
            >
              {title}
            </span>
            {(quality === 'Hi-Res' || quality === 'Lossless') && (
              <span className="flac-hi-res-tag desktop-only-widget">{quality}</span>
            )}
          </div>

          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '2px'
          }}>
            {artist}
          </div>
        </div>

        <IconButton
          icon={Heart}
          onClick={() => toggleFavorite(currentTrack.id)}
          variant={isLiked ? 'danger' : 'default'}
          className={`desktop-only-widget ${isLiked ? 'animate-heart-pop is-liked' : ''}`}
          iconProps={{ fill: isLiked ? 'currentColor' : 'none' }}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
          size="sm"
        />
      </div>

      {/* Center: Playback Controls & Wave Timeline (Desktop Only) */}
      <div className="player-dock-center desktop-only-widget">
        <TrackControls />
        <div style={{ width: '100%' }}>
          <ProgressBar />
        </div>
      </div>

      {/* Right: Controls & Mobile Compact Play Button */}
      <div className="player-dock-right">
        {/* Mobile Mini-Player Play/Pause */}
        <div className="mobile-only-widget">
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={togglePlay}
            size={38}
          />
        </div>

        {/* Soft Wave Visualizer */}
        <div
          onClick={() => setIsNowPlayingOpen(true)}
          className="desktop-only-widget"
          style={{
            cursor: 'pointer',
            padding: '2px 8px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center'
          }}
          title="PlayBack Soft Wave (Click to expand)"
        >
          <Visualizer width={100} height={24} color={activeColor} />
        </div>

        <div className="desktop-only-widget">
          <VolumeControl />
        </div>

        <IconButton
          icon={ListMusic}
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          variant={isQueueOpen ? 'active' : 'default'}
          className="desktop-only-widget"
          aria-label="Toggle playback queue"
          title="Playback Queue"
          size="sm"
        />

        <IconButton
          icon={Maximize2}
          onClick={() => setIsNowPlayingOpen(true)}
          aria-label="Open fullscreen listening space"
          title="Fullscreen"
          size="sm"
        />
      </div>
    </aside>
  );
}
