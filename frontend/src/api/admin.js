const API_URL = import.meta.env.VITE_API_URL + '/api/library';

// Helper to make API calls with token
const fetchWithToken = async (url, method, token, body = null) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(url, options);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Tracks
export const createTrack = (token, data) => fetchWithToken(`${API_URL}/tracks`, 'POST', token, data);
export const updateTrack = (token, id, data) => fetchWithToken(`${API_URL}/tracks/${id}`, 'PUT', token, data);
export const deleteTrack = (token, id) => fetchWithToken(`${API_URL}/tracks/${id}`, 'DELETE', token);

// Albums
export const createAlbum = (token, data) => fetchWithToken(`${API_URL}/albums`, 'POST', token, data);
export const updateAlbum = (token, id, data) => fetchWithToken(`${API_URL}/albums/${id}`, 'PUT', token, data);
export const deleteAlbum = (token, id) => fetchWithToken(`${API_URL}/albums/${id}`, 'DELETE', token);

// Artists
export const createArtist = (token, data) => fetchWithToken(`${API_URL}/artists`, 'POST', token, data);
export const updateArtist = (token, id, data) => fetchWithToken(`${API_URL}/artists/${id}`, 'PUT', token, data);
export const deleteArtist = (token, id) => fetchWithToken(`${API_URL}/artists/${id}`, 'DELETE', token);
