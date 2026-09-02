const API_URL = import.meta.env.VITE_API_URL || window.location.origin + '/api';
const LOGIN_PATHS = ['/auth/login', '/auth/patient-login'];

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('mediai_token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (err) {
        data = { message: 'Invalid JSON response from server' };
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Server returned an empty or non-JSON response' };
    }

    if (!response.ok) {
      const isLoginPath = LOGIN_PATHS.some(p => path.includes(p));
      if (response.status === 401 && !isLoginPath) {
        localStorage.removeItem('mediai_token');
        localStorage.removeItem('mediai_user');
        window.location.href = '/login';
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
}

export { API_URL };
