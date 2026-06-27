const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem('isokosense_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  me: () => request('/api/auth/me'),

  getDashboardSummary: () => request('/api/dashboard/summary'),

  getReadings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/readings${query ? `?${query}` : ''}`);
  },

  getLatestReadings: () => request('/api/readings/latest'),
  getDeviceReadings: (deviceId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/readings/${deviceId}${query ? `?${query}` : ''}`);
  },

  getDeviceHistory: (deviceId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/readings/${deviceId}/history${query ? `?${query}` : ''}`);
  },

  getAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/alerts${query ? `?${query}` : ''}`);
  },

  getAlert: (id) => request(`/api/alerts/${id}`),

  resolveAlert: (id) => request(`/api/alerts/${id}/resolve`, { method: 'PATCH' }),

  getDevices: () => request('/api/devices'),

  registerDevice: (payload) =>
    request('/api/devices', { method: 'POST', body: JSON.stringify(payload) }),

  updateDevice: (deviceId, payload) =>
    request(`/api/devices/${deviceId}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  getDeviceStatus: (deviceId) => request(`/api/devices/${deviceId}/status`),

  sendNotification: (payload) =>
    request('/api/notifications', { method: 'POST', body: JSON.stringify(payload) }),

  getZones: () => request('/api/zones'),
};

export { ApiError, API_BASE };
