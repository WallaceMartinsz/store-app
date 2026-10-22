import { useEffect, useMemo, useState } from 'react';
import ordersApi, { getApiErrorMessage } from '../../api/ordersApi';
import Button from '../../components/ui/button';
import { cardClasses } from '../../components/ui/card';
import { DataTable, Td, Th } from '../../components/ui/data-table';
import { Feedback } from '../../components/ui/feedback';
import { Select } from '../../components/ui/input';
import { PageHeading } from '../../components/ui/page-heading';
import { cn } from '../../lib/utils';
import OrderDetails from '../../features/orders/OrderDetails';
import { countItems, NEXT_ACTIONS, shortOrderId } from '../../features/orders/orderStatus';
import StatusBadge from '../../features/orders/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const REVENUE_STATUSES = ['PAGO', 'ENVIADO'];

const SummaryCard = ({ label, value }) => (
  <div className={cn(cardClasses, 'flex flex-col gap-2 p-[18px] text-foreground')}>
    <span className="text-[13px] text-muted">{label}</span>
    <strong className="text-[22px]">{value}</strong>
  </div>
);

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
    <section className="mx-auto max-w-content">
      <PageHeading
        title="Vendas"
        description="Pedidos feitos na loja, do mais recente para o mais antigo."
        actions={(
          <Select
            size="toolbar"
            aria-label="Filtrar por cliente"
            value={visitorId}
            onChange={(event) => setVisitorId(event.target.value)}
          >
            <option value="">Todos os clientes</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </Select>
        )}
      />

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <SummaryCard label="Pedidos" value={summary.count} />
        <SummaryCard label="Faturamento (pagos e enviados)" value={formatCurrency(summary.revenue)} />
        <SummaryCard label="Aguardando pagamento" value={summary.pending} />
      </div>

      {loading && <Feedback>Carregando pedidos...</Feedback>}
      {error && <Feedback variant="error">{error}</Feedback>}
      {!loading && !error && orders.length === 0 && <Feedback>Nenhum pedido encontrado.</Feedback>}

      {orders.length > 0 && (
        <DataTable>
          <thead>
            <tr>
              <Th>Pedido</Th>
              <Th>Cliente</Th>
              <Th>Data</Th>
              <Th>Itens</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isOpen = openOrderId === order.id;

              return [
                <tr key={order.id}>
                  <Td>
                    <Button
                      variant="link"
                      size="none"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    >
                      {shortOrderId(order.id)}
                    </Button>
                  </Td>
                  <Td>{order.visitorName}</Td>
                  <Td>{formatDateTime(order.createdAt)}</Td>
                  <Td>{countItems(order)}</Td>
                  <Td>{formatCurrency(order.total)}</Td>
                  <Td><StatusBadge status={order.status} /></Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      {NEXT_ACTIONS[order.status].map((action) => (
                        <Button
                          key={action.status}
                          type="button"
                          size="sm"
                          variant={action.danger ? 'danger' : 'secondary'}
                          disabled={updatingId === order.id}
                          onClick={() => handleStatusChange(order, action.status)}
                        >
                          {action.label}
                        </Button>
                      ))}
                      {NEXT_ACTIONS[order.status].length === 0 && <span className="text-subtle">-</span>}
                    </div>
                  </Td>
                </tr>,
                isOpen && (
                  <tr key={`${order.id}-details`}>
                    <Td className="bg-expanded" colSpan={7}>
                      <OrderDetails order={order} />
                    </Td>
                  </tr>
                )
              ];
            })}
          </tbody>
        </DataTable>
      )}
    </section>
  );
};

export default AdminSalesPage;
