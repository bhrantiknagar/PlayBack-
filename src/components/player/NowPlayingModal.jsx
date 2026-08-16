import React from 'react';
import { Heart, Minimize2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';
import { IconButton } from '../ui/IconButton';

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
      style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle at 50% 35%, ${activeColor}22 0%, rgba(14, 18, 26, 0.98) 65%, #06070a 100%)`,
        backdropFilter: 'blur(36px)',
        zIndex: 1000,
        overflowY: 'auto',
        color: '#fff',
        animation: 'fadeInScale 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Now playing listening space"
    >
      {/* 100vh wrapper for main player to preserve existing layout */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px 48px',
      }}>
        {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      {/* Main Listening Space Area (Balanced 2-column composition) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '64px',
        maxWidth: '1080px',
        margin: 'auto',
        width: '100%',
        padding: '24px 0'
      }}>
        {/* Left Column: 3D Artwork with Live Spinning Vinyl */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            width: '320px',
            height: '320px',
            borderRadius: 'var(--radius-md)',
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px ${activeColor}33`
          }}>
            {/* Realistic Spinning Vinyl Disc */}
            <div
              className={`animate-spin-slow ${!isPlaying ? 'animate-spin-paused' : ''}`}
              style={{
                position: 'absolute',
                top: '5px',
                right: '-46%',
                width: '310px',
                height: '310px',
                borderRadius: '50%',
                background: `
                  conic-gradient(from 45deg, rgba(255,255,255,0.08) 0deg, transparent 40deg, rgba(255,255,255,0.15) 90deg, transparent 140deg, rgba(255,255,255,0.08) 180deg, transparent 220deg, rgba(255,255,255,0.15) 270deg, transparent 320deg),
                  repeating-radial-gradient(circle, #1a1a1a 0px, #1a1a1a 2px, #0e0e0e 3px, #080808 5px, #1e1e1e 6px)
                `,
                border: '2px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.8)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'none'
              }}
            >
              {/* Circular Vinyl Center Label */}
              <div style={{
                position: 'relative',
                width: '108px',
                height: '108px',
                borderRadius: '50%',
                background: '#151922',
                border: '3px solid #111',
                boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
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
                <div style={{
                  position: 'absolute',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#08090d',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.9)'
                }} />
              </div>
            </div>

            {/* Album Cover Sleeve Layer */}
            <img
              src={artworkSrc}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
                zIndex: 2,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ARTWORK;
              }}
            />
          </div>

          {/* Synchronized Real-time Lyric / Subtitle preview */}
          <div style={{
            marginTop: '28px',
            textAlign: 'center',
            maxWidth: '420px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <p style={{
              fontSize: '14.5px',
              fontStyle: 'italic',
              color: '#f1f5f9',
              lineHeight: '1.45'
            }}>
              "{currentLyric}"
            </p>
          </div>
        </div>

        {/* Right Column: Track Information, Soft Wave Visualizer & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
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
            <h1 style={{ fontSize: '34px', fontWeight: '800', marginTop: '6px', letterSpacing: '-0.8px', lineHeight: '1.15' }}>
              {title}
            </h1>
            {/* Artist & Album */}
            <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '4px' }}>
              {artist} — <span style={{ color: 'var(--text-muted)' }}>{album}</span>
            </h3>
          </div>

          {/* Soft Waveform Canvas Visualizer */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Visualizer width={360} height={54} isFull={true} />
          </div>

          {/* Track Metrics Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>QUALITY</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#34d399', marginTop: '2px' }}>{quality}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MOOD</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#a855f7', marginTop: '2px' }}>{currentTrack.energy || 'Drive'}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PLAYS</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>{currentTrack.plays || '1.2M'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Transport Controls */}
      <div style={{
        maxWidth: '780px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        paddingTop: '12px'
      }}>
        <ProgressBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ width: '130px' }} />
          <TrackControls />
          <VolumeControl />
        </div>
      </div>
      </div>
      
      {/* Lyrics Section */}
      <div style={{ 
        padding: '24px 48px 96px 48px', 
        maxWidth: '800px', 
        margin: '0 auto', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: activeColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Lyrics
        </h2>
        
        {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentTrack.lyrics.map((lyric, idx) => (
              <p key={idx} style={{ 
                fontSize: '24px', 
                lineHeight: '1.8', 
                color: 'var(--text-primary)',
                fontWeight: '500',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                {lyric.text}
              </p>
            ))}
          </div>
        ) : (
          <p style={{ 
            fontSize: '18px', 
            color: 'var(--text-muted)', 
            fontStyle: 'italic',
            marginTop: '32px'
          }}>
            No lyrics available for this track.
          </p>
        )}
      </div>
    </div>
  );
}
