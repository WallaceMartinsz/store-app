// Sessao salva no navegador: { type, token, expiresAt, ... } com o JWT devolvido pela API
const SESSION_KEY = 'store-app-session';
export const SESSION_EXPIRED_EVENT = 'store-app:session-expired';

export const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

// Sessoes antigas (Basic Auth / X-Visitor-Token) nao tem token JWT nem expiresAt e contam como expiradas
export const isSessionExpired = (session) => (
  !session?.token || !session?.expiresAt || Date.parse(session.expiresAt) <= Date.now()
);

export const readValidSession = () => {
  const session = readSession();

  if (session && isSessionExpired(session)) {
    clearSession();
    return null;
  }

  return session;
};

export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// Limpa a sessao e avisa o AuthContext para voltar ao estado deslogado
export const expireSession = () => {
  clearSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};
