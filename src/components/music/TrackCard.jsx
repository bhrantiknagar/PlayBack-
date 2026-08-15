import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayPauseButton } from '../player/PlayPauseButton';
import { IconButton } from '../ui/IconButton';

export function TrackCard({ track, trackList }) {
  const { currentTrack, isPlaying, togglePlay, playTrack, favorites, toggleFavorite, addToQueue } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const isLiked = favorites.includes(track.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, trackList);
    }
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(track);
  };

  return (
    <div
      onClick={() => playTrack(track, trackList)}
      className="music-card-root"
      style={{
        border: isCurrent ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)'
      }}
    >
      {/* Artwork Box */}
      <div className="music-card-cover-box">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="music-card-cover"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className={`music-card-play-overlay ${isCurrent && isPlaying ? 'is-playing' : ''}`}>
          <IconButton
            icon={Plus}
            onClick={handleAddToQueue}
            size="sm"
            aria-label="Add to playback queue"
            title="Add to queue"
            style={{
              background: 'rgba(10, 13, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff'
            }}
          />

          <PlayPauseButton
            isPlaying={isCurrent && isPlaying}
            onClick={handlePlayClick}
            size={40}
          />
        </div>

        {/* Quality Badge (Level 3 Hierarchy) */}
        {(track.quality === 'Hi-Res' || track.quality === 'Lossless') && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', zIndex: 2 }}>
            <span className="flac-hi-res-tag">{track.quality}</span>
          </div>
        )}
      </div>

      {/* Metadata & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
          {/* Level 1 Hierarchy: Title */}
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: isCurrent ? '#a5b4fc' : 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {track.title}
          </h4>
          {/* Level 2 Hierarchy: Artist */}
          <p style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            marginTop: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {track.artist}
          </p>
        </div>

        <IconButton
          icon={Heart}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(track.id);
          }}
          variant={isLiked ? 'danger' : 'default'}
          className={isLiked ? 'animate-heart-pop' : ''}
          size="sm"
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
        />
      </div>
    </div>
  );
}
