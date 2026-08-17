import { useState, useEffect } from 'react';
import API from '../../api/axios';

const PRODUCT_CATEGORIES = ['Electronics', 'Apparel', 'Home & Kitchen', 'Books'];

const initialFormData = {
  name: '',
  description: '',
  categoryOption: 'Electronics',
  customCategory: '',
  price: '',
  stock: '',
  image: '',
};

const getCategoryFields = (category) => {
  if (PRODUCT_CATEGORIES.includes(category)) {
    return { categoryOption: category, customCategory: '' };
  }
  return { categoryOption: 'Other', customCategory: category };
};

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);

  const loadVendorData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        API.get('/products/vendor/inventory'),
        API.get('/orders/vendor'),
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error('Failed to load merchant data', error);
    }
  };

  useEffect(() => {
    loadVendorData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const resolveCategory = () => {
    if (formData.categoryOption === 'Other') {
      return formData.customCategory.trim();
    }
    return formData.categoryOption;
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const category = resolveCategory();
    if (!category) {
      alert('Please select a category or enter one under Other.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image,
    };

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post('/products', payload);
      }
      resetForm();
      loadVendorData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    const categoryFields = getCategoryFields(product.category);
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      ...categoryFields,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product listing?')) return;

    try {
      await API.delete(`/products/${productId}`);
      if (editingId === productId) resetForm();
      loadVendorData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/vendor-status`, { status: newStatus });
      loadVendorData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-black text-slate-900">Vendor Management Portal</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Sub-Orders ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Listing' : 'List New Item'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-gray-500 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Product Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
              <textarea
                placeholder="Description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-20"
              />
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Category</label>
                <select
                  required
                  value={formData.categoryOption}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryOption: e.target.value, customCategory: '' })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {formData.categoryOption === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom category"
                    required
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Price ($)"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>
              <input
                type="url"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
              >
                {editingId ? 'Update Listing' : 'Publish Listing'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h2 className="text-base font-bold text-slate-900 mb-4">Current Listings</h2>
            {products.length === 0 ? (
              <p className="text-xs text-gray-500">No products listed yet.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((item) => (
                    <tr key={item._id}>
                      <td className="py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3 text-slate-600">{item.category}</td>
                      <td className="py-3 text-slate-600">${item.price.toFixed(2)}</td>
                      <td className="py-3 text-slate-600">
                        <span className={item.stock <= 5 ? 'text-amber-600 font-bold' : ''}>
                          {item.stock} units
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            className="text-red-500 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Sub-Orders Received</h2>
          {orders.length === 0 ? (
            <p className="text-xs text-gray-500">No sub-orders yet. Orders will appear here when customers checkout.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="border border-slate-100 p-4 rounded-xl flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Order #{String(order._id).slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Customer: {order.customer?.name} ({order.customer?.email})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Items: {order.subOrder?.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Subtotal: ${order.subOrder?.subtotal?.toFixed(2)}
                  </p>
                </div>
                <select
                  value={order.subOrder?.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
