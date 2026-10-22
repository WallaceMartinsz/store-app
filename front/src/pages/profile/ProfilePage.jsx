import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ordersApi, { isUnauthorized } from '../../api/ordersApi';
import { useAuth } from '../../auth/AuthContext';
import { countItems, shortOrderId } from '../../features/orders/orderStatus';
import OrderDetails from '../../features/orders/OrderDetails';
import StatusBadge from '../../features/orders/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const VisitorOrders = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const createdOrderId = location.state?.createdOrderId;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openOrderId, setOpenOrderId] = useState(createdOrderId || null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await ordersApi.listMine();
        setOrders(response.data);
      } catch (requestError) {
        if (isUnauthorized(requestError)) {
          logout();
          navigate('/login', { state: { mode: 'visitor', from: '/profile' } });
          return;
        }

        setError('Nao foi possivel carregar seus pedidos.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="page-heading page-heading--compact">
        <h2>Meus pedidos</h2>
      </div>

      {createdOrderId && (
        <div className="order-success" role="status">
          <svg className="order-success__check" viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r="24" />
            <path d="M15 27l7 7 15-15" />
          </svg>
          <div>
            <strong>Pedido realizado!</strong>
            <span>O pedido {shortOrderId(createdOrderId)} foi confirmado. Acompanhe o status abaixo.</span>
          </div>
        </div>
      )}
      {loading && <p className="feedback">Carregando pedidos...</p>}
      {error && <p className="feedback feedback--error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>Voce ainda nao finalizou nenhuma compra.</p>
      )}

      {orders.length > 0 && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th aria-label="Detalhes" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isOpen = openOrderId === order.id;

                return [
                  <tr key={order.id} className={order.id === createdOrderId ? 'order-row--new' : ''}>
                    <td>{shortOrderId(order.id)}</td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>{countItems(order)}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>
                      <button
                        className="link-button"
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                      >
                        {isOpen ? 'Ocultar' : 'Detalhes'}
                      </button>
                    </td>
                  </tr>,
                  isOpen && (
                    <tr key={`${order.id}-details`} className="order-details-row">
                      <td colSpan={6}>
                        <OrderDetails order={order} />
                      </td>
                    </tr>
                  )
                ];
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const ProfilePage = () => {
  const { isAdmin, session } = useAuth();

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

      <VisitorOrders />
    </section>
  );
};

export default ProfilePage;
