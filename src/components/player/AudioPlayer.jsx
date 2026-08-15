import React from 'react';
import { Heart, Maximize2, ListMusic } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';
import { IconButton } from '../ui/IconButton';

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

  return (
    <aside
      className="player-dock-floating"
      aria-label="Now playing bar"
    >
      {/* Left: Track Artwork & Metadata */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '300px' }}>
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
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div style={{ minWidth: 0, overflow: 'hidden' }}>
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
              {currentTrack.title}
            </span>
            <span className="flac-hi-res-tag">HI-RES</span>
          </div>

          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '2px'
          }}>
            {currentTrack.artist}
          </div>
        </div>

        <IconButton
          icon={Heart}
          onClick={() => toggleFavorite(currentTrack.id)}
          variant={isLiked ? 'danger' : 'default'}
          className={isLiked ? 'animate-heart-pop' : ''}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
          size="sm"
        />
      </div>

      {/* Center: Playback Controls & Wave Timeline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        flex: 1,
        maxWidth: '560px',
        padding: '0 16px'
      }}>
        <TrackControls />
        <ProgressBar />
      </div>

      {/* Right: Soft Wave Visualizer, Volume & Utility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', width: '300px' }}>
        {/* Soft Wave Visualizer */}
        <div
          onClick={() => setIsNowPlayingOpen(true)}
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

        <VolumeControl />

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
