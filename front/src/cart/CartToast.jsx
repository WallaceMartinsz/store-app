import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useCart } from './CartContext';

const TOAST_DURATION = 3000;

const CartToast = () => {
  const { lastAdded, dismissLastAdded } = useCart();

  useEffect(() => {
    if (!lastAdded) {
      return undefined;
    }

    const timer = setTimeout(dismissLastAdded, TOAST_DURATION);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdded?.id]);

  if (!lastAdded) {
    return null;
  }

  const { product, limitReached } = lastAdded;
  const Icon = limitReached ? AlertCircle : CheckCircle2;

  return (
    // key reinicia a animacao a cada novo clique
    <div key={lastAdded.id} className={`cart-toast ${limitReached ? 'cart-toast--warning' : ''}`} role="status">
      <img className="cart-toast__image" src={product.img} alt="" />
      <div className="cart-toast__body">
        <strong>
          <Icon size={16} aria-hidden="true" />
          {limitReached ? 'Limite de estoque' : 'Adicionado ao carrinho'}
        </strong>
        <span>{limitReached ? `Só temos ${product.quantity} un. de ${product.name}.` : product.name}</span>
        <Link to="/cart" onClick={dismissLastAdded}>Ver carrinho</Link>
      </div>
      <button className="cart-toast__close" type="button" aria-label="Fechar aviso" onClick={dismissLastAdded}>
        <X size={16} />
      </button>
      <span className="cart-toast__progress" style={{ animationDuration: `${TOAST_DURATION}ms` }} />
    </div>
  );
};

export default CartToast;
