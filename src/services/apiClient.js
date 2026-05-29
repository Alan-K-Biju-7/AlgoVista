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
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    const error = new Error(data.error || `Request failed with status ${response.status}.`);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
