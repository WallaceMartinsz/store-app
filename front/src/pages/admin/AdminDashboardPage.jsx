import { Link } from 'react-router-dom';

const AdminDashboardPage = () => (
  <section className="content-section">
    <div className="page-heading">
      <h1>Painel administrativo</h1>
      <p>Area para acompanhar estoque, produtos cadastrados e vendas quando o backend evoluir.</p>
    </div>

    <div className="admin-summary">
      <Link className="summary-card" to="/admin/products">
        <span>Estoque</span>
        <strong>Gerenciar produtos</strong>
      </Link>
      <Link className="summary-card" to="/admin/sales">
        <span>Vendas</span>
        <strong>Acompanhar pedidos</strong>
      </Link>
    </div>
  </section>
);

export default AdminDashboardPage;
