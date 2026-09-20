const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/userdata`;

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const syncUserData = async (token, localData) => {
  const res = await fetch(`${API_URL}/sync`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(localData)
  });
  if (!res.ok) throw new Error('Failed to sync user data');
  return res.json();
};

export const fetchUserData = async (token) => {
  const res = await fetch(API_URL, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

export const toggleFavorite = async (token, songId) => {
  const res = await fetch(`${API_URL}/favorites`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ songId })
  });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
};

export const savePlaylist = async (token, playlistData) => {
  const res = await fetch(`${API_URL}/playlists`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(playlistData)
  });
  if (!res.ok) throw new Error('Failed to save playlist');
  return res.json();
};

export const deletePlaylist = async (token, id) => {
  const res = await fetch(`${API_URL}/playlists/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete playlist');
  return res.json();
};

export const updateSettings = async (token, settings) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ settings })
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

export const addToHistory = async (token, songId) => {
  const res = await fetch(`${API_URL}/history`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ songId })
  });
  if (!res.ok) throw new Error('Failed to add to history');
  return res.json();
};
