import { useCart } from '../../cart/CartContext';
import ProductCard from '../../features/products/components/ProductCard';
import useProducts from '../../features/products/hooks/useProducts';

const StorefrontPage = () => {
  const { addItem } = useCart();
  const { products, loading, error } = useProducts();

  return (
    <div>
      <section className="hero">
        <p className="hero__eyebrow">Periféricos & Acessórios</p>
        <h1 className="hero__heading">
          Monte seu <span>setup</span>.<br />Sem complicação.
        </h1>
        <p className="hero__sub">
          Seleção de periféricos e acessórios para quem leva a experiência a sério.
        </p>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2 className="section-header__title">Em estoque</h2>
          <span className="section-header__count">{products.length} produtos</span>
        </div>

        {loading && <p className="feedback">Carregando produtos...</p>}
        {error && <p className="feedback feedback--error">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: '#94a3b8' }}>Nenhum produto disponível.</p>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StorefrontPage;
