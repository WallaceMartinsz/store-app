import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Card from './components/Card';
import fetchStoreData from './hooks/useProductData';
import Header from './components/Header';
import CreateProduto from './page/produto/CreateProduto';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchStoreData();
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:8080/store/${productId}`, {
        method: "DELETE",
      });
      const updatedData = await fetchStoreData();
      setData(updatedData.data);
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }
  };

  return (
    <Router>
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              <section className='index'>
                <h1>Produtos em estoque</h1>
                {loading ? (
                  <p>Carregando...</p>
                ) : data.length === 0 ? (
                  <p>Nenhum produto cadastrado.</p>
                ) : (
                  <div className='card-list'>
                    {data.map(productData => 
                      <Card key={productData.id}
                        img={productData.img}
                        name={productData.name}
                        title={productData.title}
                        price={productData.price}
                        onDelete={() => handleDeleteProduct(productData.id)}
                      />)}
                  </div>
                )}
              </section>
            } 
          />
          <Route path="/add-product" element={<CreateProduto />} />
        </Routes>
    </Router>
  );
}

export default App;
