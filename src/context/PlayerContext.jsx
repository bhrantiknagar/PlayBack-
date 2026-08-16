import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { tracks } from '../data/tracks';
import { loadPlaybackState, savePlaybackState, savePlaybackPosition, loadFavorites, saveFavorites } from '../utils/storage';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // Load persisted player settings from localStorage (safe with fallbacks)
  const initialSavedState = useRef(loadPlaybackState()).current;
  const initialTrackIndex = (() => {
    const idx = tracks.findIndex(t => t.id === initialSavedState.trackId);
    return idx !== -1 ? idx : 0;
  })();

  const [playlist, setPlaylist] = useState(tracks);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialSavedState.currentTime || 0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialSavedState.volume);
  const [isMuted, setIsMutedState] = useState(initialSavedState.isMuted);
  const [isShuffle, setIsShuffleState] = useState(initialSavedState.isShuffle);
  const [repeatMode, setRepeatModeState] = useState(initialSavedState.repeatMode); // 'off' | 'all' | 'one'
  const [visualizerMode, setVisualizerMode] = useState('wave');
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavoritesState] = useState(() => {
    return loadFavorites();
  });

  const audioRef = useRef(null);
  if (!audioRef.current) {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audioRef.current = audio;
  }

  // Ref to track last throttled save timestamp
  const lastSaveTimeRef = useRef(0);

  // Web Audio API Analyser Integration
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const [analyserNode, setAnalyserNode] = useState(null);

  const initAudioContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;

        if (audioRef.current && !sourceNodeRef.current) {
          try {
            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceNodeRef.current = source;
          } catch (err) {
            console.warn('Web Audio createMediaElementSource note:', err);
          }
        }

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        setAnalyserNode(analyser);
      }

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }

      return analyserRef.current;
    } catch (e) {
      console.warn('AudioContext initialization note:', e);
      return null;
    }
  }, []);

  // Unlock AudioContext on first user interaction if suspended
  useEffect(() => {
    const handleUnlock = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    };
    window.addEventListener('click', handleUnlock, { passive: true, once: false });
    window.addEventListener('keydown', handleUnlock, { passive: true, once: false });
    window.addEventListener('touchstart', handleUnlock, { passive: true, once: false });
    return () => {
      window.removeEventListener('click', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
    };
  }, []);

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || tracks[0];

  // Initial setup on mount: restore audio source and position without autoplaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = initialSavedState.isMuted ? 0 : initialSavedState.volume;
    
    const initialTrack = playlist[initialTrackIndex] || tracks[0];
    if (initialTrack) {
      const trackSrc = initialTrack.audio || initialTrack.audioUrl;
      if (trackSrc) {
        audio.src = trackSrc;
        audio.load();

        if (initialSavedState.currentTime > 0) {
          const restorePosition = () => {
            try {
              if (initialSavedState.currentTime < (audio.duration || Infinity)) {
                audio.currentTime = initialSavedState.currentTime;
              }
            } catch (err) {
              console.warn('Could not restore initial audio position:', err);
            }
          };

          if (audio.readyState >= 1) {
            restorePosition();
          } else {
            audio.addEventListener('loadedmetadata', restorePosition, { once: true });
          }
        }
      }
    }
  }, []); // Run once on mount

  // Flush state on page unload / refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      const audio = audioRef.current;
      const pos = audio ? audio.currentTime : currentTime;
      savePlaybackState({
        trackId: currentTrack?.id,
        currentTime: pos,
        volume,
        isMuted,
        isShuffle,
        repeatMode
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [currentTrack?.id, currentTime, volume, isMuted, isShuffle, repeatMode]);

  // Set Shuffle with persistence
  const setIsShuffle = useCallback((value) => {
    setIsShuffleState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      savePlaybackState({ isShuffle: next });
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffleState(prev => {
      const next = !prev;
      savePlaybackState({ isShuffle: next });
      return next;
    });
  }, []);

  // Set Repeat Mode with persistence
  const setRepeatMode = useCallback((value) => {
    setRepeatModeState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      savePlaybackState({ repeatMode: next });
      return next;
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatModeState(prev => {
      const next = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      savePlaybackState({ repeatMode: next });
      return next;
    });
  }, []);

  // Play a specific track
  const playTrack = useCallback((track, trackList = null) => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    initAudioContext();

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

    // Persist new track with 0 starting position
    savePlaybackState({
      trackId: track.id,
      currentTime: 0
    });

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.warn('Play track interrupted:', err);
    });
  }, [playlist, initAudioContext]);

  // Next Track Logic
  const handleNextTrack = useCallback((autoPlayNext = true) => {
    const audio = audioRef.current;
    initAudioContext();

    // 1. Repeat ONE: restart same track from beginning
    if (repeatMode === 'one') {
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
        savePlaybackPosition(0, currentTrack?.id);
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
          setCurrentTime(0);
          savePlaybackPosition(0, currentTrack?.id);
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
        savePlaybackState({
          trackId: nextTrack.id,
          currentTime: 0
        });
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
      savePlaybackPosition(0, currentTrack?.id);
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
      savePlaybackState({
        trackId: nextTrack.id,
        currentTime: 0
      });
      if (autoPlayNext) {
        audio.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  }, [currentTrackIndex, playlist, repeatMode, queue, isShuffle, playTrack, initAudioContext, currentTrack?.id]);

  // Previous Track Logic
  const handlePrevTrack = useCallback(() => {
    const audio = audioRef.current;
    initAudioContext();

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      savePlaybackPosition(0, currentTrack?.id);
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
      savePlaybackState({
        trackId: prevTrack.id,
        currentTime: 0
      });
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.warn);
    }
  }, [currentTrackIndex, playlist, initAudioContext, currentTrack?.id]);

  // Set up real HTML5 audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      setIsPlaying(false);
      // Persist exact position on pause
      if (audio && currentTrack) {
        savePlaybackPosition(audio.currentTime, currentTrack.id);
      }
    };
    const handleTimeUpdate = () => {
      const currentSec = audio.currentTime || 0;
      setCurrentTime(currentSec);

      // Throttled periodic persistence (~1.5s interval during playback)
      const now = Date.now();
      if (now - lastSaveTimeRef.current > 1500) {
        lastSaveTimeRef.current = now;
        if (currentTrack) {
          savePlaybackPosition(currentSec, currentTrack.id);
        }
      }
    };
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
      // Clear position on natural track completion
      savePlaybackPosition(0, currentTrack?.id);
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
  }, [handleNextTrack, currentTrack]);

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

  // Volume & Mute synchronizer with persistence
  const setVolume = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
    savePlaybackState({ volume: clamped });
  }, [isMuted]);

  const setIsMuted = useCallback((muted) => {
    setIsMutedState(muted);
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
    savePlaybackState({ isMuted: muted });
  }, [volume]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    initAudioContext();

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
      savePlaybackPosition(audio.currentTime, currentTrack?.id);
    }
  }, [currentTrack, initAudioContext]);

  // Seeking
  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isFinite(time)) {
      const targetTime = Math.max(0, Math.min(audio.duration || time, time));
      audio.currentTime = targetTime;
      setCurrentTime(targetTime);
      savePlaybackPosition(targetTime, currentTrack?.id);
    }
  }, [currentTrack?.id]);

  const toggleFavorite = useCallback((trackId) => {
    if (!trackId) return;
    setFavoritesState(prev => {
      const next = prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId];
      saveFavorites(next);
      return next;
    });
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
        setRepeatMode,
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
        seek,
        analyserNode: analyserNode || analyserRef.current,
        initAudioContext
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
