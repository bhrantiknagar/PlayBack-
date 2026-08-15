import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { sampleTracks } from '../../data/sampleTracks';
import { PlayPauseButton } from '../player/PlayPauseButton';

export function PlaylistCard({ playlist }) {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (sampleTracks.length > 0) {
      playTrack(sampleTracks[0], sampleTracks);
    }
  };

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="music-card-root"
    >
      <div className="music-card-cover-box">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="music-card-cover"
          loading="lazy"
        />

        {/* Hover Play Button */}
        <div className="music-card-play-overlay">
          <PlayPauseButton
            isPlaying={isPlaying && currentTrack?.album === playlist.title}
            onClick={handlePlay}
            size={42}
          />
        </div>
      </div>

      <div>
        <h4 style={{
          fontSize: '14.5px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {playlist.title}
        </h4>
        <p style={{
          fontSize: '12.5px',
          color: 'var(--text-muted)',
          marginTop: '3px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.4'
        }}>
          {playlist.description}
        </p>
      </div>
    </div>
  );
}
