import axios from 'axios';

const API_URL = 'http://localhost:8080';

const fetchStoreData = async () => {
  const response = await axios.get(API_URL + '/store');
  return response;
};

export default fetchStoreData;