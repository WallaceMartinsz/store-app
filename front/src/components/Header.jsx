import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <nav>
        <h1>Store</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-product">Adicionar Produto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
