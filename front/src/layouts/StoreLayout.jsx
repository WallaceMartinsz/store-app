import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import { CATEGORIES } from '../features/products/categories';

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
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__main">
          <Link className="brand" to="/">
            Load<span>out</span>
          </Link>

          <form className="search-bar" role="search" onSubmit={handleSearch}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar mouse, teclado, headset..."
              aria-label="Buscar produtos"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          <nav className="topbar__actions" aria-label="Conta">
            {isAdmin && (
              <Link className="topbar__action" to="/admin">
                <LayoutDashboard size={20} />
                <span>Painel</span>
              </Link>
            )}
            <Link className="topbar__action" to={session ? '/profile' : '/login'}>
              <User size={20} />
              <span>{session ? `Olá, ${firstName}` : 'Entrar'}</span>
            </Link>
            <Link className="topbar__action topbar__cart" to="/cart" aria-label={`Carrinho com ${itemCount} itens`}>
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="topbar__badge">{itemCount}</span>}
            </Link>
            {session && (
              <button className="topbar__action link-button" type="button" onClick={logout} aria-label="Sair">
                <LogOut size={20} />
              </button>
            )}
          </nav>
        </div>

        <nav className="category-nav" aria-label="Categorias">
          <NavLink className={!activeCategory && location.pathname === '/' ? 'is-active' : ''} to="/" end>
            Todos
          </NavLink>
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              className={activeCategory === category.slug ? 'is-active' : ''}
              to={`/?categoria=${category.slug}`}
            >
              {category.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <Link className="brand" to="/">
              Load<span>out</span>
            </Link>
            <p>Periféricos e acessórios para montar o seu setup.</p>
          </div>
          <div>
            <h4>Categorias</h4>
            {CATEGORIES.slice(0, 4).map((category) => (
              <Link key={category.value} to={`/?categoria=${category.slug}`}>{category.label}</Link>
            ))}
          </div>
          <div>
            <h4>Minha conta</h4>
            <Link to={session ? '/profile' : '/login'}>{session ? 'Meus pedidos' : 'Entrar / Cadastrar'}</Link>
            <Link to="/cart">Carrinho</Link>
          </div>
        </div>
        <p className="footer__copy">Projeto de portfólio · Spring Boot + React</p>
      </footer>
    </div>
  );
};

export default StoreLayout;
