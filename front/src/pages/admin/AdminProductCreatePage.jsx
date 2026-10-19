import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsApi from '../../api/productsApi';
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
    <section className="content-section content-section--narrow">
      <div className="page-heading">
        <h1>Novo produto</h1>
        <p>Cadastro usado pelo admin para alimentar a vitrine.</p>
      </div>

      {error && <p className="feedback feedback--error">{error}</p>}
      <ProductForm submitLabel="Cadastrar produto" onSubmit={handleCreate} />
    </section>
  );
};

export default AdminProductCreatePage;
