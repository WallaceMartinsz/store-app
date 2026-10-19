import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useCart } from '../../cart/CartContext';
import { formatCurrency } from '../../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const { isVisitor, session } = useAuth();
  const { checkout, items, removeItem, total, updateQuantity } = useCart();

  const handleCheckout = () => {
    if (!isVisitor) {
      navigate('/login', { state: { mode: 'visitor', from: '/cart' } });
      return;
    }

    const order = checkout();

    if (order) {
      navigate('/profile');
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

      {items.length === 0 ? (
        <p>Seu carrinho esta vazio.</p>
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
          <div className="frete">
            <p>Frete: {formatCurrency(10.0)}</p>
          </div>

          <div className="cart-summary">
            <strong>Total: {formatCurrency(total)}</strong>
            <button className="button" type="button" onClick={handleCheckout}>Finalizar compra</button>
          </div>
        </>
      )}
    </section>
  );
};

export default CartPage;
