import React from 'react';
import { Heart, Minimize2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';
import { IconButton } from '../ui/IconButton';
import './NowPlayingModal.css';

const DEFAULT_ARTWORK = '/images/albums/album-01.jpg';

export function NowPlayingModal() {
  const {
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    currentTrack,
    isPlaying,
    favorites,
    toggleFavorite,
    currentTime
  } = usePlayer();

  if (!isNowPlayingOpen || !currentTrack) return null;

  const isLiked = favorites.includes(currentTrack.id);
  const activeColor = currentTrack.ambientColor || '#6366f1';
  const artworkSrc = currentTrack.artwork || currentTrack.coverUrl || DEFAULT_ARTWORK;
  const title = currentTrack.title || 'Untitled Track';
  const artist = currentTrack.artist || 'Unknown Artist';
  const album = currentTrack.album || 'Single';
  const quality = currentTrack.quality || 'Standard';

  // Real-time synced lyric / subtitle snippet
  const currentLyric = currentTrack.lyrics?.slice().reverse().find(l => currentTime >= l.time)?.text ||
    "Immerse yourself in high-definition acoustic space.";

  return (
    <div
      className="now-playing-overlay"
      style={{
        '--active-ambient-color': activeColor
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Now playing listening space"
    >
      <div className="now-playing-container">
        {/* Top Header Bar */}
        <div className="now-playing-header">
          <div className="now-playing-header-tag">
            <span className="flac-hi-res-tag">
              {quality}
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {quality === 'Hi-Res' ? 'FLAC 24-bit / 96kHz' : quality === 'Lossless' ? 'ALAC 16-bit / 44.1kHz' : 'Standard 320kbps'}
            </span>
          </div>

          <IconButton
            icon={Minimize2}
            onClick={() => setIsNowPlayingOpen(false)}
            size="md"
            aria-label="Exit fullscreen listening space"
            title="Exit Fullscreen"
            style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#ffffff' }}
          />
        </div>

        {/* Main Listening Space Area */}
        <div className="now-playing-main-grid">
          {/* Left Column: 3D Artwork with Live Spinning Vinyl */}
          <div className="now-playing-artwork-col">
            <div className="now-playing-cover-wrapper" style={{ boxShadow: `0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px ${activeColor}33` }}>
              {/* Realistic Spinning Vinyl Disc */}
              <div
                className={`now-playing-vinyl-disc animate-spin-slow ${!isPlaying ? 'animate-spin-paused' : ''}`}
              >
                {/* Circular Vinyl Center Label */}
                <div className="now-playing-vinyl-label">
                  <img
                    src={artworkSrc}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_ARTWORK;
                    }}
                  />
                  {/* Center Spindle Hole */}
                  <div className="now-playing-spindle-hole" />
                </div>
              </div>

              {/* Album Cover Sleeve Layer */}
              <img
                src={artworkSrc}
                alt={title}
                className="now-playing-cover-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_ARTWORK;
                }}
              />
            </div>

            {/* Synchronized Real-time Lyric / Subtitle preview */}
            <div className="now-playing-lyric-box">
              <p className="now-playing-lyric-text">
                "{currentLyric}"
              </p>
            </div>
          </div>

          {/* Right Column: Track Information, Soft Wave Visualizer & Metadata */}
          <div className="now-playing-info-col">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="now-playing-genre-tag">
                  {currentTrack.genre || 'Acoustic Space'}
                </span>
                <IconButton
                  icon={Heart}
                  onClick={() => toggleFavorite(currentTrack.id)}
                  variant={isLiked ? 'danger' : 'default'}
                  className={isLiked ? 'animate-heart-pop is-liked' : ''}
                  iconProps={{ fill: isLiked ? 'currentColor' : 'none' }}
                  size="md"
                  aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                  style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
                />
              </div>

              {/* Track Title */}
              <h1 className="now-playing-title">
                {title}
              </h1>
              {/* Artist & Album */}
              <h3 className="now-playing-artist">
                {artist} — <span style={{ color: 'var(--text-muted)' }}>{album}</span>
              </h3>
            </div>

            {/* Soft Waveform Canvas Visualizer */}
            <div className="now-playing-visualizer-box">
              <Visualizer width={360} height={54} isFull={true} />
            </div>

            {/* Track Metrics Card */}
            <div className="now-playing-metrics-grid">
              <div className="now-playing-metric-card">
                <div className="now-playing-metric-label">QUALITY</div>
                <div className="now-playing-metric-value" style={{ color: '#34d399' }}>{quality}</div>
              </div>
              <div className="now-playing-metric-card">
                <div className="now-playing-metric-label">MOOD</div>
                <div className="now-playing-metric-value" style={{ color: '#a855f7' }}>{currentTrack.energy || 'Drive'}</div>
              </div>
              <div className="now-playing-metric-card">
                <div className="now-playing-metric-label">PLAYS</div>
                <div className="now-playing-metric-value" style={{ color: '#38bdf8' }}>{currentTrack.plays || '1.2M'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Transport Controls */}
        <div className="now-playing-controls-section">
          <ProgressBar />
          <div className="now-playing-transport-row">
            <div className="now-playing-transport-spacer" />
            <TrackControls />
            <div className="desktop-only-widget">
              <VolumeControl />
            </div>
          </div>
        </div>

        {/* Lyrics Section */}
        <div className="now-playing-lyrics-container">
          <h2 className="now-playing-lyrics-title" style={{ color: activeColor }}>
            Lyrics
          </h2>

          {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {currentTrack.lyrics.map((lyric, idx) => (
                <p key={idx} className="now-playing-lyric-line">
                  {lyric.text}
                </p>
              ))}
            </div>
          ) : (
            <p style={{
              fontSize: '16px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              marginTop: '16px'
            }}>
              No lyrics available for this track.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
