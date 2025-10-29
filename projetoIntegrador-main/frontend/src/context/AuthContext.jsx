
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const storageKey = 'auth';

const AuthContext = createContext({
  token: null,
  user: null,
  empresa: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  authFetch: async () => new Response(),
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Não foi possível carregar a sessão salva:', error);
      return null;
    }
  });

  const login = useCallback((payload) => {
    if (!payload || !payload.token) {
      throw new Error('Resposta de autenticação inválida.');
    }

    const normalized = {
      token: payload.token,
      user: payload.user || null,
      empresa: payload.empresa || null,
    };

    setAuthState(normalized);
  }, []);

  const logout = useCallback(() => {
    setAuthState(null);
  }, []);

  useEffect(() => {
    if (authState && authState.token) {
      localStorage.setItem(storageKey, JSON.stringify(authState));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [authState]);

  const authFetch = useCallback(
    async (input, init = {}) => {
      const headers = new Headers(init.headers || {});
      if (authState?.token) {
        headers.set('Authorization', `Bearer ${authState.token}`);
      }

      const response = await fetch(input, { ...init, headers });

      if (response.status === 401) {
        logout();
      }

      return response;
    },
    [authState?.token, logout]
  );

  const value = useMemo(
    () => ({
      token: authState?.token || null,
      user: authState?.user || null,
      empresa: authState?.empresa || null,
      isAuthenticated: Boolean(authState?.token),
      login,
      logout,
      authFetch,
    }),
    [authState, authFetch, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);