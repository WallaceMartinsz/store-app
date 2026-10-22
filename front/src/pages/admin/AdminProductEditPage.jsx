import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productsApi from '../../api/productsApi';
import { Feedback } from '../../components/ui/feedback';
import { PageHeading } from '../../components/ui/page-heading';
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
    <section className="mx-auto max-w-[640px]">
      <PageHeading title="Editar produto" description="Atualize as informacoes exibidas na loja." />

      {loading && <Feedback>Carregando produto...</Feedback>}
      {error && <Feedback variant="error">{error}</Feedback>}
      {!loading && product && (
        <ProductForm key={product.id} initialValues={product} submitLabel="Salvar produto" onSubmit={handleUpdate} />
      )}
    </section>
  );
};

export default AdminProductEditPage;
