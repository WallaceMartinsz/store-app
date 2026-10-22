import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cardClasses } from '../../components/ui/card';
import { PageHeading } from '../../components/ui/page-heading';
import { cn } from '../../lib/utils';

const SUMMARY_LINKS = [
  { to: '/admin/products', label: 'Estoque', title: 'Gerenciar produtos' },
  { to: '/admin/sales', label: 'Vendas', title: 'Acompanhar pedidos' }
];

const AdminDashboardPage = () => (
  <section className="mx-auto max-w-content">
    <PageHeading
      title="Painel administrativo"
      description="Acompanhe o estoque, os produtos cadastrados e os pedidos da loja."
    />

    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      {SUMMARY_LINKS.map(({ to, label, title }) => (
        <Link
          key={to}
          className={cn(cardClasses, 'group flex flex-col gap-2 p-[18px] text-foreground no-underline transition-colors hover:border-primary')}
          to={to}
        >
          <span className="text-[13px] text-muted">{label}</span>
          <strong className="flex items-center justify-between">
            {title}
            <ArrowRight size={18} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary-light" />
          </strong>
        </Link>
      ))}
    </div>
  </section>
);

export default AdminDashboardPage;
