import './Card.css'


export function Card(props) {
    
    return (
        <div className="card">
            <img src={props.img} alt="Product"></img>
            <h3>{props.name}</h3>
            <p>{props.title}</p>
            <span>R$ {props.price}</span>
            <button onClick={props.onDelete}>Excluir</button>
        </div>
    );
}

export default Card;
