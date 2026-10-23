import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ordersApi, { getApiErrorMessage, isUnauthorized } from '../../api/ordersApi';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/CartContext';
import Button from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Feedback, Spinner } from '../../components/ui/feedback';
import { Field, Input, Select } from '../../components/ui/input';
import { PageHeading } from '../../components/ui/page-heading';
import { cn } from '../../lib/utils';
import FakeQrCode from '../../features/checkout/FakeQrCode';
import {
  MAX_INSTALLMENTS,
  PAYMENT_OPTIONS,
  buildBoletoLine,
  buildPixCode,
  formatCardNumber,
  formatExpiry,
  getCardBrand,
  onlyDigits,
  validateCard
} from '../../features/checkout/payment';
import { shortOrderId } from '../../features/orders/orderStatus';
import { formatCurrency } from '../../utils/formatters';

const INITIAL_CARD = { number: '', name: '', expiry: '', cvv: '', installments: '1' };

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" type="button" onClick={copy}>
      {copied ? 'Copiado!' : 'Copiar'}
    </Button>
  );
};

const CodeBox = ({ code, copyValue = code }) => (
  <div className="flex items-center gap-3 rounded-lg border border-line bg-background p-3">
    <code className="min-w-0 flex-1 text-[13px] text-soft [overflow-wrap:anywhere]">{code}</code>
    <CopyButton value={copyValue} />
  </div>
);

const PanelTitle = ({ title, description }) => (
  <>
    <h2 className="mb-1.5 text-lg font-semibold text-foreground">{title}</h2>
    <p className="mb-4 text-sm text-muted">{description}</p>
  </>
);

const SummaryLine = ({ label, value, total }) => (
  <div className={cn('flex justify-between', total ? 'border-t border-line pt-2 text-lg font-bold text-foreground' : 'text-muted')}>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isVisitor, logout } = useAuth();
  const { checkout, items, shipping, subtotal, total } = useCart();
  const [method, setMethod] = useState('PIX');
  const [card, setCard] = useState(INITIAL_CARD);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Pedido ja criado aguardando a confirmacao do pagamento (Pix, boleto ou cartao recusado)
  const [order, setOrder] = useState(null);

  if (!isVisitor) {
    return <Navigate to="/login" replace state={{ mode: 'visitor', from: '/checkout' }} />;
  }

  // O carrinho e limpo assim que o pedido e criado, por isso o submitting segura o redirecionamento
  if (!order && !submitting && items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleRequestError = (requestError, fallback) => {
    if (isUnauthorized(requestError)) {
      logout();
      navigate('/login', { state: { mode: 'visitor', from: order ? '/profile' : '/cart' } });
      return;
    }

    setError(getApiErrorMessage(requestError, fallback));
  };

  const finish = (finishedOrder, paid) => {
    navigate('/profile', { state: { createdOrderId: finishedOrder.id, paid } });
  };

  const confirmPayment = async (pendingOrder) => {
    try {
      setSubmitting(true);
      setError('');
      const response = await ordersApi.pay(pendingOrder.id);
      finish(response.data, true);
    } catch (requestError) {
      setOrder(pendingOrder);
      handleRequestError(requestError, 'Nao foi possivel confirmar o pagamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    const formatters = {
      number: formatCardNumber,
      expiry: formatExpiry,
      cvv: (cvv) => onlyDigits(cvv).slice(0, 4)
    };

    setCard((currentCard) => ({ ...currentCard, [name]: formatters[name] ? formatters[name](value) : value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (method === 'CARTAO') {
      const errors = validateCard(card);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    }

    let createdOrder;
    try {
      setSubmitting(true);
      setError('');
      createdOrder = await checkout(method, method === 'CARTAO' ? Number(card.installments) : undefined);
    } catch (requestError) {
      setSubmitting(false);
      handleRequestError(requestError, 'Nao foi possivel criar o pedido. Tente novamente.');
      return;
    }

    if (method === 'CARTAO') {
      // Cartao aprova direto; Pix e boleto mostram o codigo e esperam a confirmacao
      await confirmPayment(createdOrder);
      return;
    }

    setOrder(createdOrder);
    setSubmitting(false);
  };

  const summaryItems = order
    ? order.items.map((item) => ({ id: item.productId, name: item.productName, quantity: item.quantity, subtotal: item.subtotal }))
    : items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      subtotal: Number(item.product.price || 0) * item.quantity
    }));
  const summary = order
    ? { subtotal: Number(order.total) - Number(order.shipping), shipping: order.shipping, total: order.total }
    : { subtotal, shipping, total };
  const installments = Number(card.installments);
  const brand = getCardBrand(card.number);

  const pendingActions = (confirmLabel) => (
    <div className="mt-5 flex flex-wrap gap-3">
      <Button size="lg" type="button" disabled={submitting} onClick={() => confirmPayment(order)}>
        {submitting && <Spinner />}
        {submitting ? 'Confirmando...' : confirmLabel}
      </Button>
      <Button variant="secondary" size="lg" type="button" onClick={() => finish(order, false)}>
        {order.paymentMethod === 'PIX' ? 'Pagar depois' : 'Ver meus pedidos'}
      </Button>
    </div>
  );

  const renderPendingOrder = () => {
    if (order.paymentMethod === 'PIX') {
      const pixCode = buildPixCode(order);

      return (
        <>
          <PanelTitle title="Pague com Pix" description="Escaneie o QR code ou copie o codigo no app do seu banco." />
          <div className="grid grid-cols-[200px_minmax(0,1fr)] items-center gap-5 max-[760px]:grid-cols-1">
            <FakeQrCode value={pixCode} />
            <CodeBox code={pixCode} />
          </div>
          {pendingActions('Ja paguei (simular)')}
        </>
      );
    }

    if (order.paymentMethod === 'BOLETO') {
      const boletoLine = buildBoletoLine(order);

      return (
        <>
          <PanelTitle title="Boleto gerado" description="O pedido fica pendente ate a compensacao, em ate 3 dias uteis." />
          <CodeBox code={boletoLine} copyValue={onlyDigits(boletoLine)} />
          {pendingActions('Simular compensacao')}
        </>
      );
    }

    return (
      <>
        <PanelTitle title="Pagamento nao confirmado" description="O pedido foi criado e esta aguardando pagamento." />
        {pendingActions('Tentar novamente')}
      </>
    );
  };

  const submitLabel = () => {
    if (method === 'PIX') return 'Gerar Pix';
    if (method === 'BOLETO') return 'Gerar boleto';
    return installments > 1
      ? `Pagar ${installments}x de ${formatCurrency(total / installments)}`
      : `Pagar ${formatCurrency(total)}`;
  };

  return (
    <section className="mx-auto max-w-content">
      <PageHeading
        title="Pagamento"
        description={order ? `Pedido ${shortOrderId(order.id)} criado.` : 'Escolha como prefere pagar.'}
        actions={!order && (
          <Button as={Link} to="/cart" variant="secondary">Voltar ao carrinho</Button>
        )}
      />

      <p className="mb-4 rounded-lg border border-dashed border-line px-3.5 py-2.5 text-[13px] text-muted">
        Ambiente de demonstracao: nenhuma cobranca real e feita e os dados do cartao nao saem do navegador.
      </p>

      {error && <Feedback variant="error">{error}</Feedback>}

      <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6 max-[760px]:grid-cols-1">
        <Card className="animate-fade-up p-5">
          {order ? renderPendingOrder() : (
            <form className="grid gap-3.5" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-3 gap-2.5 max-[760px]:grid-cols-1" role="radiogroup" aria-label="Forma de pagamento">
                {PAYMENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={cn(
                      'grid cursor-pointer gap-1 rounded-lg border bg-background p-3.5 text-left transition-colors',
                      method === option.id ? 'border-primary bg-primary/[0.12]' : 'border-line hover:border-subtle'
                    )}
                    type="button"
                    role="radio"
                    aria-checked={method === option.id}
                    onClick={() => setMethod(option.id)}
                  >
                    <strong className="text-foreground">{option.title}</strong>
                    <span className="text-[13px] text-muted">{option.description}</span>
                  </button>
                ))}
              </div>

              {method === 'CARTAO' && (
                <div key="card" className="grid animate-swap-in gap-3.5">
                  <Field
                    label={brand ? `Numero do cartao · ${brand}` : 'Numero do cartao'}
                    error={fieldErrors.number}
                    hint="Para testar, use 4111 1111 1111 1111."
                  >
                    <Input
                      name="number"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="0000 0000 0000 0000"
                      value={card.number}
                      onChange={handleCardChange}
                    />
                  </Field>
                  <Field label="Nome impresso no cartao" error={fieldErrors.name}>
                    <Input name="name" autoComplete="cc-name" value={card.name} onChange={handleCardChange} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Validade" error={fieldErrors.expiry}>
                      <Input
                        name="expiry"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        value={card.expiry}
                        onChange={handleCardChange}
                      />
                    </Field>
                    <Field label="CVV" error={fieldErrors.cvv}>
                      <Input
                        name="cvv"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={card.cvv}
                        onChange={handleCardChange}
                      />
                    </Field>
                  </div>
                  <Field label="Parcelas">
                    <Select name="installments" value={card.installments} onChange={handleCardChange}>
                      {Array.from({ length: MAX_INSTALLMENTS }, (_, index) => index + 1).map((count) => (
                        <option key={count} value={count}>
                          {count}x de {formatCurrency(total / count)} sem juros
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
              )}

              {method === 'PIX' && (
                <p key="pix" className="animate-swap-in text-sm text-muted">
                  O QR code e o codigo copia e cola aparecem depois de confirmar o pedido.
                </p>
              )}

              {method === 'BOLETO' && (
                <p key="boleto" className="animate-swap-in text-sm text-muted">
                  O boleto vence em 3 dias e o pedido fica pendente ate a compensacao.
                </p>
              )}

              <Button size="lg" full type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                {submitting ? 'Processando...' : submitLabel()}
              </Button>
            </form>
          )}
        </Card>

        <Card as="aside" className="animate-fade-up p-5 [animation-delay:60ms]">
          <h2 className="text-lg font-semibold text-foreground">Resumo</h2>
          <ul className="my-3 grid gap-2.5">
            {summaryItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm text-soft">
                <span>{item.quantity}x {item.name}</span>
                <strong className="text-foreground">{formatCurrency(item.subtotal)}</strong>
              </li>
            ))}
          </ul>
          <dl className="grid gap-1.5">
            <SummaryLine label="Subtotal" value={formatCurrency(summary.subtotal)} />
            <SummaryLine label="Frete" value={formatCurrency(summary.shipping)} />
            <SummaryLine label="Total" value={formatCurrency(summary.total)} total />
          </dl>
        </Card>
      </div>
    </section>
  );
};

export default CheckoutPage;
