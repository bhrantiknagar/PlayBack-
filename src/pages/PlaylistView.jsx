import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, ArrowLeft, Disc } from 'lucide-react';
import { mockPlaylists } from '../data/mockData';
import { sampleTracks } from '../data/sampleTracks';
import { TrackList } from '../components/music/TrackList';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

export function PlaylistView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const playlist = mockPlaylists.find(p => p.id === id) || mockPlaylists[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', width: 'fit-content' }}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Playlist Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '28px',
        padding: '32px',
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.25) 0%, rgba(22, 27, 40, 0.6) 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          style={{ width: '180px', height: '180px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#a5b4fc' }}>
            Curated Playlist
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.5px' }}>{playlist.title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px' }}>{playlist.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Created by <strong style={{ color: '#fff' }}>{playlist.creator}</strong></span>
            <span>•</span>
            <span>{sampleTracks.length} tracks</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {playlist.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          variant="primary"
          size="lg"
          icon={Play}
          onClick={() => playTrack(sampleTracks[0], sampleTracks)}
        >
          Play All
        </Button>
      </div>

      {/* Track Listing */}
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        <TrackList tracks={sampleTracks} />
      </div>
    </div>
  );
}
