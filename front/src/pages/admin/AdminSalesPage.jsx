import { useEffect, useMemo, useState } from 'react';
import ordersApi, { getApiErrorMessage } from '../../api/ordersApi';
import OrderDetails from '../../features/orders/OrderDetails';
import { countItems, NEXT_ACTIONS, shortOrderId } from '../../features/orders/orderStatus';
import StatusBadge from '../../features/orders/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const REVENUE_STATUSES = ['PAGO', 'ENVIADO'];

const AdminSalesPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [visitorId, setVisitorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await ordersApi.list(visitorId || undefined);
        setOrders(response.data);

        // A lista de clientes do filtro sai da primeira carga (todos os pedidos)
        if (!visitorId) {
          const unique = new Map(response.data.map((order) => [order.visitorId, order.visitorName]));
          setCustomers([...unique].map(([id, name]) => ({ id, name })));
        }
      } catch (requestError) {
        setError('Nao foi possivel carregar os pedidos.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [visitorId]);

  const summary = useMemo(() => ({
    count: orders.length,
    revenue: orders
      .filter((order) => REVENUE_STATUSES.includes(order.status))
      .reduce((total, order) => total + Number(order.total), 0),
    pending: orders.filter((order) => order.status === 'PENDENTE').length
  }), [orders]);

  const handleStatusChange = async (order, status) => {
    if (status === 'CANCELADO' && !window.confirm(`Cancelar o pedido ${shortOrderId(order.id)}? O estoque sera devolvido.`)) {
      return;
    }

    try {
      setUpdatingId(order.id);
      setError('');
      const response = await ordersApi.updateStatus(order.id, status);
      setOrders((current) => current.map((item) => (item.id === order.id ? response.data : item)));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Nao foi possivel alterar o status do pedido.'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="content-section">
      <div className="page-heading page-heading--row">
        <div>
          <h1>Vendas</h1>
          <p>Pedidos feitos na loja, do mais recente para o mais antigo.</p>
        </div>
        <select
          className="select"
          aria-label="Filtrar por cliente"
          value={visitorId}
          onChange={(event) => setVisitorId(event.target.value)}
        >
          <option value="">Todos os clientes</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
      </div>

      <div className="admin-summary admin-summary--spaced">
        <div className="summary-card">
          <span>Pedidos</span>
          <strong>{summary.count}</strong>
        </div>
        <div className="summary-card">
          <span>Faturamento (pagos e enviados)</span>
          <strong>{formatCurrency(summary.revenue)}</strong>
        </div>
        <div className="summary-card">
          <span>Aguardando pagamento</span>
          <strong>{summary.pending}</strong>
        </div>
      </div>

      {loading && <p className="feedback">Carregando pedidos...</p>}
      {error && <p className="feedback feedback--error">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>Nenhum pedido encontrado.</p>}

      {orders.length > 0 && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isOpen = openOrderId === order.id;

                return [
                  <tr key={order.id}>
                    <td>
                      <button
                        className="link-button"
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                      >
                        {shortOrderId(order.id)}
                      </button>
                    </td>
                    <td>{order.visitorName}</td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>{countItems(order)}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>
                      <div className="table-actions">
                        {NEXT_ACTIONS[order.status].map((action) => (
                          <button
                            key={action.status}
                            type="button"
                            className={`button button--sm ${action.danger ? 'button--danger' : 'button--secondary'}`}
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order, action.status)}
                          >
                            {action.label}
                          </button>
                        ))}
                        {NEXT_ACTIONS[order.status].length === 0 && <span className="muted">-</span>}
                      </div>
                    </td>
                  </tr>,
                  isOpen && (
                    <tr key={`${order.id}-details`} className="order-details-row">
                      <td colSpan={7}>
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
    </section>
  );
};

export default AdminSalesPage;
