import { formatCurrency, formatDateTime } from '../../utils/formatters';

const OrderDetails = ({ order }) => (
  <div className="order-details">
    <ul className="order-details__items">
      {order.items.map((item) => (
        <li key={item.productId}>
          <img src={item.productImg} alt="" />
          <span>{item.quantity}x {item.productName}</span>
          <strong>{formatCurrency(item.subtotal)}</strong>
        </li>
      ))}
    </ul>
    <dl className="order-details__summary">
      <div><dt>Frete</dt><dd>{formatCurrency(order.shipping)}</dd></div>
      <div><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div>
      <div><dt>Pedido em</dt><dd>{formatDateTime(order.createdAt)}</dd></div>
      {order.paidAt && <div><dt>Pago em</dt><dd>{formatDateTime(order.paidAt)}</dd></div>}
      {order.shippedAt && <div><dt>Enviado em</dt><dd>{formatDateTime(order.shippedAt)}</dd></div>}
      {order.canceledAt && <div><dt>Cancelado em</dt><dd>{formatDateTime(order.canceledAt)}</dd></div>}
    </dl>
  </div>
);

export default OrderDetails;
