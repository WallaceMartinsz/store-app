export const ORDER_STATUS = {
  PENDENTE: { label: 'Pendente', className: 'status-badge--pending' },
  PAGO: { label: 'Pago', className: 'status-badge--paid' },
  ENVIADO: { label: 'Enviado', className: 'status-badge--shipped' },
  CANCELADO: { label: 'Cancelado', className: 'status-badge--canceled' }
};

// Mesmas transicoes aceitas pelo backend (OrderService.ALLOWED_TRANSITIONS)
export const NEXT_ACTIONS = {
  PENDENTE: [
    { status: 'PAGO', label: 'Marcar como pago' },
    { status: 'CANCELADO', label: 'Cancelar', danger: true }
  ],
  PAGO: [
    { status: 'ENVIADO', label: 'Marcar como enviado' },
    { status: 'CANCELADO', label: 'Cancelar', danger: true }
  ],
  ENVIADO: [],
  CANCELADO: []
};

export const shortOrderId = (id) => `#${String(id).slice(0, 8).toUpperCase()}`;

export const countItems = (order) => order.items.reduce((total, item) => total + item.quantity, 0);
