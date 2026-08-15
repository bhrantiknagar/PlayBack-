import React from 'react';
import { Heart, ListMusic } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';

export function AudioPlayer() {
  const { currentTrack, favorites, toggleFavorite } = usePlayer();

  if (!currentTrack) return null;

  const isLiked = favorites.includes(currentTrack.id);

  return (
    <div className="player-dock">
      {/* Left: Track Metadata */}
      <div className="player-track-info">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="player-artwork"
        />
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentTrack.title}
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
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)', marginLeft: '4px' }}
        >
          <Heart size={18} fill={isLiked ? '#ec4899' : 'none'} />
        </button>
      </div>

      {/* Middle: Playback Controls & Progress Bar */}
      <div className="player-center-controls">
        <TrackControls />
        <ProgressBar />
      </div>

      {/* Right: Audio Visualizer, Volume & Extras */}
      <div className="player-extra-controls">
        <Visualizer barCount={8} />
        <VolumeControl />
      </div>
    </div>
  );
}
