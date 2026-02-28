// =====================================================================
// API Client — Configuração base do Axios para comunicação com o backend
// =====================================================================

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('partograma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('partograma_token');
        // Redireciona para login se não autenticado
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);

// --- API functions ---

export interface Unit {
  id: string;
  name: string;
  externalId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  unitId: string | null;
  unit?: Unit;
  createdAt: string;
  updatedAt: string;
}

// Units API
export const unitsApi = {
  list: () => api.get<Unit[]>('/units').then((r) => r.data),
  getById: (id: string) => api.get<Unit>(`/units/${id}`).then((r) => r.data),
  create: (data: Partial<Unit>) => api.post<Unit>('/units', data).then((r) => r.data),
  update: (id: string, data: Partial<Unit>) =>
    api.put<Unit>(`/units/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/units/${id}`),
};

// Users API
export const usersApi = {
  list: () => api.get<User[]>('/users').then((r) => r.data),
  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),
  create: (data: Partial<User>) => api.post<User>('/users', data).then((r) => r.data),
  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`),
};

// Auth API
export const authApi = {
  devLogin: (username: string) =>
    api.post<{ accessToken: string }>('/auth/dev-login', { username }).then((r) => r.data),
  getProfile: () => api.get<User>('/auth/profile').then((r) => r.data),
};
