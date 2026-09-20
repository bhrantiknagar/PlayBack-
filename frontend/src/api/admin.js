const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/library`;

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

// Upload File with Progress
export const uploadFile = (token, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}/api/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.message || 'Upload failed'));
        } catch (e) {
          reject(new Error('Upload failed'));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
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
