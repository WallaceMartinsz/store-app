import { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const CART_KEY = 'store-app-cart';
const ORDERS_KEY = 'store-app-orders';
const CartContext = createContext(null);

const readJson = (key, fallback) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
};

const saveJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getCartCount = (items) => items.reduce((total, item) => total + item.quantity, 0);

const getCartTotal = (items) => items.reduce((total, item) => (
  total + Number(item.product.price || 0) * item.quantity
), 0);

export const CartProvider = ({ children }) => {
  const { session } = useAuth();
  const [items, setItems] = useState(() => readJson(CART_KEY, []));
  const [orders, setOrders] = useState(() => readJson(ORDERS_KEY, []));

  const persistItems = (nextItems) => {
    setItems(nextItems);
    saveJson(CART_KEY, nextItems);
  };

  const persistOrders = (nextOrders) => {
    setOrders(nextOrders);
    saveJson(ORDERS_KEY, nextOrders);
  };

  const addItem = (product) => {
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      persistItems(items.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      return;
    }

    persistItems([...items, { product, quantity: 1 }]);
  };

  const updateQuantity = (productId, quantity) => {
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

  const checkout = () => {
    if (!session?.visitor || items.length === 0) {
      return null;
    }

    const order = {
      id: Date.now(),
      visitorEmail: session.visitor.email,
      createdAt: new Date().toISOString(),
      items,
      total: getCartTotal(items)
    };

    persistOrders([order, ...orders]);
    clearCart();
    return order;
  };

  const visitorOrders = useMemo(() => {
    if (!session?.visitor?.email) {
      return [];
    }

    return orders.filter((order) => order.visitorEmail === session.visitor.email);
  }, [orders, session]);

  const value = {
    items,
    itemCount: getCartCount(items),
    total: getCartTotal(items),
    orders: visitorOrders,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    checkout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
