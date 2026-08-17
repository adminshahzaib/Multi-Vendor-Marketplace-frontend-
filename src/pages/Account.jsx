// src/pages/Account.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const getOrderStatus = (order) => {
  const statuses = order.vendorOrders?.map((v) => v.status) || [];
  if (statuses.length === 0) return 'Pending';
  if (statuses.every((s) => s === 'delivered')) return 'Delivered';
  if (statuses.some((s) => s === 'shipped')) return 'Shipped';
  if (statuses.some((s) => s === 'processing')) return 'Processing';
  return 'Pending';
};

const getOrderItemsSummary = (order) => {
  const items = order.vendorOrders?.flatMap((v) => v.items) || [];
  if (items.length === 0) return 'No items';
  if (items.length === 1) return items[0].name;
  return `${items[0].name} + ${items.length - 1} more`;
};

const Account = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders/mine');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'customer') {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{user?.name || 'Customer Profile'}</h1>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                {user?.role || 'Customer'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs bg-gray-100 hover:bg-red-50 hover:text-red-600 font-bold px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Order History</h2>
            <Link to="/catalog" className="text-xs text-blue-600 font-semibold hover:underline">
              Shop More
            </Link>
          </div>

          {user?.role !== 'customer' ? (
            <p className="text-xs text-gray-500">Order history is available for customer accounts.</p>
          ) : loading ? (
            <p className="text-xs text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-semibold text-gray-700">No orders yet</p>
              <p className="text-xs text-gray-400">Your purchases will appear here after checkout.</p>
              <Link
                to="/catalog"
                className="inline-block mt-2 text-xs bg-blue-600 text-white font-bold px-4 py-2 rounded-lg"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => {
                const status = getOrderStatus(ord);
                return (
                  <div
                    key={ord._id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">#{String(ord._id).slice(-8).toUpperCase()}</span>
                      <p className="text-gray-500 mt-0.5">{getOrderItemsSummary(ord)}</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(ord.createdAt).toLocaleDateString()} · {ord.paymentMethod}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block font-bold text-slate-900">${ord.totalPrice.toFixed(2)}</span>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-600'
                            : status === 'Pending'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {status}
                      </span>
                      <span className="block text-[10px] text-gray-400 mt-1">
                        {ord.isPaid ? 'Paid' : 'Pay on delivery'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
