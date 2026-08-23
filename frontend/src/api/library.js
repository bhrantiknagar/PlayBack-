const API_URL = import.meta.env.VITE_API_URL + '/api/library';

export const fetchTracks = async () => {
  const res = await fetch(`${API_URL}/tracks`);
  if (!res.ok) throw new Error('Failed to fetch tracks');
  return res.json();
};

export const fetchAlbums = async () => {
  const res = await fetch(`${API_URL}/albums`);
  if (!res.ok) throw new Error('Failed to fetch albums');
  return res.json();
};

export const fetchArtists = async () => {
  const res = await fetch(`${API_URL}/artists`);
  if (!res.ok) throw new Error('Failed to fetch artists');
  return res.json();
};
