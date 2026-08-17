// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, subtotal, submitCheckout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shippingCost = subtotal > 100 ? 0 : 15;
  const orderTotal = subtotal + shippingCost;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await submitCheckout(
      {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      'Cash on Delivery'
    );

    setIsSubmitting(false);

    if (result.success) {
      navigate('/ordersuccess', { state: { order: result.order } });
    } else {
      setError(result.error || 'Failed to place order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-slate-900">No items to checkout</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-4 bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-lg"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Checkout</h1>
        <p className="text-xs text-gray-500 mb-8">Payment method: Cash on Delivery</p>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main Street, Suite 100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pakistan"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Payment Method
              </h2>
              <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-xs">
                <span className="text-lg">💵</span>
                <div>
                  <p className="font-bold text-slate-900">Cash on Delivery</p>
                  <p className="text-gray-500 mt-0.5">Pay when your order arrives at your doorstep.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-gray-100">
              Order Items ({cart.length})
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <div key={itemId} className="flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 text-base font-extrabold text-slate-900">
                <span>Total Due</span>
                <span className="text-blue-600">${orderTotal.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 pt-1">Pay ${orderTotal.toFixed(2)} in cash on delivery.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order • $${orderTotal.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
