import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartOpen, setCartOpen] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart');
      setCart(data || { items: [] });
    } catch {}
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) { toast.error('Please login to add items to cart'); return; }
    try {
      const { data } = await axios.post('/api/cart/add', { productId, quantity });
      setCart(data);
      toast.success('Added to cart!');
      setCartOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put('/api/cart/update', { productId, quantity });
      setCart(data);
    } catch {}
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove/${productId}`);
      setCart(data);
      toast.success('Item removed');
    } catch {}
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear');
      setCart({ items: [] });
    } catch {}
  };

  const cartCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  // ✅ FIX - discountPrice use karo agar available ho, warna price
  // cartTotal = rupees me (e.g. 19100, not 1910000)
  const cartTotal = cart.items?.reduce((s, i) => {
    const price = i.product?.discountPrice || i.product?.price || 0;
    return s + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, updateQuantity, removeItem, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);