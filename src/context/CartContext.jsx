import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'mv_cart';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCartFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const getItemId = (item) => item._id || item.id;

  const addToCart = (product, quantity = 1) => {
    const stock = product.stock ?? 0;
    if (stock <= 0) {
      return { success: false, error: 'This product is out of stock.' };
    }

    const productId = getItemId(product);
    let error = null;

    setCart((prev) => {
      const existing = prev.find((item) => getItemId(item) === productId);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + quantity;

      if (newQty > stock) {
        error =
          currentQty > 0
            ? `Only ${stock} in stock. You already have ${currentQty} in your cart.`
            : `Only ${stock} item(s) available in stock.`;
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          getItemId(item) === productId
            ? { ...item, quantity: newQty, stock }
            : item
        );
      }
      return [...prev, { ...product, quantity, stock }];
    });

    if (error) {
      return { success: false, error };
    }

    setIsCartOpen(true);
    return { success: true };
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (getItemId(item) !== productId) return item;
          const maxStock = item.stock ?? Infinity;
          const newQty = Math.min(maxStock, Math.max(0, item.quantity + delta));
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => getItemId(item) !== productId));
  };

  const clearCart = () => setCart([]);

  const submitCheckout = async (shippingAddress, paymentMethod = 'Cash on Delivery') => {
    try {
      const orderItems = cart.map((item) => ({
        productId: getItemId(item),
        quantity: item.quantity,
      }));

      const { data } = await API.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      setIsCartOpen(false);
      return { success: true, order: data };
    } catch (error) {
      console.error('Checkout failed:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Checkout failed',
      };
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        submitCheckout,
        cartCount,
        cartTotal,
        totalItems: cartCount,
        subtotal: cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
