import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { sampleTracks } from '../data/sampleTracks';

const PlayerContext = createContext(null);

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
  const [visualizerMode, setVisualizerMode] = useState('wave');
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
      });
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || currentTrack.duration);
    const handleEnded = () => {
      handleNextTrack(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, playlist]);

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
    }, 50);
  };

  const handleNextTrack = (autoPlayNext = isPlaying) => {
    // 1. Repeat ONE: restart same track
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (autoPlayNext) {
        audioRef.current.play().catch(console.warn);
        setIsPlaying(true);
      }
      return;
    }

    // 2. Custom User Queue
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextTrack);
      return;
    }

    // 3. Shuffle ON: Pick random track (excluding current unless single track)
    if (isShuffle) {
      if (playlist.length <= 1) {
        audioRef.current.currentTime = 0;
        if (autoPlayNext) audioRef.current.play().catch(console.warn);
        return;
      }
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentTrackIndex);

      setCurrentTrackIndex(randomIndex);
      if (autoPlayNext) setIsPlaying(true);
      return;
    }

    // 4. Normal Sequential Playback
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      if (autoPlayNext) setIsPlaying(true);
    } else if (repeatMode === 'all') {
      // Repeat ALL: wrap to start
      setCurrentTrackIndex(0);
      if (autoPlayNext) setIsPlaying(true);
    } else {
      // Repeat OFF: stop at end
      setIsPlaying(false);
      audioRef.current.pause();
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
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

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
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
        toggleShuffle,
        setIsShuffle,
        repeatMode,
        toggleRepeat,
        visualizerMode,
        setVisualizerMode,
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
