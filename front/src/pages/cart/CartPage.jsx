import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage, isUnauthorized } from '../../api/ordersApi';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/CartContext';
import Button from '../../components/ui/button';
import { DataTable, Td, Th } from '../../components/ui/data-table';
import { EmptyState, Feedback, Spinner } from '../../components/ui/feedback';
import { Input } from '../../components/ui/input';
import { PageHeading } from '../../components/ui/page-heading';
import { formatCurrency } from '../../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const { isVisitor, session, logout } = useAuth();
  const { checkout, items, removeItem, shipping, subtotal, total, updateQuantity } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const goToLogin = () => navigate('/login', { state: { mode: 'visitor', from: '/cart' } });

  const handleCheckout = async () => {
    if (!isVisitor) {
      goToLogin();
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const order = await checkout();
      navigate('/profile', { state: { createdOrderId: order.id } });
    } catch (requestError) {
      if (isUnauthorized(requestError)) {
        // Token expirado ou invalido: precisa entrar de novo
        logout();
        goToLogin();
        return;
      }

      setError(getApiErrorMessage(requestError, 'Nao foi possivel finalizar a compra. Tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-content">
      <PageHeading
        title="Carrinho"
        description={session?.visitor ? `Comprando como ${session.visitor.name}.` : 'Entre como visitante para finalizar a compra.'}
      />

      {error && <Feedback variant="error">{error}</Feedback>}

      {items.length === 0 ? (
        <EmptyState action={<Button as={Link} to="/">Continuar comprando</Button>}>
          Seu carrinho está vazio.
        </EmptyState>
      ) : (
        <>
          <DataTable>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Preco</Th>
                <Th>Quantidade</Th>
                <Th>Subtotal</Th>
                <Th>Acoes</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product.id}>
                  <Td>{item.product.name}</Td>
                  <Td>{formatCurrency(item.product.price)}</Td>
                  <Td>
                    <Input
                      size="sm"
                      min="1"
                      max={item.product.quantity}
                      type="number"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                    />
                  </Td>
                  <Td>{formatCurrency(Number(item.product.price || 0) * item.quantity)}</Td>
                  <Td>
                    <Button variant="link" size="none" type="button" onClick={() => removeItem(item.product.id)}>
                      Remover
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <div className="mt-[18px] flex flex-col items-end gap-4 text-foreground">
            <dl className="grid w-[min(100%,300px)] gap-1.5">
              <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
              <div className="flex justify-between text-muted"><dt>Frete</dt><dd>{formatCurrency(shipping)}</dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-lg font-bold text-foreground">
                <dt>Total</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>
            <Button type="button" onClick={handleCheckout} disabled={submitting}>
              {submitting && <Spinner />}
              {submitting ? 'Finalizando...' : 'Finalizar compra'}
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default CartPage;
