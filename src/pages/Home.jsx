// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await API.get('/products', {
          params: { sort: 'rating' },
        });
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const CATEGORIES = ['All', 'Electronics', 'Apparel', 'Home & Kitchen', 'Books'];
  const VENDORS = [
    { id: 1, name: 'Apex Gadgets', sales: '1.2k', rating: 4.9 },
    { id: 2, name: 'Urban Threads', sales: '980', rating: 4.8 },
    { id: 3, name: 'Nest & Co.', sales: '760', rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full inline-block">
              Multi-Vendor Ecosystem
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Discover Quality Gear From Top Independent Merchants.
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Shop verified products across tech, apparel, home goods, and more—all backed by our seamless checkout.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to="/catalog"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition"
              >
                Shop All Products
              </Link>
              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3 rounded-lg transition"
              >
                Become a Vendor
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm aspect-video sm:aspect-square bg-slate-800 rounded-2xl border border-slate-700 p-4 flex flex-col justify-center items-center text-center space-y-3">
            <span className="text-4xl">🛍️</span>
            <h2 className="text-lg font-bold">100% Buyer Protection</h2>
            <p className="text-xs text-gray-400">Direct order tracking, encrypted payment pipelines, and verified customer reviews.</p>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={cat === 'All' ? '/catalog' : `/catalog?category=${cat}`}
              className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg whitespace-nowrap transition"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-xs text-gray-500">Hand-selected items from our highest-rated storefronts</p>
          </div>
          <Link to="/catalog" className="text-xs font-semibold text-blue-600 hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading featured products...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No featured products available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Vendors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Featured Merchant Stores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VENDORS.map((vendor) => (
            <div key={vendor.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{vendor.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{vendor.sales}+ Sales Completed</p>
                <div className="text-xs text-amber-500 font-medium mt-2">★ {vendor.rating} / 5.0 Rating</div>
              </div>
              <Link
                to={`/catalog?vendor=${vendor.id}`}
                className="text-xs bg-gray-100 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-lg font-semibold transition"
              >
                Visit Store
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;