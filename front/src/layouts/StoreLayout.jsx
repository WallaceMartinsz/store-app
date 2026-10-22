import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import CartToast from '../cart/CartToast';
import Brand from '../components/ui/brand';
import { cn } from '../lib/utils';
import { CATEGORIES } from '../features/products/categories';

const actionClasses = 'relative inline-flex items-center gap-2 whitespace-nowrap text-sm text-soft no-underline transition-colors hover:text-white';
const footerLinkClasses = 'text-[13px] text-muted no-underline transition-colors hover:text-foreground';

const CategoryLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={cn(
      'whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium no-underline transition-colors hover:bg-surface hover:text-foreground',
      active ? 'bg-surface text-foreground' : 'text-muted'
    )}
  >
    {children}
  </Link>
);

const StoreLayout = () => {
  const { isAdmin, session, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const activeCategory = location.pathname === '/' ? searchParams.get('categoria') : null;
  const firstName = session?.visitor?.name?.split(' ')[0] || session?.username;

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = search.trim();
    navigate(term ? `/?q=${encodeURIComponent(term)}` : '/');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-[100] border-b border-line bg-background/90 backdrop-blur-md">
        <div className="mx-auto box-content flex h-16 max-w-content items-center gap-6 px-8 max-[760px]:h-auto max-[760px]:flex-wrap max-[760px]:gap-3 max-[760px]:px-4 max-[760px]:py-3">
          <Brand />

          <form
            className="mx-auto flex h-10 max-w-[520px] flex-1 items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 text-subtle transition-colors focus-within:border-primary max-[760px]:order-3 max-[760px]:max-w-none max-[760px]:basis-full"
            role="search"
            onSubmit={handleSearch}
          >
            <Search size={18} aria-hidden="true" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none"
              type="search"
              placeholder="Buscar mouse, teclado, headset..."
              aria-label="Buscar produtos"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          <nav className="flex items-center gap-[18px] max-[760px]:ml-auto" aria-label="Conta">
            {isAdmin && (
              <Link className={actionClasses} to="/admin">
                <LayoutDashboard size={20} />
                <span className="max-[760px]:hidden">Painel</span>
              </Link>
            )}
            <Link className={actionClasses} to={session ? '/profile' : '/login'}>
              <User size={20} />
              <span className="max-[760px]:hidden">{session ? `Olá, ${firstName}` : 'Entrar'}</span>
            </Link>
            <Link className={actionClasses} to="/cart" aria-label={`Carrinho com ${itemCount} itens`}>
              {/* key muda com a quantidade e reinicia a animacao de "pulo" do icone e do contador */}
              <ShoppingCart key={`icon-${itemCount}`} className={cn(itemCount > 0 && 'animate-cart-bump')} size={20} />
              {itemCount > 0 && (
                <span
                  key={`badge-${itemCount}`}
                  className="absolute -right-2.5 -top-2 h-[18px] min-w-[18px] animate-badge-pop rounded-full bg-primary px-[5px] text-center text-[11px] font-bold leading-[18px] text-white"
                >
                  {itemCount}
                </span>
              )}
            </Link>
            {session && (
              <button
                className="inline-flex cursor-pointer items-center text-muted transition-colors hover:text-foreground"
                type="button"
                onClick={logout}
                aria-label="Sair"
              >
                <LogOut size={20} />
              </button>
            )}
          </nav>
        </div>

        <nav
          className="mx-auto box-content flex max-w-content gap-1 overflow-x-auto px-8 pb-2.5 scrollbar-none max-[760px]:px-4"
          aria-label="Categorias"
        >
          <CategoryLink to="/" active={!activeCategory && location.pathname === '/'}>
            Todos
          </CategoryLink>
          {CATEGORIES.map((category) => (
            <CategoryLink key={category.value} to={`/?categoria=${category.slug}`} active={activeCategory === category.slug}>
              {category.label}
            </CategoryLink>
          ))}
        </nav>
      </header>

      <main className="p-8 max-[760px]:p-4">
        <Outlet />
      </main>

      <CartToast />

      <footer className="mt-[72px] border-t border-line bg-footer">
        <div className="mx-auto box-content grid max-w-content grid-cols-[2fr_1fr_1fr] gap-8 px-8 py-10 max-[760px]:grid-cols-1 max-[760px]:px-4 max-[760px]:py-8">
          <div className="flex flex-col gap-2">
            <Brand />
            <p className="text-[13px] text-muted">Periféricos e acessórios para montar o seu setup.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="mb-1 text-sm font-bold text-foreground">Categorias</h4>
            {CATEGORIES.slice(0, 4).map((category) => (
              <Link key={category.value} className={footerLinkClasses} to={`/?categoria=${category.slug}`}>
                {category.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="mb-1 text-sm font-bold text-foreground">Minha conta</h4>
            <Link className={footerLinkClasses} to={session ? '/profile' : '/login'}>
              {session ? 'Meus pedidos' : 'Entrar / Cadastrar'}
            </Link>
            <Link className={footerLinkClasses} to="/cart">Carrinho</Link>
          </div>
        </div>
        <p className="border-t border-line-soft px-8 py-4 text-center text-[13px] text-muted">
          Projeto de portfólio · Spring Boot + React
        </p>
      </footer>
    </div>
  );
};

export default StoreLayout;
