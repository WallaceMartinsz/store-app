import './CreateProduto.css';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function CreateProduto() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    title: "",
    price: 0,
    img: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    fetch("http://localhost:8080/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => {
        setFeedbackMessage("Produto cadastrado com sucesso");
        setFormErrors({});
        setTimeout(() => {
          navigate('/');
        }, 500);
      })
      .catch((error) => {
        setFeedbackMessage("Erro ao cadastrar o produto");
      });

    setProduct({
      name: "",
      title: "",
      price: 0,
      img: ""
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!product.name) {
      errors.name = "O nome é obrigatório.";
    }

    if (!product.title) {
      errors.title = "O título é obrigatório.";
    }

    if (!product.price) {
      errors.price = "O preço é obrigatório.";
    }

    if (!product.img) {
      errors.img = "A imagem é obrigatória.";
    }

    return errors;
  };

  return (
    <div className="form-container">
      <form className="form__post" onSubmit={handleSubmit}>
        <label>Nome</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Digite o nome do produto"
        />
        {formErrors.name && <span className="error">{formErrors.name}</span>}

        <label>Título</label>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="Digite o título do produto"
        />
        {formErrors.title && <span className="error">{formErrors.title}</span>}

        <label>Preço</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Digite o preço do produto"
        />
        {formErrors.price && <span className="error">{formErrors.price}</span>}

        <label>Imagem</label>
        <input
          type="text"
          name="img"
          value={product.img}
          onChange={handleChange}
          placeholder="Cole o link da imagem do produto"
        />
        {formErrors.img && <span className="error">{formErrors.img}</span>}
        
        <button type="submit">Cadastrar</button>
      </form>

      {feedbackMessage && <div className="feedback">{feedbackMessage}</div>}
    </div>
  );
}

export default CreateProduto;
