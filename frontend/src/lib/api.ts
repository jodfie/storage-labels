// API Client for Storage Labels Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJSON<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || error.error || 'Request failed',
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, error);
  }
}

async function fetchJSONWithFile<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || error.error || 'Request failed',
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, error);
  }
}

// Container API
export const containers = {
  generate: (data?: {
    color?: string;
    number?: number;
    description?: string;
    location_text?: string;
  }) => fetchJSON('/containers/generate', {
    method: 'POST',
    body: JSON.stringify(data || {}),
  }),

  getAll: () => fetchJSON('/containers'),

  getByQRCode: (qrCode: string) => fetchJSON(`/containers/${qrCode}`),

  update: (id: string, data: {
    location_id?: string;
    location_text?: string;
    description?: string;
    photo_url?: string;
  }) => fetchJSON(`/containers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => fetchJSON(`/containers/${id}`, {
    method: 'DELETE',
  }),

  getItems: (id: string) => fetchJSON(`/containers/${id}/items`),

  addItem: (id: string, data: {
    name: string;
    description?: string;
    quantity?: number;
    photo?: File;
  }) => {
    if (data.photo) {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.quantity) formData.append('quantity', String(data.quantity));
      formData.append('photo', data.photo);
      return fetchJSONWithFile(`/containers/${id}/items`, formData);
    } else {
      return fetchJSON(`/containers/${id}/items`, {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          quantity: data.quantity,
        }),
      });
    }
  },
};

// Item API
export const items = {
  update: (id: string, data: {
    name?: string;
    description?: string;
    quantity?: number;
    photo?: File;
  }) => {
    if (data.photo) {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.quantity !== undefined) formData.append('quantity', String(data.quantity));
      formData.append('photo', data.photo);
      
      return fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new ApiError(error.message || error.error || 'Request failed', res.status, error);
        }
        return res.json();
      });
    } else {
      return fetchJSON(`/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },

  delete: (id: string) => fetchJSON(`/items/${id}`, {
    method: 'DELETE',
  }),
};

// Search API
export const search = {
  query: (q: string) => fetchJSON(`/search?q=${encodeURIComponent(q)}`),
};

// Location API
export const locations = {
  getAll: () => fetchJSON('/locations'),

  create: (data: { name: string; description?: string }) =>
    fetchJSON('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name: string; description?: string }) =>
    fetchJSON(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchJSON(`/locations/${id}`, {
      method: 'DELETE',
    }),
};

export { ApiError };
