import { createContext, useContext, useEffect, useState } from 'react';
import authApi from '../api/authApi';
import {
  SESSION_EXPIRED_EVENT,
  clearSession,
  expireSession,
  readValidSession,
  saveSession as persistSession
} from './session';

// setTimeout aceita no maximo ~24,8 dias
const MAX_TIMEOUT_MS = 2 ** 31 - 1;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readValidSession);

  useEffect(() => {
    const handleExpired = () => setSession(null);

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  // Desloga sozinho quando o JWT vence, mesmo sem nenhuma requisicao
  useEffect(() => {
    if (!session?.expiresAt) {
      return undefined;
    }

    const remaining = Date.parse(session.expiresAt) - Date.now();
    const timer = setTimeout(expireSession, Math.min(Math.max(remaining, 0), MAX_TIMEOUT_MS));
    return () => clearTimeout(timer);
  }, [session]);

  const saveSession = (nextSession) => {
    persistSession(nextSession);
    setSession(nextSession);
  };

  const loginAdmin = async ({ username, password }) => {
    const response = await authApi.loginAdmin(username, password);
    const nextSession = {
      type: 'admin',
      token: response.data.token,
      expiresAt: response.data.expiresAt,
      username: response.data.username,
      role: response.data.role
    };

    saveSession(nextSession);
    return nextSession;
  };

  const saveVisitorSession = (data) => {
    const nextSession = {
      type: 'visitor',
      token: data.token,
      expiresAt: data.expiresAt,
      visitor: data.visitor
    };

    saveSession(nextSession);
    return nextSession;
  };

  const registerVisitor = async (visitor) => {
    const response = await authApi.registerVisitor(visitor);
    return saveVisitorSession(response.data);
  };

  const loginVisitor = async ({ email, password }) => {
    const response = await authApi.loginVisitor(email, password);
    return saveVisitorSession(response.data);
  };

  const logout = () => {
    clearSession();
    localStorage.removeItem('store-app-cart');
    setSession(null);
  };

  const value = {
    session,
    isAdmin: session?.type === 'admin',
    isVisitor: session?.type === 'visitor',
    loginAdmin,
    loginVisitor,
    registerVisitor,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
