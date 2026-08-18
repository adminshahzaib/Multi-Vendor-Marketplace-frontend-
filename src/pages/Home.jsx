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

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background Lighting Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column: Hero Text & Call to Action */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Multi-Vendor Marketplace
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Quality Gear From <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Independent Merchants</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Shop verified, high-grade tech, apparel, and home essentials. Experience guaranteed buyer protection with seamless checkout.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/catalog"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition duration-200 text-center"
              >
                Shop All Products
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm px-8 py-3.5 rounded-xl backdrop-blur-sm transition duration-200 text-center"
              >
                Become a Vendor
              </Link>
            </div>

            {/* Social Proof Metric Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl font-bold text-white">10k+</p>
                <p className="text-xs text-slate-400">Products Listed</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">99.8%</p>
                <p className="text-xs text-slate-400">Order Satisfaction</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">24/7</p>
                <p className="text-xs text-slate-400">Buyer Protection</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Container */}
          <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-25 transform rotate-2 pointer-events-none" />

            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-2xl backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
                <img
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop"
                  alt="Curated Marketplace Showcase"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-white">Curated Showcase</p>
                    <p className="text-[11px] text-slate-300">Verified products from top stores</p>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg font-medium">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={cat === 'All' ? '/catalog' : `/catalog?category=${cat}`}
              className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl whitespace-nowrap transition duration-200"
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
            <p className="text-xs text-slate-500">Hand-selected items from our highest-rated storefronts</p>
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
            <div key={vendor.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{vendor.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{vendor.sales}+ Sales Completed</p>
                <div className="text-xs text-amber-500 font-medium mt-2">★ {vendor.rating} / 5.0 Rating</div>
              </div>
              <Link
                to={`/catalog?vendor=${vendor.id}`}
                className="text-xs bg-slate-100 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-lg font-semibold transition"
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