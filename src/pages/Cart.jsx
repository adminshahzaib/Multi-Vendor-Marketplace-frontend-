// src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const shippingCost = subtotal > 100 ? 0 : 15;
  const estimatedTotal = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <span className="text-5xl mb-4">🛍️</span>
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our storefronts and find something great!
        </p>
        <Link
          to="/catalog"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-sm"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-500 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemId = item._id || item.id;
              return (
              <div
                key={itemId}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                />

                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    {item.vendor?.name}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                  <p className="text-xs font-semibold text-gray-500">${item.price.toFixed(2)} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(itemId, -1)}
                    className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-black"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  {item.stock != null && (
                    <span className="text-[10px] text-gray-400 pr-2">max {item.stock}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => updateQuantity(itemId, 1)}
                    disabled={item.stock != null && item.quantity >= item.stock}
                    className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-black disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                {/* Price & Delete */}
                <div className="text-right">
                  <span className="block text-sm font-bold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(itemId)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
            })}
          </div>

          {/* Order Summary Side Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-blue-600 font-medium">
                  Add ${(100 - subtotal).toFixed(2)} more to qualify for FREE shipping!
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-blue-600">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-slate-900 hover:bg-blue-600 text-white text-center font-bold text-xs py-3.5 rounded-xl transition shadow-sm"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;