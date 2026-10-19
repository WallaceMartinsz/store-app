import { useCart } from '../../cart/CartContext';
import ProductCard from '../../features/products/components/ProductCard';
import useProducts from '../../features/products/hooks/useProducts';

const StorefrontPage = () => {
  const { addItem } = useCart();
  const { products, loading, error } = useProducts();

  return (
    <section className="content-section">
      <div className="page-heading">
        <h1>Produtos da loja</h1>
        <p>Catalogo publico para o comprador visualizar produtos e montar o carrinho.</p>
      </div>

      {loading && <p>Carregando produtos...</p>}
      {error && <p className="feedback feedback--error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>Nenhum produto disponivel.</p>}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addItem} />
        ))}
      </div>
    </section>
  );
};

export default StorefrontPage;
