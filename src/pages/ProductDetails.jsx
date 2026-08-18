// src/pages/ProductDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (!product) return;

    const result = addToCart(product, quantity);
    if (!result.success) {
      setCartMessage(result.error);
      return;
    }
    setCartMessage('Added to cart!');
  };

  const outOfStock = !product || product.stock <= 0;
  const maxQuantity = product?.stock || 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-blue-600">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </nav>

        {/* Product Showcase Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Main Image View */}
          <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Product Purchase Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Vendor Badges */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-gray-500">
                  Sold by <strong className="text-slate-900">{product.vendor?.storeName || product.vendor?.name || 'Marketplace Direct'}</strong>
                </span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 leading-snug">{product.name}</h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="text-amber-500 font-bold">★ {product.rating}</span>
                <span className="text-gray-400">({product.reviewCount} verified customer reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 mt-4 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock & Quantity Controls */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">Availability:</span>
                <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-black disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    disabled={outOfStock || quantity >= maxQuantity}
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-black disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex-1 bg-slate-900 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs py-3 rounded-lg transition shadow-sm"
                >
                  {outOfStock ? 'Out of Stock' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
                </button>
              </div>
              {cartMessage && (
                <p className={`text-xs ${cartMessage.includes('Added') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {cartMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Specs & Customer Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex border-b border-gray-100 gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 transition ${
                activeTab === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'
              }`}
            >
              Product Specs
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition ${
                activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="pt-6 text-xs text-gray-600 leading-relaxed">
            {activeTab === 'description' ? (
              <div className="space-y-2">
                <p>• Premium grade manufacturing materials.</p>
                <p>• Full merchant warranty included.</p>
                <p>• Ships directly from {product.vendor?.storeName || product.vendor?.name || 'Marketplace Direct'} regional warehouse.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>Sarah M.</span>
                    <span className="text-amber-500">★★★★★</span>
                  </div>
                  <p>Exceeded my expectations! Fast delivery and great build quality.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;