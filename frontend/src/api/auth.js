const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/auth`;

const safeFetchJson = async (url, options, defaultErrorMsg) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || defaultErrorMsg);
    }
    return data;
  } catch (error) {
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server. Please make sure the backend server is running on port 5000.');
    }
    throw error;
  }
};

export const register = async (userData) => {
  return safeFetchJson(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }, 'Registration failed');
};

export const login = async (userData) => {
  return safeFetchJson(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }, 'Login failed');
};

export const getMe = async (token) => {
  return safeFetchJson(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, 'Failed to fetch user');
};

export const updateProfile = async (token, profileData) => {
  return safeFetchJson(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  }, 'Failed to update profile');
};
