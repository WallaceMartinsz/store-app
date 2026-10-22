import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';
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
  const accent = limitReached ? 'text-warning' : 'text-success';

  return (
    // key reinicia a animacao a cada novo clique
    <div
      key={lastAdded.id}
      className={cn(
        'fixed bottom-6 right-6 z-[200] flex w-[min(calc(100vw-32px),360px)] animate-toast-in items-center gap-3 overflow-hidden rounded-[10px] border border-l-[3px] border-line bg-surface py-3 pb-3.5 pl-3 pr-10 shadow-[0_12px_32px_rgba(0,0,0,0.45)] max-[760px]:bottom-4 max-[760px]:right-4',
        limitReached ? 'border-l-warning' : 'border-l-success'
      )}
      role="status"
    >
      <img className="h-[52px] w-[52px] shrink-0 rounded-md bg-background object-cover" src={product.img} alt="" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <strong className={cn('flex items-center gap-1.5 text-[13px]', accent)}>
          <Icon size={16} aria-hidden="true" />
          {limitReached ? 'Limite de estoque' : 'Adicionado ao carrinho'}
        </strong>
        <span className="truncate text-sm text-foreground">
          {limitReached ? `Só temos ${product.quantity} un. de ${product.name}.` : product.name}
        </span>
        <Link className="text-[13px] font-medium text-primary-lighter underline" to="/cart" onClick={dismissLastAdded}>
          Ver carrinho
        </Link>
      </div>
      <button
        className="absolute right-2 top-2 grid h-[26px] w-[26px] cursor-pointer place-items-center rounded-md text-subtle transition-colors hover:bg-line hover:text-foreground"
        type="button"
        aria-label="Fechar aviso"
        onClick={dismissLastAdded}
      >
        <X size={16} />
      </button>
      <span
        className={cn(
          'absolute inset-x-0 bottom-0 h-[3px] origin-left animate-toast-progress',
          limitReached ? 'bg-warning' : 'bg-success'
        )}
        style={{ animationDuration: `${TOAST_DURATION}ms` }}
      />
    </div>
  );
};

export default CartToast;
