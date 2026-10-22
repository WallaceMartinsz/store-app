import { formatCurrency, formatDateTime } from '../../utils/formatters';

const SummaryLine = ({ label, value }) => (
  <div className="flex justify-between gap-3 text-[13px] text-muted">
    <dt>{label}</dt>
    <dd className="text-foreground">{value}</dd>
  </div>
);

const OrderDetails = ({ order }) => (
  <div className="grid animate-swap-in grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 max-[760px]:grid-cols-1">
    <ul className="grid gap-2.5">
      {order.items.map((item) => (
        <li key={item.productId} className="flex items-center gap-3">
          <img className="h-11 w-11 rounded-md bg-background object-cover" src={item.productImg} alt="" />
          <span className="flex-1 text-sm text-soft">{item.quantity}x {item.productName}</span>
          <strong>{formatCurrency(item.subtotal)}</strong>
        </li>
      ))}
    </ul>
    <dl className="grid gap-1.5">
      <SummaryLine label="Frete" value={formatCurrency(order.shipping)} />
      <SummaryLine label="Total" value={formatCurrency(order.total)} />
      <SummaryLine label="Pedido em" value={formatDateTime(order.createdAt)} />
      {order.paidAt && <SummaryLine label="Pago em" value={formatDateTime(order.paidAt)} />}
      {order.shippedAt && <SummaryLine label="Enviado em" value={formatDateTime(order.shippedAt)} />}
      {order.canceledAt && <SummaryLine label="Cancelado em" value={formatDateTime(order.canceledAt)} />}
    </dl>
  </div>
);

export default OrderDetails;
