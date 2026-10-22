import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ordersApi, { isUnauthorized } from '../../api/ordersApi';
import { useAuth } from '../../auth/AuthContext';
import Button from '../../components/ui/button';
import { DataTable, Td, Th } from '../../components/ui/data-table';
import { Feedback } from '../../components/ui/feedback';
import { PageHeading } from '../../components/ui/page-heading';
import { cn } from '../../lib/utils';
import { countItems, shortOrderId } from '../../features/orders/orderStatus';
import OrderDetails from '../../features/orders/OrderDetails';
import StatusBadge from '../../features/orders/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const ProfileList = ({ items }) => (
  <dl className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
    {items.map(({ label, value }, index) => (
      <div
        key={label}
        className="animate-fade-up rounded-lg border border-line bg-surface p-4"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <dt className="mb-1.5 text-[13px] font-medium text-muted">{label}</dt>
        <dd className="font-semibold text-foreground">{value}</dd>
      </div>
    ))}
  </dl>
);

const OrderSuccess = ({ orderId }) => (
  <div
    className="mb-4 flex animate-success-in items-center gap-4 rounded-xl border border-success/40 bg-success/[0.08] px-5 py-4"
    role="status"
  >
    <svg
      className="h-11 w-11 shrink-0 fill-none stroke-success [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:3]"
      viewBox="0 0 52 52"
      aria-hidden="true"
    >
      <circle className="animate-draw-circle [stroke-dasharray:151] [stroke-dashoffset:151]" cx="26" cy="26" r="24" />
      <path className="animate-draw-check [stroke-dasharray:36] [stroke-dashoffset:36]" d="M15 27l7 7 15-15" />
    </svg>
    <div>
      <strong className="block text-base text-success">Pedido realizado!</strong>
      <span className="text-sm text-soft">
        O pedido {shortOrderId(orderId)} foi confirmado. Acompanhe o status abaixo.
      </span>
    </div>
  </div>
);

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
      <h2 className="mb-3.5 text-lg font-semibold text-foreground">Meus pedidos</h2>

      {createdOrderId && <OrderSuccess orderId={createdOrderId} />}
      {loading && <Feedback>Carregando pedidos...</Feedback>}
      {error && <Feedback variant="error">{error}</Feedback>}

      {!loading && !error && orders.length === 0 && (
        <p className="my-4">Voce ainda nao finalizou nenhuma compra.</p>
      )}

      {orders.length > 0 && (
        <DataTable>
          <thead>
            <tr>
              <Th>Pedido</Th>
              <Th>Data</Th>
              <Th>Itens</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th aria-label="Detalhes" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isOpen = openOrderId === order.id;
              // Destaca por alguns segundos a linha do pedido recem-criado
              const cellClass = cn(order.id === createdOrderId && 'animate-row-highlight');

              return [
                <tr key={order.id}>
                  <Td className={cellClass}>{shortOrderId(order.id)}</Td>
                  <Td className={cellClass}>{formatDateTime(order.createdAt)}</Td>
                  <Td className={cellClass}>{countItems(order)}</Td>
                  <Td className={cellClass}>{formatCurrency(order.total)}</Td>
                  <Td className={cellClass}><StatusBadge status={order.status} /></Td>
                  <Td className={cellClass}>
                    <Button
                      variant="link"
                      size="none"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                    >
                      {isOpen ? 'Ocultar' : 'Detalhes'}
                    </Button>
                  </Td>
                </tr>,
                isOpen && (
                  <tr key={`${order.id}-details`}>
                    <Td className="bg-expanded" colSpan={6}>
                      <OrderDetails order={order} />
                    </Td>
                  </tr>
                )
              ];
            })}
          </tbody>
        </DataTable>
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
      <section className="mx-auto max-w-[640px]">
        <PageHeading title="Perfil admin" description="Conta administrativa com acesso ao estoque e vendas." />

        <ProfileList
          items={[
            { label: 'Usuario', value: session.username },
            { label: 'Permissao', value: session.role }
          ]}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-content">
      <PageHeading title="Meu perfil" description="Dados cadastrados e historico de compras nesta loja." />

      <ProfileList
        items={[
          { label: 'Nome', value: session.visitor.name },
          { label: 'E-mail', value: session.visitor.email },
          { label: 'Telefone', value: session.visitor.phone || 'Nao informado' }
        ]}
      />

      <VisitorOrders />
    </section>
  );
};

export default ProfilePage;
