import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const AdminLayout = () => {
  const { session, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" to="/admin">
          Load<span>out</span> Admin
        </Link>
        <span className="session-label">{session?.username}</span>
        <nav className="admin-sidebar__nav">
          <Link to="/admin">Resumo</Link>
          <Link to="/admin/products">Estoque</Link>
          <Link to="/admin/sales">Vendas</Link>
          <Link to="/">Ver loja</Link>
          <button className="link-button" type="button" onClick={logout}>Sair</button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
