export const formatCurrency = (value) => {
  const numberValue = Number(value || 0);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numberValue);
};

// Remove acentos e caixa para comparar textos em buscas ("João" acha "joao")
export const normalizeText = (text = '') => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const formatDateTime = (value) => (
  value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'
);
