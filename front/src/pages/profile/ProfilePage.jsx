import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/CartContext';
import { formatCurrency } from '../../utils/formatters';

const ProfilePage = () => {
  const { isAdmin, session } = useAuth();
  const { orders } = useCart();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return (
      <section className="content-section content-section--narrow">
        <div className="page-heading">
          <h1>Perfil admin</h1>
          <p>Conta administrativa com acesso ao estoque e vendas.</p>
        </div>

        <dl className="profile-list">
          <div>
            <dt>Usuario</dt>
            <dd>{session.username}</dd>
          </div>
          <div>
            <dt>Permissao</dt>
            <dd>{session.role}</dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="content-section">
      <div className="page-heading">
        <h1>Meu perfil</h1>
        <p>Dados cadastrados e historico de compras nesta loja.</p>
      </div>

      <dl className="profile-list">
        <div>
          <dt>Nome</dt>
          <dd>{session.visitor.name}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{session.visitor.email}</dd>
        </div>
        <div>
          <dt>Telefone</dt>
          <dd>{session.visitor.phone || 'Nao informado'}</dd>
        </div>
      </dl>

      <div className="page-heading page-heading--compact">
        <h2>Compras</h2>
      </div>

      {orders.length === 0 ? (
        <p>Voce ainda nao finalizou nenhuma compra.</p>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                  <td>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                  <td>{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
