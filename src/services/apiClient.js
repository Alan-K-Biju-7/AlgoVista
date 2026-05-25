const API_BASE = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
