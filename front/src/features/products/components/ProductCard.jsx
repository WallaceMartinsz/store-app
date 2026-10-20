import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { getCategoryLabel } from '../categories';

const INSTALLMENTS = 10;

const ProductCard = ({ product, variant = 'store', onAddToCart, onDelete }) => {
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
    <article className={`product-card ${isOutOfStock ? 'is-out' : ''}`}>
      <div className="product-card__img-wrap">
        {imageFailed ? (
          <div className="product-card__image product-card__image--fallback">
            <ImageOff size={32} aria-hidden="true" />
          </div>
        ) : (
          <img
            className="product-card__image"
            src={product.img}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {isLowStock && (
          <span className="product-card__badge product-card__badge--low">Últimas unidades</span>
        )}
        {isOutOfStock && (
          <span className="product-card__badge product-card__badge--out">Esgotado</span>
        )}
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{getCategoryLabel(product.category)}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__title">{product.title}</p>
        <strong className="product-card__price">{formatCurrency(product.price)}</strong>
        {isAdmin ? (
          <span className={`product-card__stock ${isOutOfStock ? 'is-empty' : ''}`}>
            Estoque: {product.quantity} un.
          </span>
        ) : (
          <span className="product-card__installments">
            ou {INSTALLMENTS}x de {formatCurrency(Number(product.price) / INSTALLMENTS)} sem juros
          </span>
        )}
      </div>

      <div className={`product-card__actions ${isAdmin ? 'product-card__actions--split' : ''}`}>
        {isAdmin ? (
          <>
            <Link className="button button--secondary" to={`/admin/products/${product.id}/edit`}>
              Editar
            </Link>
            <button className="button button--danger" type="button" onClick={() => onDelete(product.id)}>
              Excluir
            </button>
          </>
        ) : (
          <button
            className="button button--full"
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Indisponível' : (
              <>
                <ShoppingCart size={16} /> {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
