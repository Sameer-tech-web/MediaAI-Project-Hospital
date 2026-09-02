const API_URL = import.meta.env.VITE_API_URL || window.location.origin + '/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('mediai_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('mediai_token');
    localStorage.removeItem('mediai_user');
    window.location.reload();
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export { API_URL };
