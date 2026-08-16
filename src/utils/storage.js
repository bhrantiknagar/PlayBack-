/**
 * PlayBack Persistence Layer
 * Handles safe localStorage reading and writing for player settings, state, favorites, and playlists.
 */

import { mockPlaylists } from '../data/mockData';

const STORAGE_KEY = 'playback_player_state';
const FAVORITES_STORAGE_KEY = 'playback_favorites';
const PLAYLISTS_STORAGE_KEY = 'playback_user_playlists';

export const DEFAULT_PLAYBACK_STATE = {
  trackId: 'track-01',
  currentTime: 0,
  volume: 0.85,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off' // 'off' | 'all' | 'one'
};

export const DEFAULT_FAVORITES = ['track-01', 'track-03', 'track-05'];

/**
 * Validate and sanitize loaded state to prevent corrupted localStorage data from crashing the app.
 */
export function sanitizePlaybackState(data) {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_PLAYBACK_STATE };
  }

  const trackId = typeof data.trackId === 'string' && data.trackId.trim()
    ? data.trackId.trim()
    : DEFAULT_PLAYBACK_STATE.trackId;

  const currentTime = (typeof data.currentTime === 'number' && isFinite(data.currentTime) && data.currentTime >= 0)
    ? Math.round(data.currentTime * 100) / 100
    : DEFAULT_PLAYBACK_STATE.currentTime;

  const volume = (typeof data.volume === 'number' && isFinite(data.volume))
    ? Math.max(0, Math.min(1, Math.round(data.volume * 100) / 100))
    : DEFAULT_PLAYBACK_STATE.volume;

  const isMuted = typeof data.isMuted === 'boolean' ? data.isMuted : DEFAULT_PLAYBACK_STATE.isMuted;
  const isShuffle = typeof data.isShuffle === 'boolean' ? data.isShuffle : DEFAULT_PLAYBACK_STATE.isShuffle;
  const repeatMode = ['off', 'all', 'one'].includes(data.repeatMode) ? data.repeatMode : DEFAULT_PLAYBACK_STATE.repeatMode;

  return {
    trackId,
    currentTime,
    volume,
    isMuted,
    isShuffle,
    repeatMode
  };
}

/**
 * Safely load player state from localStorage with fallback defaults.
 */
export function loadPlaybackState() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_PLAYBACK_STATE };
    }
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      return { ...DEFAULT_PLAYBACK_STATE };
    }
    const parsed = JSON.parse(item);
    return sanitizePlaybackState(parsed);
  } catch (error) {
    console.warn('Failed to load playback state from localStorage:', error);
    return { ...DEFAULT_PLAYBACK_STATE };
  }
}

/**
 * Safely save complete or partial playback state to localStorage.
 */
export function savePlaybackState(state) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const current = loadPlaybackState();
    const merged = sanitizePlaybackState({ ...current, ...state });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (error) {
    console.warn('Failed to save playback state to localStorage:', error);
  }
}

/**
 * Optimized helper to save only playback position & track without full object overhead.
 */
export function savePlaybackPosition(currentTime, trackId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const current = loadPlaybackState();
    current.currentTime = Math.max(0, currentTime || 0);
    if (trackId) {
      current.trackId = trackId;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.warn('Failed to update playback position in localStorage:', error);
  }
}

/**
 * Clear persisted playback state if needed.
 */
export function clearPlaybackState() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear playback state:', error);
  }
}

/**
 * Safely load favorite track IDs from localStorage with graceful fallback.
 */
export function loadFavorites() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [...DEFAULT_FAVORITES];
    }
    const item = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!item) {
      return [...DEFAULT_FAVORITES];
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed)) {
      return parsed.filter(id => typeof id === 'string' && id.trim().length > 0);
    }
    return [...DEFAULT_FAVORITES];
  } catch (error) {
    console.warn('Failed to load favorites from localStorage:', error);
    return [...DEFAULT_FAVORITES];
  }
}

/**
 * Safely save favorite track IDs array to localStorage.
 */
export function saveFavorites(favorites) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (Array.isArray(favorites)) {
      const sanitized = favorites.filter(id => typeof id === 'string' && id.trim().length > 0);
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(sanitized));
    }
  } catch (error) {
    console.warn('Failed to save favorites to localStorage:', error);
  }
}

/**
 * Safely load user playlists from localStorage with graceful fallback.
 */
export function loadPlaylists() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [...mockPlaylists];
    }
    const item = window.localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    if (!item) {
      return [...mockPlaylists];
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [...mockPlaylists];
  } catch (error) {
    console.warn('Failed to load playlists from localStorage:', error);
    return [...mockPlaylists];
  }
}

/**
 * Safely save user playlists to localStorage.
 */
export function savePlaylists(playlists) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (Array.isArray(playlists)) {
      window.localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    }
  } catch (error) {
    console.warn('Failed to save playlists to localStorage:', error);
  }
}
