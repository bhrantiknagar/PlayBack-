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

  return (
    <aside
      className="player-dock-floating"
      aria-label="Now playing bar"
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
          {/* Subtle Ambient Backlight under Artwork */}
          <div
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-glow-primary)',
              filter: 'blur(8px)',
              opacity: isPlaying ? 0.7 : 0.2,
              transition: 'opacity 0.4s ease',
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
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}>
            <img
              src={artworkSrc}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ARTWORK;
              }}
            />
          </div>
        </div>

        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              onClick={() => setIsNowPlayingOpen(true)}
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

      {/* Center: Playback Controls & Wave Timeline */}
      <div className="player-dock-center">
        <TrackControls />
        <div className="desktop-only-widget" style={{ width: '100%' }}>
          <ProgressBar />
        </div>
      </div>

      {/* Right: Soft Wave Visualizer, Volume & Utility Controls */}
      <div className="player-dock-right">
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
          <Visualizer width={100} height={24} />
        </div>

        <div className="desktop-only-widget">
          <VolumeControl />
        </div>

        <IconButton
          icon={ListMusic}
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          variant={isQueueOpen ? 'active' : 'default'}
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
