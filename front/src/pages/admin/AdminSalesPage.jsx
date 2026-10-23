import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import ordersApi, { getApiErrorMessage } from '../../api/ordersApi';
import Button from '../../components/ui/button';
import { cardClasses } from '../../components/ui/card';
import Chip from '../../components/ui/chip';
import { DataTable, Td, Th } from '../../components/ui/data-table';
import { Feedback } from '../../components/ui/feedback';
import { PageHeading } from '../../components/ui/page-heading';
import { cn } from '../../lib/utils';
import OrderDetails from '../../features/orders/OrderDetails';
import { countItems, formatPaymentMethod, NEXT_ACTIONS, ORDER_STATUS, shortOrderId } from '../../features/orders/orderStatus';
import StatusBadge from '../../features/orders/StatusBadge';
import { formatCurrency, formatDateTime, normalizeText } from '../../utils/formatters';

const REVENUE_STATUSES = ['PAGO', 'ENVIADO'];

// Busca por nome, e-mail ou numero do pedido (o id completo tambem serve)
const matchesSearch = (order, term) => !term || normalizeText(
  `${order.visitorName} ${order.visitorEmail} ${shortOrderId(order.id)} ${order.id}`
).includes(term);

const SummaryCard = ({ label, value }) => (
  <div className={cn(cardClasses, 'flex flex-col gap-2 p-[18px] text-foreground')}>
    <span className="text-[13px] text-muted">{label}</span>
    <strong className="text-[22px]">{value}</strong>
  </div>
);

const AdminSalesPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        // Carrega todos os pedidos uma vez; busca e status filtram no navegador
        const response = await ordersApi.list();
        setOrders(response.data);
      } catch (requestError) {
        setError('Nao foi possivel carregar os pedidos.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const term = normalizeText(search.trim());
  // Contagem dos chips respeita a busca, mas nao o proprio filtro de status
  const searchedOrders = useMemo(() => orders.filter((order) => matchesSearch(order, term)), [orders, term]);
  const filteredOrders = useMemo(
    () => searchedOrders.filter((order) => !status || order.status === status),
    [searchedOrders, status]
  );

  const statusCounts = useMemo(() => searchedOrders.reduce((counts, order) => ({
    ...counts,
    [order.status]: (counts[order.status] || 0) + 1
  }), {}), [searchedOrders]);

  const summary = useMemo(() => ({
    count: filteredOrders.length,
    revenue: filteredOrders
      .filter((order) => REVENUE_STATUSES.includes(order.status))
      .reduce((total, order) => total + Number(order.total), 0),
    pending: filteredOrders.filter((order) => order.status === 'PENDENTE').length
  }), [filteredOrders]);

  const clearFilters = () => {
    setSearch('');
    setStatus('');
  };

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
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div
            className="flex h-10 min-w-[260px] flex-1 items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 text-subtle transition-colors focus-within:border-primary max-[760px]:min-w-0 max-[760px]:basis-full"
            role="search"
          >
            <Search size={18} aria-hidden="true" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground outline-none [&::-webkit-search-cancel-button]:hidden"
              type="search"
              placeholder="Buscar por cliente, e-mail ou numero do pedido"
              aria-label="Buscar pedidos"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Escape' && setSearch('')}
            />
            {search && (
              <button
                className="cursor-pointer rounded-full p-0.5 text-subtle transition-colors hover:text-foreground"
                type="button"
                aria-label="Limpar busca"
                onClick={() => setSearch('')}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
            <Chip active={!status} onClick={() => setStatus('')}>Todos ({searchedOrders.length})</Chip>
            {Object.entries(ORDER_STATUS).map(([value, config]) => (
              <Chip key={value} active={status === value} onClick={() => setStatus(status === value ? '' : value)}>
                {config.label} ({statusCounts[value] || 0})
              </Chip>
            ))}
          </div>
        </div>
      )}

      {orders.length > 0 && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-4 py-10 text-center text-muted">
          <p>
            {term ? `Nenhum pedido para "${search.trim()}"` : 'Nenhum pedido'}
            {status && ` com status ${ORDER_STATUS[status].label.toLowerCase()}`}.
          </p>
          <Button variant="secondary" size="sm" type="button" onClick={clearFilters}>Limpar filtros</Button>
        </div>
      )}

      {filteredOrders.length > 0 && (
        <DataTable>
          <thead>
            <tr>
              <Th>Pedido</Th>
              <Th>Cliente</Th>
              <Th>Data</Th>
              <Th>Itens</Th>
              <Th>Total</Th>
              <Th>Pagamento</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
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
                  <Td>
                    <span className="block">{order.visitorName}</span>
                    <span className="block text-xs text-subtle">{order.visitorEmail}</span>
                  </Td>
                  <Td>{formatDateTime(order.createdAt)}</Td>
                  <Td>{countItems(order)}</Td>
                  <Td>{formatCurrency(order.total)}</Td>
                  <Td>{formatPaymentMethod(order)}</Td>
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
                    <Td className="bg-expanded" colSpan={8}>
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
