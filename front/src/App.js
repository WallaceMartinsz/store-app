import './App.css'
import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import fetchStoreData from './hooks/useProductData'
import Header from './components/Header';
import { ProductForm } from './components/Modal';


function App() {
  const [data, setData] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchStoreData(); 
      setData(response.data); 
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  const handleToggleProductForm = () => {
    setShowProductForm(!showProductForm);
  };

  return (
    <div className="App">
      <Header />
      <section className='index'>
        <h1>
          Produtos em estoque!
        </h1>
        <button className='add-product' onClick={handleToggleProductForm}>
          {showProductForm ? 'Fechar formulário' : 'Adicionar produto'}
        </button>
        {showProductForm && <ProductForm />}
        <div className='card-list'>
          {data?.map(productData => 
            <Card key={productData.id}
              img={productData.img}
              name={productData.name}
              title={productData.title}
              price={productData.price}
            />)}
        </div>
      </section>
    </div>
  );
}

export default App;
