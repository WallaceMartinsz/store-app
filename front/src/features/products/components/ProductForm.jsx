import { useState } from 'react';

const INITIAL_PRODUCT = {
  name: '',
  title: '',
  price: '',
  quantity: 0,
  img: ''
};

const ProductForm = ({ initialValues = INITIAL_PRODUCT, submitLabel = 'Salvar', onSubmit }) => {
  const [product, setProduct] = useState({ ...INITIAL_PRODUCT, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((currentProduct) => ({
      ...currentProduct,
      [name]: value
    }));
  };

  const validate = () => {
    const formErrors = {};

    if (!product.name.trim()) {
      formErrors.name = 'Informe o nome do produto.';
    }

    if (!product.title.trim()) {
      formErrors.title = 'Informe a descricao do produto.';
    }

    if (!product.price || Number(product.price) <= 0) {
      formErrors.price = 'Informe um preco maior que zero.';
    }

    if (!product.img.trim()) {
      formErrors.img = 'Informe a URL da imagem.';
    }

    if (!product.quantity || Number(product.quantity) < 0) {
      formErrors.quantity = 'Informe uma quantidade valida.';
    }

    return formErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});
      await onSubmit({
        ...product,
        price: Number(product.price)
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input name="name" type="text" value={product.name} onChange={handleChange} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </label>

      <label>
        Descricao
        <input name="title" type="text" value={product.title} onChange={handleChange} />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Quantidade
        <input name="quantity" type="number" min="0" value={product.quantity} onChange={handleChange} />
        {errors.quantity && <span className="field-error">{errors.quantity}</span>}
      </label>

      <label>
        Preco
        <input name="price" type="number" min="0" step="0.01" value={product.price} onChange={handleChange} />
        {errors.price && <span className="field-error">{errors.price}</span>}
      </label>

      <label>
        Imagem
        <input name="img" type="url" value={product.img} onChange={handleChange} />
        {errors.img && <span className="field-error">{errors.img}</span>}
      </label>

      <button className="button" type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
