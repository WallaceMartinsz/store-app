import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CreditCard, PackageX, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../cart/CartContext';
import Button from '../../components/ui/button';
import Chip from '../../components/ui/chip';
import { EmptyState, Feedback } from '../../components/ui/feedback';
import { Select } from '../../components/ui/input';
import { SectionHeader } from '../../components/ui/page-heading';
import { cn } from '../../lib/utils';
import { MAX_INSTALLMENTS } from '../../features/checkout/payment';
import ProductCard from '../../features/products/components/ProductCard';
import { CATEGORIES, findCategoryBySlug } from '../../features/products/categories';
import useProducts from '../../features/products/hooks/useProducts';
import { normalizeText } from '../../utils/formatters';

const HERO_IMG = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1600&q=80';
const PROMO_IMG = 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1600&q=80';

const BENEFITS = [
  { icon: Truck, title: 'Frete fixo de R$ 10', text: 'Para todo o Brasil' },
  { icon: CreditCard, title: `Até ${MAX_INSTALLMENTS}x sem juros`, text: 'Nos cartões de crédito' },
  { icon: ShieldCheck, title: 'Compra segura', text: 'Seus dados protegidos' },
  { icon: RotateCcw, title: 'Troca em 7 dias', text: 'Sem complicação' }
];

// Bordas internas da faixa de vantagens nos tres layouts (4, 2 e 1 colunas)
const benefitBorder = (index) => cn(
  index > 0 && 'border-l border-line max-[760px]:border-l-0 max-[760px]:border-t',
  index === 2 && 'max-[1000px]:border-l-0',
  index >= 2 && 'max-[1000px]:border-t'
);

const bannerOverlay = 'max-[760px]:bg-none max-[760px]:bg-[rgba(15,17,23,0.8)] max-[760px]:px-6 max-[760px]:py-10';

const SORTERS = {
  relevance: () => 0,
  'price-asc': (a, b) => Number(a.price) - Number(b.price),
  'price-desc': (a, b) => Number(b.price) - Number(a.price),
  name: (a, b) => a.name.localeCompare(b.name, 'pt-BR')
};

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
    const term = normalizeText(query.trim());

    return products
      .filter((product) => !category || product.category === category.value)
      .filter((product) => !onlyInStock || product.quantity > 0)
      .filter((product) => !term || normalizeText(`${product.name} ${product.title}`).includes(term))
      // Na ordenacao padrao, produtos esgotados vao para o fim da lista
      .sort((a, b) => (sort === 'relevance' ? (b.quantity > 0) - (a.quantity > 0) : SORTERS[sort](a, b)));
  }, [products, category, onlyInStock, query, sort]);

  const sectionTitle = query ? `Resultados para "${query}"` : category?.label || 'Todos os produtos';

  return (
    <div>
      {!isFiltering && (
        <>
          <section
            className="mx-auto mb-6 max-w-content overflow-hidden rounded-2xl bg-surface bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
          >
            <div
              className={cn(
                'flex flex-col items-start bg-[linear-gradient(90deg,rgba(15,17,23,0.95)_0%,rgba(15,17,23,0.75)_45%,rgba(15,17,23,0.1)_100%)] px-14 py-20',
                bannerOverlay
              )}
            >
              <p className="mb-4 animate-fade-up text-xs font-semibold uppercase tracking-[0.1em] text-primary-lighter">
                Novidades da semana
              </p>
              <h1 className="mb-4 animate-fade-up text-[52px] font-bold leading-[1.08] tracking-[-1.5px] text-foreground [animation-delay:80ms] max-[760px]:text-[34px] max-[760px]:tracking-[-0.5px]">
                Monte seu <span className="text-primary-light">setup</span>.<br />Sem complicação.
              </h1>
              <p className="mb-7 max-w-[440px] animate-fade-up text-base leading-[1.6] text-soft [animation-delay:160ms]">
                Periféricos e acessórios selecionados para jogar, trabalhar e criar com mais conforto.
              </p>
              <Button as="a" size="lg" className="group animate-fade-up [animation-delay:240ms]" href="#produtos">
                Ver produtos <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </section>

          <section
            className="mx-auto mb-14 grid max-w-content grid-cols-4 rounded-xl border border-line bg-surface max-[1000px]:grid-cols-2 max-[760px]:grid-cols-1"
            aria-label="Vantagens"
          >
            {BENEFITS.map(({ icon: Icon, title, text }, index) => (
              <div className={cn('flex items-center gap-3.5 px-5 py-[18px] text-primary-light', benefitBorder(index))} key={title}>
                <Icon size={26} aria-hidden="true" />
                <div>
                  <strong className="block text-sm font-semibold text-foreground">{title}</strong>
                  <span className="text-xs text-muted">{text}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="mx-auto max-w-content">
            <SectionHeader className="mb-6" title="Compre por categoria" />
            <div className="mb-14 grid grid-cols-6 gap-4 max-[1000px]:grid-cols-3 max-[760px]:grid-cols-2">
              {CATEGORIES.map(({ value, slug, label, icon: Icon, img }) => (
                <Link
                  className="group relative aspect-square overflow-hidden rounded-xl border border-line no-underline transition-colors hover:border-primary"
                  key={value}
                  to={`/?categoria=${slug}`}
                >
                  <img
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                    src={img}
                    alt=""
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,17,23,0.9)_100%)]" />
                  <span className="absolute inset-x-3 bottom-3 z-[1] flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon size={18} aria-hidden="true" /> {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="mx-auto max-w-content scroll-mt-[130px]" id="produtos" ref={productsRef}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <SectionHeader title={sectionTitle} count={!loading && `${visibleProducts.length} produtos`} />

          <div className="flex items-center gap-4 max-[760px]:flex-wrap">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-soft">
              <input
                className="accent-primary"
                type="checkbox"
                checked={onlyInStock}
                onChange={(event) => updateParam('estoque', event.target.checked ? '1' : '')}
              />
              Somente em estoque
            </label>
            <Select
              size="toolbar"
              aria-label="Ordenar produtos"
              value={sort}
              onChange={(event) => updateParam('ordem', event.target.value === 'relevance' ? '' : event.target.value)}
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome (A-Z)</option>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
          <Chip active={!category} onClick={() => updateParam('categoria', '')}>
            Todos
          </Chip>
          {CATEGORIES.map((item) => (
            <Chip key={item.value} active={category?.value === item.value} onClick={() => updateParam('categoria', item.slug)}>
              {item.label}
            </Chip>
          ))}
        </div>

        {loading && <Feedback>Carregando produtos...</Feedback>}
        {error && <Feedback variant="error">{error}</Feedback>}

        {!loading && !error && visibleProducts.length === 0 && (
          <EmptyState
            icon={PackageX}
            action={<Button as={Link} variant="secondary" to="/">Limpar filtros</Button>}
          >
            Nenhum produto encontrado com esses filtros.
          </EmptyState>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAddToCart={addItem} />
          ))}
        </div>
      </section>

      {!isFiltering && (
        <section
          className="mx-auto mt-16 max-w-content overflow-hidden rounded-2xl bg-surface bg-cover bg-center"
          style={{ backgroundImage: `url(${PROMO_IMG})` }}
        >
          <div
            className={cn(
              'flex flex-col items-end bg-[linear-gradient(270deg,rgba(15,17,23,0.95)_0%,rgba(15,17,23,0.7)_50%,rgba(15,17,23,0.1)_100%)] p-14 text-right',
              bannerOverlay,
              'max-[760px]:items-start max-[760px]:text-left'
            )}
          >
            <h2 className="mb-2.5 text-[30px] font-bold text-foreground">Seu canto gamer merece upgrade</h2>
            <p className="mb-[22px] max-w-[380px] text-soft">Headsets, microfones e webcams para jogar e fazer stream com qualidade.</p>
            <Button as={Link} to="/?categoria=streaming">Conferir streaming</Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default StorefrontPage;
