import React from 'react';
import { Compass, Music2, Radio, Sparkles, Disc } from 'lucide-react';
import { mockGenres } from '../data/mockData';
import { sampleTracks } from '../data/sampleTracks';
import { TrackCard } from '../components/music/TrackCard';
import { usePlayer } from '../context/PlayerContext';

export function Explore() {
  const { playTrack } = usePlayer();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Compass size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Discovery Matrix</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Explore spatial audio frequencies by genre, mood, and synth generation.</p>
          </div>
        </div>
      </div>

      {/* Futuristic Genre Matrix Cards */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Sonic Domains
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '18px'
        }}>
          {mockGenres.map(genre => (
            <div
              key={genre.id}
              style={{
                background: genre.color,
                borderRadius: 'var(--radius-md)',
                padding: '24px 20px',
                height: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'transform var(--transition-fast)'
              }}
              className="genre-card-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  FREQUENCY DOMAIN
                </span>
                <Music2 size={20} color="rgba(255, 255, 255, 0.7)" />
              </div>

              <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
                {genre.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fresh Releases Matrix */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Sparkles size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Fresh Audiophile Masters</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '24px'
        }}>
          {sampleTracks.map(track => (
            <TrackCard key={track.id} track={track} trackList={sampleTracks} />
          ))}
        </div>
      </div>
    </div>
  );
}
