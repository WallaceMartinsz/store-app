import { createContext, useContext, useEffect, useRef, useState } from 'react';
import ordersApi from '../api/ordersApi';
import { useAuth } from '../auth/AuthContext';

export const SHIPPING_FEE = 10;
const CART_KEY = 'store-app-cart';
// Pedidos ficavam no localStorage antes da API de pedidos; a chave antiga e limpa ao carregar
const LEGACY_ORDERS_KEY = 'store-app-orders';
const CartContext = createContext(null);

const readJson = (key, fallback) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

const saveJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Identifica o dono do carrinho: visitante logado, admin ou anonimo
const getCartOwner = (session) => {
  if (session?.type === 'visitor') {
    return `visitor:${session.visitor.id}`;
  }

  return session?.type || 'guest';
};

const getCartCount = (items) => items.reduce((total, item) => total + item.quantity, 0);

const getCartTotal = (items) => items.reduce((total, item) => (
  total + Number(item.product.price || 0) * item.quantity
), 0);

export const CartProvider = ({ children }) => {
  const { session } = useAuth();
  const [items, setItems] = useState(() => readJson(CART_KEY, []));
  const [lastAdded, setLastAdded] = useState(null);
  const ownerRef = useRef(getCartOwner(session));

  const persistItems = (nextItems) => {
    setItems(nextItems);
    saveJson(CART_KEY, nextItems);
  };

  useEffect(() => {
    localStorage.removeItem(LEGACY_ORDERS_KEY);
  }, []);

  // Zera o carrinho quando a sessao troca de dono (logout, outro cliente ou admin).
  // Itens adicionados sem login sao mantidos ao entrar, para o cliente finalizar a compra.
  const owner = getCartOwner(session);
  useEffect(() => {
    const previousOwner = ownerRef.current;
    ownerRef.current = owner;

    if (previousOwner !== owner && (previousOwner !== 'guest' || owner === 'admin')) {
      persistItems([]);
      setLastAdded(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);

  const addItem = (product) => {
    const existingItem = items.find((item) => item.product.id === product.id);

    // O id muda a cada clique para o aviso animar de novo mesmo com o mesmo produto
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        setLastAdded({ id: Date.now(), product, limitReached: true });
        return;
      }

      persistItems(items.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      persistItems([...items, { product, quantity: 1 }]);
    }

    setLastAdded({ id: Date.now(), product, limitReached: false });
  };

  const dismissLastAdded = () => setLastAdded(null);

  const updateQuantity = (productId, requestedQuantity) => {
    const item = items.find((cartItem) => cartItem.product.id === productId);
    const quantity = Math.min(requestedQuantity, item?.product.quantity ?? requestedQuantity);

    if (quantity <= 0) {
      persistItems(items.filter((item) => item.product.id !== productId));
      return;
    }

    persistItems(items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeItem = (productId) => {
    persistItems(items.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    persistItems([]);
  };

  // Envia o carrinho para a API; o backend busca precos, valida estoque e calcula o total
  const checkout = async (paymentMethod, installments) => {
    const response = await ordersApi.create(
      items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      paymentMethod,
      installments
    );

    clearCart();
    setLastAdded(null);
    return response.data;
  };

  const value = {
    items,
    itemCount: getCartCount(items),
    subtotal: getCartTotal(items),
    shipping: items.length > 0 ? SHIPPING_FEE : 0,
    total: items.length > 0 ? getCartTotal(items) + SHIPPING_FEE : 0,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    lastAdded,
    dismissLastAdded
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
