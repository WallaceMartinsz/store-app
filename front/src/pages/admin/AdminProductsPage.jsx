import { Link } from 'react-router-dom';
import ProductCard from '../../features/products/components/ProductCard';
import useProducts from '../../features/products/hooks/useProducts';

const AdminProductsPage = () => {
  const { products, loading, error, deleteProduct } = useProducts();

  return (
    <section className="content-section">
      <div className="page-heading page-heading--row">
        <div>
          <h1>Estoque</h1>
          <p>Produtos cadastrados para aparecer na loja.</p>
        </div>
        <Link className="button" to="/admin/products/new">
          Novo produto
        </Link>
      </div>

      {loading && <p>Carregando estoque...</p>}
      {error && <p className="feedback feedback--error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>Nenhum produto cadastrado.</p>}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="admin" onDelete={deleteProduct} />
        ))}
      </div>
    </section>
  );
};

export default AdminProductsPage;
