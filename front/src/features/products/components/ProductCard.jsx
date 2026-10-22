import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ImageOff, ShoppingCart } from 'lucide-react';
import Button from '../../../components/ui/button';
import { cardClasses } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../utils/formatters';
import { getCategoryLabel } from '../categories';

const INSTALLMENTS = 10;

const badgeClasses = 'absolute left-2.5 top-2.5 rounded px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.04em]';

const ProductCard = ({ product, index = 0, variant = 'store', onAddToCart, onDelete }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [added, setAdded] = useState(false);
  const isAdmin = variant === 'admin';
  const isOutOfStock = product.quantity <= 0;
  const isLowStock = !isOutOfStock && product.quantity <= 5;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    // A entrada fica no wrapper para nao conflitar com o transform do hover no article
    <div className="flex animate-fade-up-fast" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <article
        className={cn(
          cardClasses,
          'group flex flex-1 flex-col overflow-hidden transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary'
        )}
      >
        <div className="relative overflow-hidden">
          {imageFailed ? (
            <div className="grid aspect-[4/3] w-full place-items-center bg-sunken text-[#475569]">
              <ImageOff size={32} aria-hidden="true" />
            </div>
          ) : (
            <img
              className={cn(
                'aspect-[4/3] w-full bg-sunken object-cover transition-transform duration-300 group-hover:scale-[1.03]',
                isOutOfStock && 'opacity-60 grayscale'
              )}
              src={product.img}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          )}
          {isLowStock && (
            <span className={cn(badgeClasses, 'bg-[rgba(146,64,14,0.85)] text-[#fde68a]')}>Últimas unidades</span>
          )}
          {isOutOfStock && (
            <span className={cn(badgeClasses, 'bg-[rgba(31,41,55,0.9)] text-[#9ca3af]')}>Esgotado</span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-light">
            {getCategoryLabel(product.category)}
          </span>
          <h3 className="text-[15px] font-semibold text-foreground">{product.name}</h3>
          <p className="flex-1 text-[13px] leading-normal text-muted">{product.title}</p>
          <strong className="mt-3 block text-lg font-bold text-foreground">{formatCurrency(product.price)}</strong>
          {isAdmin ? (
            <span className={cn('text-xs font-medium', isOutOfStock ? 'text-danger-text' : 'text-success')}>
              Estoque: {product.quantity} un.
            </span>
          ) : (
            <span className="text-xs text-muted">
              ou {INSTALLMENTS}x de {formatCurrency(Number(product.price) / INSTALLMENTS)} sem juros
            </span>
          )}
        </div>

        <div className={cn('px-4 pb-4', isAdmin && 'grid grid-cols-2 gap-2')}>
          {isAdmin ? (
            <>
              <Button as={Link} variant="secondary" to={`/admin/products/${product.id}/edit`}>
                Editar
              </Button>
              <Button variant="danger" type="button" onClick={() => onDelete(product.id)}>
                Excluir
              </Button>
            </>
          ) : (
            <Button full variant={added ? 'success' : 'default'} type="button" onClick={handleAdd} disabled={isOutOfStock}>
              {isOutOfStock ? 'Indisponível' : (
                <span key={added ? 'added' : 'idle'} className="inline-flex animate-swap-in items-center gap-2">
                  {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                  {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
                </span>
              )}
            </Button>
          )}
        </div>
      </article>
    </div>
  );
};

export default ProductCard;
