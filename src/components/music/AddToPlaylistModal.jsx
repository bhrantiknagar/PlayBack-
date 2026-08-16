import React, { useState } from 'react';
import { Plus, Check, Radio, FolderPlus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { PrimaryButton, SecondaryButton } from '../ui/Button';
import { usePlayer } from '../../context/PlayerContext';

export function AddToPlaylistModal() {
  const {
    addToPlaylistTrack,
    closeAddToPlaylist,
    playlists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    createPlaylist
  } = usePlayer();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!addToPlaylistTrack) return null;

  const handleToggleTrackInPlaylist = (playlist) => {
    const isAlreadyIn = playlist.trackIds?.includes(addToPlaylistTrack.id);
    if (isAlreadyIn) {
      removeTrackFromPlaylist(playlist.id, addToPlaylistTrack.id);
    } else {
      addTrackToPlaylist(playlist.id, addToPlaylistTrack.id);
    }
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPl = createPlaylist({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom sound vault collection.',
      coverUrl: addToPlaylistTrack.artwork || '/images/albums/album-02.jpg',
      trackIds: [addToPlaylistTrack.id]
    });

    setNewTitle('');
    setNewDesc('');
    setIsCreatingNew(false);
    closeAddToPlaylist();
  };

  return (
    <Modal
      isOpen={!!addToPlaylistTrack}
      onClose={closeAddToPlaylist}
      title="Add to Sound Vault"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Track Preview Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <img
            src={addToPlaylistTrack.artwork || '/images/albums/album-01.jpg'}
            alt=""
            style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {addToPlaylistTrack.title}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{addToPlaylistTrack.artist}</p>
          </div>
        </div>

        {/* Existing Playlists Selection List */}
        {!isCreatingNew ? (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              {playlists.map(pl => {
                const isSelected = pl.trackIds?.includes(addToPlaylistTrack.id);
                return (
                  <div
                    key={pl.id}
                    onClick={() => handleToggleTrackInPlaylist(pl)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    className="track-row-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img
                        src={pl.coverUrl || '/images/albums/album-02.jpg'}
                        alt=""
                        style={{ width: '34px', height: '34px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '500', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pl.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {pl.trackIds?.length || 0} tracks
                        </div>
                      </div>
                    </div>

                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#fff' : 'var(--text-muted)'
                    }}>
                      {isSelected ? <Check size={14} /> : <Plus size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <SecondaryButton
                icon={FolderPlus}
                onClick={() => setIsCreatingNew(true)}
                size="sm"
              >
                New Vault
              </SecondaryButton>

              <PrimaryButton onClick={closeAddToPlaylist} size="sm">
                Done
              </PrimaryButton>
            </div>
          </>
        ) : (
          /* Inline New Playlist Form */
          <form onSubmit={handleCreateAndAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Vault Name
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Late Night Spatial"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Acoustic description..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <SecondaryButton type="button" onClick={() => setIsCreatingNew(false)} size="sm">
                Back
              </SecondaryButton>
              <PrimaryButton type="submit" size="sm">
                Create & Add
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
