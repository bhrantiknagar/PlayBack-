import React from 'react';
import { X, Trash2, ListMusic, Play, Disc } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';

export function QueueDrawer() {
  const {
    isQueueOpen,
    setIsQueueOpen,
    currentTrack,
    queue,
    removeFromQueue,
    clearQueue,
    playlist,
    playTrack
  } = usePlayer();

  if (!isQueueOpen) return null;

  const upNextInPlaylist = playlist.filter(t => t.id !== currentTrack?.id);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={() => setIsQueueOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-subtle)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListMusic size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Playback Queue</h3>
          </div>
          <button
            onClick={() => setIsQueueOpen(false)}
            style={{ color: 'var(--text-muted)', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Now Playing Block */}
        {currentTrack && (
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '1px' }}>
              Now Playing
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
              />
              <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{currentTrack.artist}</p>
              </div>
              <span className="flac-hi-res-tag">HI-RES</span>
            </div>
          </div>
        )}

        {/* User Queued Tracks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px' }}>
              Custom Queue ({queue.length})
            </h4>
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {queue.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
              No custom tracks queued. Tracks from the active list will play next.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {queue.map((track, i) => (
                <div
                  key={`${track.id}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <img src={track.coverUrl} alt="" style={{ width: '34px', height: '34px', borderRadius: '4px' }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{track.artist}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromQueue(i)}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Up Next From Active Playlist */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: '12px' }}>
            Up Next In Current Mix
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {upNextInPlaylist.slice(0, 6).map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                className="track-row-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <img src={track.coverUrl} alt="" style={{ width: '34px', height: '34px', borderRadius: '4px' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{track.artist}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {formatTime(track.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
