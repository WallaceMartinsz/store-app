import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';

const StoreLayout = () => {
  const { isAdmin, session, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          Load<span>out</span>
        </Link>
        <nav className="topbar__nav">
          <Link to="/">Loja</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
          <Link to={session ? '/profile' : '/login'}>{session ? 'Minha conta' : 'Entrar'}</Link>
          <Link to="/cart">Carrinho ({itemCount})</Link>
          {session && <button className="link-button" type="button" onClick={logout}>Sair</button>}
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
};

export default StoreLayout;
