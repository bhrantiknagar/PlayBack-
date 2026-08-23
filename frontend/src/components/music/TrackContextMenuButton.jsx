import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Play, ListPlus, FolderPlus, Heart, Disc, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { IconButton } from '../ui/IconButton';
import { albums } from '../../data/albums';
import { getArtists } from '../../data/artists';

export function TrackContextMenuButton({ track, contextTracks = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const {
    playTrack,
    addToQueue,
    setAddToPlaylistTrack,
    favorites,
    toggleFavorite
  } = usePlayer();

  const isLiked = favorites.includes(track.id);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleAction = (e, action) => {
    e.stopPropagation();
    setIsOpen(false);
    action();
  };

  const navigateToAlbum = () => {
    const albumMatch = albums.find(a => a.title === track.album);
    if (albumMatch) navigate(`/album/${albumMatch.id}`);
    else navigate('/explore');
  };

  const navigateToArtist = () => {
    const artists = getArtists();
    const artistMatch = artists.find(a => a.name === track.artist);
    if (artistMatch) navigate(`/artist/${artistMatch.id}`);
    else navigate('/explore');
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <IconButton
        icon={MoreHorizontal}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        size="sm"
        aria-label="More options"
        title="More"
        style={{ color: isOpen ? '#fff' : 'var(--text-muted)' }}
      />

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          width: '190px',
          background: '#0e121a', // Dark surface
          border: '1px solid var(--border-subtle)', // Subtle border
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', // Small shadow
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          zIndex: 100
        }}>
          <MenuOption
            icon={Play}
            label="Play"
            onClick={(e) => handleAction(e, () => playTrack(track, contextTracks))}
          />
          <MenuOption
            icon={ListPlus}
            label="Add to Queue"
            onClick={(e) => handleAction(e, () => addToQueue(track))}
          />
          <MenuOption
            icon={FolderPlus}
            label="Add to Vault"
            onClick={(e) => handleAction(e, () => setAddToPlaylistTrack(track))}
          />
          <MenuOption
            icon={Heart}
            label={isLiked ? "Remove from Liked" : "Like Frequency"}
            onClick={(e) => handleAction(e, () => toggleFavorite(track.id))}
            style={{ color: isLiked ? '#ec4899' : 'inherit' }}
            iconStyle={{ fill: isLiked ? 'currentColor' : 'none' }}
          />
          
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

          <MenuOption
            icon={Disc}
            label="View Album"
            onClick={(e) => handleAction(e, navigateToAlbum)}
          />
          <MenuOption
            icon={User}
            label="View Artist"
            onClick={(e) => handleAction(e, navigateToArtist)}
          />
        </div>
      )}
    </div>
  );
}

function MenuOption({ icon: Icon, label, onClick, style = {}, iconStyle = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '10px 12px',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: '500',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all var(--transition-fast)',
        ...style
      }}
      className="context-menu-option"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = style.color || 'var(--text-secondary)';
      }}
    >
      <Icon size={16} style={iconStyle} />
      <span>{label}</span>
    </button>
  );
}
