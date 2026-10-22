import axios from 'axios';
import { expireSession, isSessionExpired, readSession } from '../auth/session';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use((config) => {
  const session = readSession();

  if (!session) {
    return config;
  }

  // Token vencido nao e enviado: a API recusaria ate as rotas publicas
  if (isSessionExpired(session)) {
    expireSession();
    return config;
  }

  config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 com token enviado: token invalido ou revogado, a sessao local nao serve mais
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      expireSession();
    }

    return Promise.reject(error);
  }
);

export default httpClient;
