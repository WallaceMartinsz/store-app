import { createContext, useContext, useState } from 'react';
import authApi from '../api/authApi';

const SESSION_KEY = 'store-app-session';
const AuthContext = createContext(null);

const readSavedSession = () => {
  const savedSession = localStorage.getItem(SESSION_KEY);

  if (!savedSession) {
    return null;
  }

  return JSON.parse(savedSession);
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSavedSession);

  const saveSession = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const loginAdmin = async ({ username, password }) => {
    const response = await authApi.loginAdmin(username, password);
    const nextSession = {
      type: 'admin',
      username: response.data.username,
      role: response.data.role,
      token: btoa(`${username}:${password}`)
    };

    saveSession(nextSession);
    return nextSession;
  };

  const registerVisitor = async (visitor) => {
    const response = await authApi.registerVisitor(visitor);
    const nextSession = {
      type: 'visitor',
      visitor: response.data
    };

    saveSession(nextSession);
    return nextSession;
  };

  const loginVisitor = async ({ email, password }) => {
    const response = await authApi.loginVisitor(email, password);
    const nextSession = {
      type: 'visitor',
      visitor: response.data
    };

    saveSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
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
