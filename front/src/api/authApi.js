import httpClient from './httpClient';

export const authApi = {
  loginAdmin: (username, password) => httpClient.post('/auth/admin/login', { username, password }),
  registerVisitor: (visitor) => httpClient.post('/auth/visitors', visitor),
  loginVisitor: (email, password) => httpClient.post('/auth/visitors/login', { email, password })
};

export default authApi;
