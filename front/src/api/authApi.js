import httpClient from './httpClient';

export const authApi = {
  loginAdmin: (username, password) => {
    const token = btoa(`${username}:${password}`);

    return httpClient.get('/auth/admin/me', {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  },
  registerVisitor: (visitor) => httpClient.post('/auth/visitors', visitor),
  loginVisitor: (email) => httpClient.post('/auth/visitors/login', { email })
};

export default authApi;
