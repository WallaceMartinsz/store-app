import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Brand from '../components/ui/brand';
import Button from '../components/ui/button';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { to: '/admin', label: 'Resumo', end: true },
  { to: '/admin/products', label: 'Estoque' },
  { to: '/admin/sales', label: 'Vendas' },
  { to: '/', label: 'Ver loja', end: true }
];

const AdminLayout = () => {
  const { session, logout } = useAuth();

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] bg-background max-[760px]:grid-cols-1">
      <aside className="flex flex-col gap-7 border-r border-line bg-background p-6 max-[760px]:border-b max-[760px]:border-r-0">
        <Brand to="/admin">{' '}Admin</Brand>
        <span className="text-sm text-muted">{session?.username}</span>
        <nav className="flex flex-col items-start gap-5 max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                'text-sm no-underline transition-colors hover:text-foreground',
                isActive && to !== '/' ? 'text-foreground' : 'text-muted'
              )}
            >
              {label}
            </NavLink>
          ))}
          <Button variant="link" size="none" type="button" onClick={logout}>Sair</Button>
        </nav>
      </aside>
      <main className="p-8 max-[760px]:p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
