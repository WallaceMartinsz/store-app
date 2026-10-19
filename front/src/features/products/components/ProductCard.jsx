import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

const ProductCard = ({ product, variant = 'store', onAddToCart, onDelete }) => {
  const isAdmin = variant === 'admin';

  return (
    <article className="product-card">
      <img className="product-card__image" src={product.img} alt={product.name} />
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p>{product.title}</p>
        <p>Estoque: {product.quantity}</p>
        <strong>{formatCurrency(product.price)}</strong>
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
          <button className="button" type="button" onClick={() => onAddToCart(product)}>
            Adicionar ao carrinho
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
