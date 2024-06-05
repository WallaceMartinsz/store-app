import './Card.css';
import { Link } from 'react-router-dom';

export function Card(props) {
  return (
    <div className="card">
      <button className="delete-button" onClick={props.onDelete}>Excluir</button>
      <img src={props.img} alt="Product" />
      <h3>{props.name}</h3>
      <p>{props.title}</p>
      <span>R$ {props.price}</span>
      <Link to={`/edit-product/${props.id}`} className="edit-link">Editar</Link>
    </div>
  );
}

export default Card;
