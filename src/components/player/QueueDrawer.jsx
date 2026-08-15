import React, { useState } from 'react';
import { X, Trash2, ListMusic } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import { IconButton } from '../ui/IconButton';

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

  const [removingIndex, setRemovingIndex] = useState(null);

  if (!isQueueOpen) return null;

  const upNextInPlaylist = playlist.filter(t => t.id !== currentTrack?.id);

  const handleRemoveTrack = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      removeFromQueue(index);
      setRemovingIndex(null);
    }, 250);
  };

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
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={() => setIsQueueOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: 'var(--shadow-lg)',
          overflowY: 'auto',
          animation: 'queueSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListMusic size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Playback Queue</h3>
          </div>
          <IconButton
            icon={X}
            onClick={() => setIsQueueOpen(false)}
            size="sm"
            aria-label="Close queue drawer"
            title="Close"
          />
        </div>

        {/* Currently Active Track */}
        {currentTrack && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
              Now Playing
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
              />
              <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{currentTrack.artist}</p>
              </div>
              <span className="flac-hi-res-tag">HI-RES</span>
            </div>
          </div>
        )}

        {/* Custom Queue */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
              Custom Queue ({queue.length})
            </h4>
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {queue.length === 0 ? (
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
              No custom tracks queued. Tracks in the current mix will play next.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    border: '1px solid var(--border-subtle)',
                    animation: removingIndex === i ? 'queueItemRemove 0.25s forwards' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <img src={track.coverUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{track.artist}</div>
                    </div>
                  </div>
                  <IconButton
                    icon={X}
                    onClick={() => handleRemoveTrack(i)}
                    size="sm"
                    aria-label={`Remove ${track.title} from queue`}
                    title="Remove"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Up Next in Active Mix */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
            Up Next In Current Mix
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {upNextInPlaylist.slice(0, 7).map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                className="track-row-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <img src={track.coverUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px' }} />
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
