import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CreditCard, PackageX, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import ProductCard from '../../features/products/components/ProductCard';
import { CATEGORIES, findCategoryBySlug } from '../../features/products/categories';
import useProducts from '../../features/products/hooks/useProducts';

const HERO_IMG = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1600&q=80';
const PROMO_IMG = 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1600&q=80';

const BENEFITS = [
  { icon: Truck, title: 'Frete fixo de R$ 10', text: 'Para todo o Brasil' },
  { icon: CreditCard, title: 'Até 10x sem juros', text: 'Nos cartões de crédito' },
  { icon: ShieldCheck, title: 'Compra segura', text: 'Seus dados protegidos' },
  { icon: RotateCcw, title: 'Troca em 7 dias', text: 'Sem complicação' }
];

const SORTERS = {
  relevance: () => 0,
  'price-asc': (a, b) => Number(a.price) - Number(b.price),
  'price-desc': (a, b) => Number(b.price) - Number(a.price),
  name: (a, b) => a.name.localeCompare(b.name, 'pt-BR')
};

const normalize = (text = '') => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const StorefrontPage = () => {
  const { addItem } = useCart();
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const productsRef = useRef(null);

  const category = findCategoryBySlug(searchParams.get('categoria'));
  const query = searchParams.get('q') || '';
  const sort = SORTERS[searchParams.get('ordem')] ? searchParams.get('ordem') : 'relevance';
  const onlyInStock = searchParams.get('estoque') === '1';
  const isFiltering = Boolean(category || query);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    if (isFiltering) {
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isFiltering, category, query]);

  const visibleProducts = useMemo(() => {
    const term = normalize(query.trim());

    return products
      .filter((product) => !category || product.category === category.value)
      .filter((product) => !onlyInStock || product.quantity > 0)
      .filter((product) => !term || normalize(`${product.name} ${product.title}`).includes(term))
      // Na ordenacao padrao, produtos esgotados vao para o fim da lista
      .sort((a, b) => (sort === 'relevance' ? (b.quantity > 0) - (a.quantity > 0) : SORTERS[sort](a, b)));
  }, [products, category, onlyInStock, query, sort]);

  const sectionTitle = query ? `Resultados para "${query}"` : category?.label || 'Todos os produtos';

  return (
    <div className="storefront">
      {!isFiltering && (
        <>
          <section className="hero-banner" style={{ backgroundImage: `url(${HERO_IMG})` }}>
            <div className="hero-banner__content">
              <p className="hero-banner__eyebrow">Novidades da semana</p>
              <h1 className="hero-banner__heading">
                Monte seu <span>setup</span>.<br />Sem complicação.
              </h1>
              <p className="hero-banner__sub">
                Periféricos e acessórios selecionados para jogar, trabalhar e criar com mais conforto.
              </p>
              <a className="button button--lg" href="#produtos">
                Ver produtos <ArrowRight size={18} />
              </a>
            </div>
          </section>

          <section className="benefits" aria-label="Vantagens">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div className="benefit" key={title}>
                <Icon size={26} aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="content-section">
            <div className="section-header">
              <h2 className="section-header__title">Compre por categoria</h2>
            </div>
            <div className="category-grid">
              {CATEGORIES.map(({ value, slug, label, icon: Icon, img }) => (
                <Link className="category-tile" key={value} to={`/?categoria=${slug}`}>
                  <img src={img} alt="" loading="lazy" />
                  <span className="category-tile__label">
                    <Icon size={18} aria-hidden="true" /> {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="content-section" id="produtos" ref={productsRef}>
        <div className="catalog-toolbar">
          <div className="section-header">
            <h2 className="section-header__title">{sectionTitle}</h2>
            {!loading && <span className="section-header__count">{visibleProducts.length} produtos</span>}
          </div>

          <div className="catalog-filters">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(event) => updateParam('estoque', event.target.checked ? '1' : '')}
              />
              Somente em estoque
            </label>
            <select
              className="select"
              aria-label="Ordenar produtos"
              value={sort}
              onChange={(event) => updateParam('ordem', event.target.value === 'relevance' ? '' : event.target.value)}
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="chip-list" role="group" aria-label="Filtrar por categoria">
          <button
            type="button"
            className={`chip ${!category ? 'is-active' : ''}`}
            onClick={() => updateParam('categoria', '')}
          >
            Todos
          </button>
          {CATEGORIES.map((item) => (
            <button
              type="button"
              key={item.value}
              className={`chip ${category?.value === item.value ? 'is-active' : ''}`}
              onClick={() => updateParam('categoria', item.slug)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && <p className="feedback">Carregando produtos...</p>}
        {error && <p className="feedback feedback--error">{error}</p>}

        {!loading && !error && visibleProducts.length === 0 && (
          <div className="empty-state">
            <PackageX size={40} aria-hidden="true" />
            <p>Nenhum produto encontrado com esses filtros.</p>
            <Link className="button button--secondary" to="/">Limpar filtros</Link>
          </div>
        )}

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
          ))}
        </div>
      </section>

      {!isFiltering && (
        <section className="promo-banner" style={{ backgroundImage: `url(${PROMO_IMG})` }}>
          <div className="promo-banner__content">
            <h2>Seu canto gamer merece upgrade</h2>
            <p>Headsets, microfones e webcams para jogar e fazer stream com qualidade.</p>
            <Link className="button" to="/?categoria=streaming">Conferir streaming</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default StorefrontPage;
