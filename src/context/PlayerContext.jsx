import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { tracks } from '../data/tracks';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState(tracks);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMutedState] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [visualizerMode, setVisualizerMode] = useState('wave');
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    return tracks.filter(t => t.liked).map(t => t.id);
  });

  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || tracks[0];

  // Play a specific track
  const playTrack = useCallback((track, trackList = null) => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    let targetIndex = 0;
    if (trackList && Array.isArray(trackList)) {
      setPlaylist(trackList);
      targetIndex = trackList.findIndex(t => t.id === track.id);
      if (targetIndex === -1) targetIndex = 0;
    } else {
      targetIndex = playlist.findIndex(t => t.id === track.id);
      if (targetIndex === -1) {
        setPlaylist(prev => [track, ...prev]);
        targetIndex = 0;
      }
    }

    setCurrentTrackIndex(targetIndex);

    const trackAudioSrc = track.audio || track.audioUrl;
    if (trackAudioSrc && audio.getAttribute('src') !== trackAudioSrc) {
      audio.src = trackAudioSrc;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
    }

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn('Play track interrupted:', err);
    });
  }, [playlist]);

  // Next Track Logic
  const handleNextTrack = useCallback((autoPlayNext = true) => {
    const audio = audioRef.current;

    // 1. Repeat ONE: restart same track from beginning
    if (repeatMode === 'one') {
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
        if (autoPlayNext) {
          audio.play().catch(console.warn);
        }
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
        if (audio) {
          audio.currentTime = 0;
          if (autoPlayNext) audio.play().catch(console.warn);
        }
        return;
      }
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentTrackIndex && playlist.length > 1);

      setCurrentTrackIndex(randomIndex);
      const nextTrack = playlist[randomIndex];
      if (nextTrack && audio) {
        const trackAudioSrc = nextTrack.audio || nextTrack.audioUrl;
        if (trackAudioSrc && audio.getAttribute('src') !== trackAudioSrc) {
          audio.src = trackAudioSrc;
          audio.load();
          setCurrentTime(0);
          setDuration(0);
        }
        if (autoPlayNext) {
          audio.play().then(() => setIsPlaying(true)).catch(console.warn);
        }
      }
      return;
    }

    // 4. Normal Sequential Playback
    let nextIndex;
    if (currentTrackIndex < playlist.length - 1) {
      nextIndex = currentTrackIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      // Repeat OFF: Stop at the end of the playlist
      setIsPlaying(false);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }

    setCurrentTrackIndex(nextIndex);
    const nextTrack = playlist[nextIndex];
    if (nextTrack && audio) {
      const trackAudioSrc = nextTrack.audio || nextTrack.audioUrl;
      if (trackAudioSrc && audio.getAttribute('src') !== trackAudioSrc) {
        audio.src = trackAudioSrc;
        audio.load();
        setCurrentTime(0);
        setDuration(0);
      }
      if (autoPlayNext) {
        audio.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  }, [currentTrackIndex, playlist, repeatMode, queue, isShuffle, playTrack]);

  // Previous Track Logic
  const handlePrevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    let prevIndex;
    if (currentTrackIndex > 0) {
      prevIndex = currentTrackIndex - 1;
    } else {
      prevIndex = playlist.length - 1;
    }

    setCurrentTrackIndex(prevIndex);
    const prevTrack = playlist[prevIndex];
    if (prevTrack && audio) {
      const trackAudioSrc = prevTrack.audio || prevTrack.audioUrl;
      if (trackAudioSrc && audio.getAttribute('src') !== trackAudioSrc) {
        audio.src = trackAudioSrc;
        audio.load();
        setCurrentTime(0);
        setDuration(0);
      }
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.warn);
    }
  }, [currentTrackIndex, playlist]);

  // Set up real HTML5 audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      handleNextTrack(true);
    };
    const handleError = (e) => {
      console.warn('Audio playback error on track:', currentTrack?.title, e);
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [handleNextTrack, currentTrack?.title]);

  // Sync track src on currentTrack change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const trackAudioSrc = currentTrack.audio || currentTrack.audioUrl;
    if (!trackAudioSrc) return;

    const currentSrc = audio.getAttribute('src');
    if (currentSrc !== trackAudioSrc) {
      audio.src = trackAudioSrc;
      audio.load();
      setCurrentTime(0);
      setDuration(0);

      if (isPlaying) {
        audio.play().catch(err => {
          console.warn('Playback play request interrupted or prevented:', err);
        });
      }
    }
  }, [currentTrack, isPlaying]);

  // Volume & Mute synchronizer
  const setVolume = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
  }, [isMuted]);

  const setIsMuted = useCallback((muted) => {
    setIsMutedState(muted);
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src && currentTrack) {
      audio.src = currentTrack.audio || currentTrack.audioUrl;
    }

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Autoplay error:', err);
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  // Seeking
  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isFinite(time)) {
      audio.currentTime = Math.max(0, Math.min(audio.duration || time, time));
      setCurrentTime(audio.currentTime);
    }
  }, []);

  const toggleFavorite = useCallback((trackId) => {
    setFavorites(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

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
