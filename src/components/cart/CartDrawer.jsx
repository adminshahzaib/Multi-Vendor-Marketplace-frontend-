// src/components/cart/CartDrawer.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-slate-900 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <span className="text-4xl">🛒</span>
                <p className="text-sm font-semibold text-gray-700">Your cart is empty</p>
                <p className="text-xs text-gray-400">Discover top items from vendor stores!</p>
              </div>
            ) : (
              cart.map((item) => {
                const itemId = item._id || item.id;
                return (
                <div key={itemId} className="flex gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.vendor?.storeName || item.vendor?.name || 'Marketplace Direct'}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemId, -1)}
                          className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:text-black"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemId, 1)}
                          disabled={item.stock != null && item.quantity >= item.stock}
                          className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:text-black disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-gray-400">Shipping and taxes calculated at checkout.</p>

              <div className="space-y-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-xs py-3 rounded-xl transition shadow-sm"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-slate-800 text-center font-semibold text-xs py-2.5 rounded-xl transition"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;