import React from 'react';
import { X, Heart, Maximize2, Minimize2, Sliders, Activity, Disc, Sparkles } from 'lucide-react';
import { usePlayer, EQ_PRESETS } from '../../context/PlayerContext';
import { TrackControls } from './TrackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Visualizer } from '../music/Visualizer';

export function NowPlayingModal() {
  const {
    isNowPlayingOpen,
    setIsNowPlayingOpen,
    currentTrack,
    isPlaying,
    favorites,
    toggleFavorite,
    visualizerMode,
    setVisualizerMode,
    eqPreset,
    setEqPreset,
    currentTime
  } = usePlayer();

  if (!isNowPlayingOpen || !currentTrack) return null;

  const isLiked = favorites.includes(currentTrack.id);

  // Find active lyric if any
  const currentLyric = currentTrack.lyrics?.slice().reverse().find(l => currentTime >= l.time)?.text ||
    "Immerse yourself in high-definition audio space.";

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.18) 0%, rgba(14, 17, 26, 0.98) 70%, #06070a 100%)',
      backdropFilter: 'blur(32px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 48px',
      color: '#fff',
      animation: 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="flac-hi-res-tag">STUDIO MASTER</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {currentTrack.format || 'FLAC 24-bit / 96kHz'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-full)',
            padding: '3px'
          }}>
            {['spectrum', 'wave', 'particles'].map((mode) => (
              <button
                key={mode}
                onClick={() => setVisualizerMode(mode)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  color: visualizerMode === mode ? '#fff' : 'var(--text-muted)',
                  background: visualizerMode === mode ? 'var(--accent-gradient)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsNowPlayingOpen(false)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginLeft: '12px'
            }}
          >
            <Minimize2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Listening Space Area */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        gap: '64px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '24px 0'
      }}>
        {/* Left: 3D Vinyl Sleeve Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{
            position: 'relative',
            width: '340px',
            height: '340px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px var(--accent-glow)',
            perspective: '1000px'
          }}>
            {/* Vinyl Disc Sticking Out */}
            <div
              className={`animate-spin-slow ${!isPlaying ? 'animate-spin-paused' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                right: '-28%',
                width: '340px',
                height: '340px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2a2a2a 12%, #111 30%, #000 65%)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
                zIndex: 1
              }}
            >
              <div style={{
                position: 'absolute',
                inset: '35%',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
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

          {/* Synchronized Real-time Lyric or Sound Quote */}
          <div style={{
            marginTop: '36px',
            textAlign: 'center',
            maxWidth: '480px',
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <p style={{
              fontSize: '16px',
              fontStyle: 'italic',
              color: '#f1f5f9',
              lineHeight: '1.4',
              fontFamily: 'var(--font-heading)'
            }}>
              "{currentLyric}"
            </p>
          </div>
        </div>

        {/* Right: Audiophile Metrics, Equalizer & Live Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#a5b4fc' }}>
                {currentTrack.genre || 'Electronic Workstation'}
              </span>
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                style={{ color: isLiked ? '#ec4899' : 'var(--text-muted)' }}
              >
                <Heart size={22} fill={isLiked ? '#ec4899' : 'none'} />
              </button>
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '6px', letterSpacing: '-1px' }}>
              {currentTrack.title}
            </h1>
            <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '2px' }}>
              {currentTrack.artist} — <span style={{ color: 'var(--text-muted)' }}>{currentTrack.album}</span>
            </h3>
          </div>

          {/* Wide Visualizer Canvas */}
          <div style={{
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Visualizer width={360} height={70} isFull={true} />
          </div>

          {/* Audio Specs Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BPM TEMPO</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>{currentTrack.bpm || 120} BPM</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MUSICAL KEY</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#a855f7', marginTop: '2px' }}>{currentTrack.key || 'C Maj'}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ENERGY VIBE</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899', marginTop: '2px' }}>{currentTrack.energy || 'Drive'}</div>
            </div>
          </div>

          {/* DSP Equalizer Presets */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
              <Sliders size={14} />
              <span>DSP EQUALIZER PRESET</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.keys(EQ_PRESETS).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEqPreset(preset)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: eqPreset === preset ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
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

      {/* Bottom Transport Controls in Fullscreen */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        paddingTop: '16px'
      }}>
        <ProgressBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ width: '130px' }} />
          <TrackControls />
          <VolumeControl />
        </div>
      </div>
    </div>
  );
}
