import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { sampleTracks } from '../data/sampleTracks';

const PlayerContext = createContext(null);

export const EQ_PRESETS = {
  'Flat': { bass: 0, mid: 0, treble: 0 },
  'Bass Boost': { bass: 6, mid: 1, treble: -2 },
  'Cyber Club': { bass: 5, mid: -2, treble: 4 },
  'Acoustic': { bass: 1, mid: 4, treble: 3 },
  'Vocal': { bass: -2, mid: 5, treble: 2 }
};

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState(sampleTracks);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [visualizerMode, setVisualizerMode] = useState('spectrum'); // 'spectrum' | 'wave' | 'particles' | 'bars'
  const [eqPreset, setEqPreset] = useState('Cyber Club');
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    return sampleTracks.filter(t => t.liked).map(t => t.id);
  });

  const audioRef = useRef(new Audio());
  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    audio.src = currentTrack.audioUrl;
    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Autoplay prevented or failed:', err);
        setIsPlaying(false);
      });
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || currentTrack.duration);
    const handleEnded = () => handleNextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const playTrack = (track, trackList = null) => {
    if (trackList) {
      setPlaylist(trackList);
      const idx = trackList.findIndex(t => t.id === track.id);
      setCurrentTrackIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = playlist.findIndex(t => t.id === track.id);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
      } else {
        setPlaylist(prev => [track, ...prev]);
        setCurrentTrackIndex(0);
      }
    }
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current.play().catch(console.warn);
    }, 60);
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
      return;
    }

    // Check custom queue first
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextTrack);
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else if (repeatMode === 'all') {
        setCurrentTrackIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFavorite = (trackId) => {
    setFavorites(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const addToQueue = (track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        setPlaylist,
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        isShuffle,
        setIsShuffle,
        repeatMode,
        toggleRepeat,
        visualizerMode,
        setVisualizerMode,
        eqPreset,
        setEqPreset,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        isQueueOpen,
        setIsQueueOpen,
        selectedEnergy,
        setSelectedEnergy,
        favorites,
        toggleFavorite,
        searchQuery,
        setSearchQuery,
        togglePlay,
        playTrack,
        handleNextTrack,
        handlePrevTrack,
        seek
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
