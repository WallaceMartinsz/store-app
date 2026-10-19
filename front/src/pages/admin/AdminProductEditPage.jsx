import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productsApi from '../../api/productsApi';
import ProductForm from '../../features/products/components/ProductForm';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productsApi.getById(id);
        setProduct(response.data);
      } catch (requestError) {
        setError('Nao foi possivel carregar o produto.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleUpdate = async (updatedProduct) => {
    try {
      setError('');
      await productsApi.update(id, updatedProduct);
      navigate('/admin/products');
    } catch (requestError) {
      setError('Nao foi possivel atualizar o produto.');
    }
  };

  return (
    <section className="content-section content-section--narrow">
      <div className="page-heading">
        <h1>Editar produto</h1>
        <p>Atualize as informacoes exibidas na loja.</p>
      </div>

      {loading && <p>Carregando produto...</p>}
      {error && <p className="feedback feedback--error">{error}</p>}
      {!loading && product && (
        <ProductForm key={product.id} initialValues={product} submitLabel="Salvar produto" onSubmit={handleUpdate} />
      )}
    </section>
  );
};

export default AdminProductEditPage;
