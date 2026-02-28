'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setStatus('loading');
    try {
      const { accessToken } = await authApi.devLogin(username.trim());
      localStorage.setItem('partograma_token', accessToken);
      setStatus('success');
      setMessage('Login realizado! Redirecionando...');
      setTimeout(() => window.location.reload(), 800);
    } catch (err: unknown) {
      setStatus('error');
      const axiosError = err as { response?: { data?: { message?: string } } };
      setMessage(axiosError.response?.data?.message || 'Erro ao autenticar');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-blue-600">Partograma LCG</h1>
          <p className="mb-8 text-gray-500">WHO Labour Care Guide (OMS 2020)</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-800">Login de Desenvolvimento</h2>
          <p className="mb-4 text-xs text-gray-400">
            Placeholder Sprint 1 — será substituído por Keycloak OIDC no Sprint 5.
          </p>

          <form onSubmit={handleDevLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: admin"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {status === 'loading' ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>

          {message && (
            <p
              className={`mt-3 text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-400">
            API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'} | Sprint 1
          </p>
        </div>
      </div>
    </div>
  );
}
