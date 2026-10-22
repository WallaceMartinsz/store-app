import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/button';
import { Feedback } from '../../components/ui/feedback';
import { PageHeading } from '../../components/ui/page-heading';
import ProductCard from '../../features/products/components/ProductCard';
import useProducts from '../../features/products/hooks/useProducts';

const AdminProductsPage = () => {
  const { products, loading, error, deleteProduct } = useProducts();

  return (
    <section className="mx-auto max-w-content">
      <PageHeading
        title="Estoque"
        description="Produtos cadastrados para aparecer na loja."
        actions={(
          <Button as={Link} to="/admin/products/new">
            <Plus size={16} /> Novo produto
          </Button>
        )}
      />

      {loading && <Feedback>Carregando estoque...</Feedback>}
      {error && <Feedback variant="error">{error}</Feedback>}
      {!loading && !error && products.length === 0 && <Feedback>Nenhum produto cadastrado.</Feedback>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} variant="admin" onDelete={deleteProduct} />
        ))}
      </div>
    </section>
  );
};

export default AdminProductsPage;
