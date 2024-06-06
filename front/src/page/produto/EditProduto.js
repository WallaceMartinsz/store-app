import "./EditProduto.css";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchStoreData from '../../hooks/useProductData';

const EditProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', title: '', img: '', price: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://54.174.67.250:8080/store/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar o produto:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://54.174.67.250:8080/store/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Editar Produto</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Nome</label>
          <input type="text" name="name" value={product.name} onChange={handleInputChange} />
        </div>
        <div>
          <label>Título</label>
          <input type="text" name="title" value={product.title} onChange={handleInputChange} />
        </div>
        <div>
          <label>Imagem</label>
          <input type="text" name="img" value={product.img} onChange={handleInputChange} />
        </div>
        <div>
          <label>Preço</label>
          <input type="number" name="price" value={product.price} onChange={handleInputChange} />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditProduto;
