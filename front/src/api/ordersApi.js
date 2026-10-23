import httpClient from './httpClient';

const ORDERS_PATH = '/orders';

export const ordersApi = {
  create: (items, paymentMethod, installments) => httpClient.post(ORDERS_PATH, { items, paymentMethod, installments }),
  pay: (id) => httpClient.post(`${ORDERS_PATH}/${id}/payment`),
  listMine: () => httpClient.get(`${ORDERS_PATH}/me`),
  list: (visitorId) => httpClient.get(ORDERS_PATH, { params: visitorId ? { visitorId } : {} }),
  getById: (id) => httpClient.get(`${ORDERS_PATH}/${id}`),
  updateStatus: (id, status) => httpClient.patch(`${ORDERS_PATH}/${id}/status`, { status })
};

export const getApiErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

export const isUnauthorized = (error) => error?.response?.status === 401;

export default ordersApi;
