import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage, isUnauthorized } from '../../api/ordersApi';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/CartContext';
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
        // Sessao salva antes do token existir: precisa entrar de novo
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
    <section className="content-section">
      <div className="page-heading page-heading--row">
        <div>
          <h1>Carrinho</h1>
          <p>{session?.visitor ? `Comprando como ${session.visitor.name}.` : 'Entre como visitante para finalizar a compra.'}</p>
        </div>
      </div>

      {error && <p className="feedback feedback--error">{error}</p>}

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Seu carrinho está vazio.</p>
          <Link className="button" to="/">Continuar comprando</Link>
        </div>
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preco</th>
                  <th>Quantidade</th>
                  <th>Subtotal</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product.id}>
                    <td>{item.product.name}</td>
                    <td>{formatCurrency(item.product.price)}</td>
                    <td>
                      <input
                        className="quantity-input"
                        min="1"
                        max={item.product.quantity}
                        type="number"
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
                      />
                    </td>
                    <td>{formatCurrency(Number(item.product.price || 0) * item.quantity)}</td>
                    <td>
                      <button className="link-button" type="button" onClick={() => removeItem(item.product.id)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-summary">
            <dl className="cart-summary__lines">
              <div><dt>Subtotal</dt><dd>{formatCurrency(subtotal)}</dd></div>
              <div><dt>Frete</dt><dd>{formatCurrency(shipping)}</dd></div>
              <div className="cart-summary__total"><dt>Total</dt><dd>{formatCurrency(total)}</dd></div>
            </dl>
            <button className="button" type="button" onClick={handleCheckout} disabled={submitting}>
              {submitting && <span className="spinner" aria-hidden="true" />}
              {submitting ? 'Finalizando...' : 'Finalizar compra'}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default CartPage;
