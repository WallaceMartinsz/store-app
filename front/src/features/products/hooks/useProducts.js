import { useCallback, useEffect, useState } from 'react';
import productsApi from '../../../api/productsApi';

export const useProducts = ({ loadOnMount = true } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(loadOnMount);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productsApi.list();
      setProducts(response.data);
    } catch (requestError) {
      setError('Nao foi possivel carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = async (id) => {
    await productsApi.remove(id);
    await loadProducts();
  };

  useEffect(() => {
    if (loadOnMount) {
      loadProducts();
    }
  }, [loadOnMount, loadProducts]);

  return {
    products,
    loading,
    error,
    loadProducts,
    deleteProduct
  };
};

export default useProducts;
