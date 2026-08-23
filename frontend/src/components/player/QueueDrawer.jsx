import React, { useState } from 'react';
import { X, Trash2, ListMusic, Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatTime';
import { IconButton } from '../ui/IconButton';

const DEFAULT_ARTWORK = '/images/albums/album-01.jpg';

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

  const handleRemoveTrack = (e, index) => {
    e.stopPropagation();
    setRemovingIndex(index);
    setTimeout(() => {
      removeFromQueue(index);
      setRemovingIndex(null);
    }, 200);
  };

  const handlePlayQueueTrack = (track, index) => {
    removeFromQueue(index);
    playTrack(track);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 'var(--player-height)',
        width: '380px',
        maxWidth: '100vw',
        background: 'rgba(10, 13, 20, 0.96)',
        backdropFilter: 'blur(30px)',
        borderLeft: '1px solid var(--border-subtle)',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.7)',
        animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      role="dialog"
      aria-label="Playback Queue"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ListMusic size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.3px' }}>PlayBack Queue</h3>
        </div>

        <IconButton
          icon={X}
          onClick={() => setIsQueueOpen(false)}
          size="sm"
          aria-label="Close queue drawer"
          title="Close Queue"
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Currently Playing Track */}
        {currentTrack && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
              Now Playing
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <img
                src={currentTrack.artwork || currentTrack.coverUrl || DEFAULT_ARTWORK}
                alt={currentTrack.title || 'Untitled Track'}
                style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_ARTWORK;
                }}
              />
              <div style={{ minWidth: 0, overflow: 'hidden', flex: 1 }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title || 'Untitled Track'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{currentTrack.artist || 'Unknown Artist'}</p>
              </div>
              <span className="flac-hi-res-tag">{currentTrack.quality || 'Standard'}</span>
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
                style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
                  onClick={() => handlePlayQueueTrack(track, i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    animation: removingIndex === i ? 'queueItemRemove 0.25s forwards' : 'none'
                  }}
                  className="track-row-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <img
                      src={track.artwork || track.coverUrl || DEFAULT_ARTWORK}
                      alt=""
                      style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_ARTWORK;
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{track.artist}</div>
                    </div>
                  </div>
                  <IconButton
                    icon={X}
                    onClick={(e) => handleRemoveTrack(e, i)}
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
                onClick={() => playTrack(track, playlist)}
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
                  <img
                    src={track.artwork || track.coverUrl || DEFAULT_ARTWORK}
                    alt=""
                    style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_ARTWORK;
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{track.artist}</div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {track.duration > 0 ? formatTime(track.duration) : '--:--'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
