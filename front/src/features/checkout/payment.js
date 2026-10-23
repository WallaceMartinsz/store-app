// Pagamento de demonstracao: as validacoes rodam so no navegador e os dados do cartao nunca vao para a API
// Mesmo limite do backend (OrderRequest.installments) e da vitrine
export const MAX_INSTALLMENTS = 10;

export const PAYMENT_OPTIONS = [
  { id: 'PIX', title: 'Pix', description: 'Aprovacao na hora' },
  { id: 'CARTAO', title: 'Cartao de credito', description: `Ate ${MAX_INSTALLMENTS}x sem juros` },
  { id: 'BOLETO', title: 'Boleto', description: 'Compensa em ate 3 dias uteis' }
];

export const onlyDigits = (value) => value.replace(/\D/g, '');

export const formatCardNumber = (value) => onlyDigits(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

export const formatExpiry = (value) => {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const getCardBrand = (number) => {
  const digits = onlyDigits(number);

  // Elo primeiro: varios prefixos dela comecam com 4 ou 5
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(digits)) return 'Elo';
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  return null;
};

// Algoritmo de Luhn, o mesmo digito verificador usado pelas bandeiras
const passesLuhn = (digits) => {
  let sum = 0;

  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index]);

    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  return sum % 10 === 0;
};

const isExpiryValid = (expiry) => {
  const [month, year] = expiry.split('/').map(Number);

  if (!month || month > 12 || year === undefined || Number.isNaN(year)) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  return year > currentYear || (year === currentYear && month >= now.getMonth() + 1);
};

export const validateCard = (card) => {
  const errors = {};
  const digits = onlyDigits(card.number);
  const cvvLength = getCardBrand(digits) === 'Amex' ? 4 : 3;

  if (digits.length < 13 || !passesLuhn(digits)) {
    errors.number = 'Numero de cartao invalido.';
  }

  if (card.name.trim().split(/\s+/).length < 2) {
    errors.name = 'Informe o nome como esta no cartao.';
  }

  if (!isExpiryValid(card.expiry)) {
    errors.expiry = 'Validade invalida ou vencida.';
  }

  if (onlyDigits(card.cvv).length !== cvvLength) {
    errors.cvv = `O CVV deve ter ${cvvLength} digitos.`;
  }

  return errors;
};

// Codigos ficticios derivados do id do pedido, so para a tela parecer real
const orderDigits = (orderId, length) => {
  const digits = String(orderId).split('').map((char) => char.charCodeAt(0) % 10).join('');
  return digits.repeat(Math.ceil(length / digits.length)).slice(0, length);
};

export const buildPixCode = (order) => (
  `00020126580014BR.GOV.BCB.PIX0136${order.id}5204000053039865406${Number(order.total).toFixed(2)}5802BR5907LOADOUT6009SAO PAULO6304${orderDigits(order.id, 4)}`
);

export const buildBoletoLine = (order) => {
  const digits = orderDigits(order.id, 47);
  const amount = String(Math.round(Number(order.total) * 100)).padStart(10, '0');
  const line = `${digits.slice(0, 37)}${amount}`;

  return [
    `${line.slice(0, 5)}.${line.slice(5, 10)}`,
    `${line.slice(10, 15)}.${line.slice(15, 21)}`,
    `${line.slice(21, 26)}.${line.slice(26, 32)}`,
    line.slice(32, 33),
    line.slice(33)
  ].join(' ');
};
