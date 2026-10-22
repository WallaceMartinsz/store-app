import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsApi from '../../api/productsApi';
import { Feedback } from '../../components/ui/feedback';
import { PageHeading } from '../../components/ui/page-heading';
import ProductForm from '../../features/products/components/ProductForm';

const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleCreate = async (product) => {
    try {
      setError('');
      await productsApi.create(product);
      navigate('/admin/products');
    } catch (requestError) {
      setError('Nao foi possivel cadastrar o produto.');
    }
  };

  return (
    <section className="mx-auto max-w-[640px]">
      <PageHeading title="Novo produto" description="Cadastro usado pelo admin para alimentar a vitrine." />

      {error && <Feedback variant="error">{error}</Feedback>}
      <ProductForm submitLabel="Cadastrar produto" onSubmit={handleCreate} />
    </section>
  );
};

export default AdminProductCreatePage;
