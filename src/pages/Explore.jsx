import React from 'react';
import { Compass, Music2 } from 'lucide-react';
import { mockGenres } from '../data/mockData';
import { sampleTracks } from '../data/sampleTracks';
import { TrackCard } from '../components/music/TrackCard';

export function Explore() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Compass size={28} color="var(--accent-primary)" />
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Explore & Discover</h1>
      </div>

      {/* Genre category cards */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Browse by Genres
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {mockGenres.map(genre => (
            <div
              key={genre.id}
              style={{
                background: genre.color,
                borderRadius: 'var(--radius-md)',
                padding: '24px 18px',
                height: '110px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-fast)'
              }}
              className="genre-card"
            >
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                {genre.name}
              </span>
              <Music2 size={24} color="rgba(255, 255, 255, 0.6)" />
            </div>
          ))}
        </div>
      </div>

      {/* Fresh Releases */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Fresh Underground Releases</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {sampleTracks.map(track => (
            <TrackCard key={track.id} track={track} trackList={sampleTracks} />
          ))}
        </div>
      </div>
    </div>
  );
}
