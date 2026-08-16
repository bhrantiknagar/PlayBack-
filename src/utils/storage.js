/**
 * PlayBack Persistence Layer
 * Handles safe localStorage reading and writing for player settings and state.
 */

const STORAGE_KEY = 'playback_player_state';

export const DEFAULT_PLAYBACK_STATE = {
  trackId: 'track-01',
  currentTime: 0,
  volume: 0.85,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off' // 'off' | 'all' | 'one'
};

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
