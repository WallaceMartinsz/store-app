import { useState } from 'react';
import Button from '../../../components/ui/button';
import { cardClasses } from '../../../components/ui/card';
import { Field, Input, Select } from '../../../components/ui/input';
import { cn } from '../../../lib/utils';
import { CATEGORIES } from '../categories';

const INITIAL_PRODUCT = {
  name: '',
  title: '',
  price: '',
  quantity: 0,
  category: '',
  img: ''
};

const ProductForm = ({ initialValues = INITIAL_PRODUCT, submitLabel = 'Salvar', onSubmit }) => {
  const [product, setProduct] = useState({
    ...INITIAL_PRODUCT,
    ...initialValues,
    category: initialValues.category || ''
  });
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

    if (product.quantity === '' || !Number.isInteger(Number(product.quantity)) || Number(product.quantity) < 0) {
      formErrors.quantity = 'Informe uma quantidade valida.';
    }

    if (!product.category) {
      formErrors.category = 'Selecione uma categoria.';
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
        price: Number(product.price),
        quantity: Number(product.quantity)
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={cn(cardClasses, 'grid gap-4 p-5')} onSubmit={handleSubmit}>
      <Field label="Nome" error={errors.name}>
        <Input name="name" type="text" value={product.name} onChange={handleChange} />
      </Field>

      <Field label="Descricao" error={errors.title}>
        <Input name="title" type="text" value={product.title} onChange={handleChange} />
      </Field>

      <Field label="Categoria" error={errors.category}>
        <Select name="category" value={product.category} onChange={handleChange}>
          <option value="" disabled>Selecione...</option>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>{category.label}</option>
          ))}
        </Select>
      </Field>

      <Field label="Quantidade" error={errors.quantity}>
        <Input name="quantity" type="number" min="0" step="1" value={product.quantity} onChange={handleChange} />
      </Field>

      <Field label="Preco" error={errors.price}>
        <Input name="price" type="number" min="0" step="0.01" value={product.price} onChange={handleChange} />
      </Field>

      <Field label="Imagem" error={errors.img}>
        <Input name="img" type="url" value={product.img} onChange={handleChange} />
      </Field>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  );
};

export default ProductForm;
