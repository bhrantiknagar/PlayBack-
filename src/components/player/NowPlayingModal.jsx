import React from 'react';
import { Heart, Minimize2, Sliders } from 'lucide-react';
import { usePlayer, EQ_PRESETS } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';
import { IconButton } from '../ui/IconButton';

export function NowPlayingModal() {
  const {
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    currentTrack,
    isPlaying,
    favorites,
    toggleFavorite,
    eqPreset,
    setEqPreset,
    currentTime
  } = usePlayer();

  if (!isNowPlayingOpen || !currentTrack) return null;

  const isLiked = favorites.includes(currentTrack.id);

  // Active lyric text simulation
  const currentLyric = currentTrack.lyrics?.slice().reverse().find(l => currentTime >= l.time)?.text ||
    "Immerse yourself in high-definition acoustic space.";

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.16) 0%, rgba(14, 18, 26, 0.98) 70%, #06070a 100%)',
        backdropFilter: 'blur(32px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 48px',
        color: '#fff',
        animation: 'fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen listening space"
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="flac-hi-res-tag">STUDIO MASTER</span>
          <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {currentTrack.format || 'FLAC 24-bit / 96kHz'}
          </span>
        </div>

        <IconButton
          icon={Minimize2}
          onClick={() => setIsNowPlayingOpen(false)}
          size="md"
          aria-label="Exit fullscreen listening space"
          title="Exit Fullscreen"
          style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' }}
        />
      </div>

      {/* Main Listening Space Area */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        alignItems: 'center',
        gap: '56px',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        padding: '20px 0'
      }}>
        {/* Left: 3D Artwork Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            position: 'relative',
            width: '320px',
            height: '320px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px var(--accent-glow-primary)'
          }}>
            {/* Vinyl Disc Sticking Out */}
            <div
              className={`animate-spin-slow ${!isPlaying ? 'animate-spin-paused' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                right: '-25%',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2a2a2a 12%, #111 30%, #000 65%)',
                border: '2px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 10px 35px rgba(0, 0, 0, 0.8)',
                zIndex: 1
              }}
            >
              <div style={{
                position: 'absolute',
                inset: '35%',
                borderRadius: '50%',
                background: 'var(--play-gradient)',
                border: '4px solid #111'
              }} />
            </div>

            {/* Album Cover Sleeve */}
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
                zIndex: 2,
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            />
          </div>

          {/* Synchronized Real-time Lyric */}
          <div style={{
            marginTop: '32px',
            textAlign: 'center',
            maxWidth: '460px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <p style={{
              fontSize: '15px',
              fontStyle: 'italic',
              color: '#f1f5f9',
              lineHeight: '1.4',
              fontFamily: 'var(--font-heading)'
            }}>
              "{currentLyric}"
            </p>
          </div>
        </div>

        {/* Right: Metadata, Soft Wave Visualizer & Equalizer Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
                {currentTrack.genre || 'Acoustic Master'}
              </span>
              <IconButton
                icon={Heart}
                onClick={() => toggleFavorite(currentTrack.id)}
                variant={isLiked ? 'danger' : 'default'}
                className={isLiked ? 'animate-heart-pop' : ''}
                size="md"
                aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
              />
            </div>

            {/* Level 1 Hierarchy: Song Title */}
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px', letterSpacing: '-0.8px' }}>
              {currentTrack.title}
            </h1>
            {/* Level 2 Hierarchy: Artist & Album */}
            <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '3px' }}>
              {currentTrack.artist} — <span style={{ color: 'var(--text-muted)' }}>{currentTrack.album}</span>
            </h3>
          </div>

          {/* Soft Waveform Canvas Visualizer */}
          <div style={{
            padding: '18px',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Visualizer width={360} height={56} isFull={true} />
          </div>

          {/* Level 3 Hierarchy: Audio Specs Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '8px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>TEMPO</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>{currentTrack.bpm || 120} BPM</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '8px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>KEY</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#a855f7', marginTop: '2px' }}>{currentTrack.key || 'C Maj'}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '8px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>ENERGY</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ec4899', marginTop: '2px' }}>{currentTrack.energy || 'Drive'}</div>
            </div>
          </div>

          {/* DSP Equalizer Presets */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
              <Sliders size={13} />
              <span>DSP EQUALIZER PRESET</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.keys(EQ_PRESETS).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEqPreset(preset)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    background: eqPreset === preset ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: eqPreset === preset ? '#a5b4fc' : 'var(--text-secondary)',
                    border: eqPreset === preset ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Transport Controls */}
      <div style={{
        maxWidth: '750px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ProgressBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ width: '120px' }} />
          <TrackControls />
          <VolumeControl />
        </div>
      </div>
    </div>
  );
}
