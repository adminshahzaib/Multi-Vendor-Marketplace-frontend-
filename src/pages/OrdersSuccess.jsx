// src/pages/OrdersSuccess.jsx
import { Link, useLocation } from 'react-router-dom';

const OrdersSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-4">
      <span className="text-6xl mb-4">🎉</span>
      <h1 className="text-3xl font-extrabold text-slate-900">Order Confirmed!</h1>
      {order ? (
        <div className="mt-4 space-y-1 text-xs text-gray-600">
          <p>
            Order ID: <strong className="text-slate-900">#{String(order._id).slice(-8).toUpperCase()}</strong>
          </p>
          <p>
            Total: <strong className="text-slate-900">${order.totalPrice?.toFixed(2)}</strong>
          </p>
          <p>
            Payment: <strong className="text-slate-900">{order.paymentMethod || 'Cash on Delivery'}</strong>
          </p>
          <p className="text-gray-500">Pay in cash when your order is delivered.</p>
        </div>
      ) : (
        <p className="text-xs text-gray-500 mt-2 max-w-sm">
          Thank you for your purchase. We have notified our independent vendor merchants to prepare your order.
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Link
          to="/account"
          className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition"
        >
          View Order History
        </Link>
        <Link
          to="/catalog"
          className="bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-semibold px-5 py-3 rounded-xl transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrdersSuccess;
