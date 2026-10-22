export const ORDER_STATUS = {
  PENDENTE: { label: 'Pendente', className: 'bg-yellow-500/15 text-warning' },
  PAGO: { label: 'Pago', className: 'bg-primary/[0.18] text-primary-lighter' },
  ENVIADO: { label: 'Enviado', className: 'bg-green-500/15 text-success' },
  CANCELADO: { label: 'Cancelado', className: 'bg-slate-400/15 text-muted' }
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
