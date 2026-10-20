import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

const ProductCard = ({ product, variant = 'store', onAddToCart, onDelete }) => {
  const isAdmin = variant === 'admin';
  const isOutOfStock = product.quantity === 0;
  const isLowStock = !isOutOfStock && product.quantity <= 5;

  return (
    <article className="product-card">
      <div className="product-card__img-wrap">
        <img className="product-card__image" src={product.img} alt={product.name} />
        {isLowStock && (
          <span className="product-card__badge product-card__badge--low">Últimas unidades</span>
        )}
        {isOutOfStock && (
          <span className="product-card__badge product-card__badge--out">Esgotado</span>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__title">{product.title}</p>
        <strong className="product-card__price">{formatCurrency(product.price)}</strong>
      </div>

      <div className="product-card__actions">
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
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Esgotado' : 'Adicionar ao carrinho'}
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
