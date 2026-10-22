import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use((config) => {
  const savedSession = localStorage.getItem('store-app-session');

  if (!savedSession) {
    return config;
  }

  const session = JSON.parse(savedSession);

  if (session?.type === 'admin' && session?.token) {
    config.headers.Authorization = `Basic ${session.token}`;
  }

  if (session?.type === 'visitor' && session?.visitor?.accessToken) {
    config.headers['X-Visitor-Token'] = session.visitor.accessToken;
  }

  return config;
});

export default httpClient;
