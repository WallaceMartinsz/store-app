import httpClient from './httpClient';

const PRODUCTS_PATH = '/store';

export const productsApi = {
  list: () => httpClient.get(PRODUCTS_PATH),
  getById: (id) => httpClient.get(`${PRODUCTS_PATH}/${id}`),
  create: (product) => httpClient.post(PRODUCTS_PATH, product),
  update: (id, product) => httpClient.put(`${PRODUCTS_PATH}/${id}`, product),
  remove: (id) => httpClient.delete(`${PRODUCTS_PATH}/${id}`)
};

export default productsApi;
