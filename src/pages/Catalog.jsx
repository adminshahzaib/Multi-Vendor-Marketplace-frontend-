import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/product/ProductCard';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const vendor = searchParams.get('vendor') || '';
  const sort = searchParams.get('sort') || '';

  const [searchInput, setSearchInput] = useState(search);
  const categories = ['All', 'Electronics', 'Apparel', 'Home & Kitchen', 'Books'];

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await API.get('/products', {
          params: {
            search: search || undefined,
            category: category !== 'All' ? category : undefined,
            vendor: vendor || undefined,
            sort: sort || undefined,
          },
        });
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category, vendor, sort]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Catalog</h1>

        {(search || category !== 'All' || vendor) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {search && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                Search: {search}
              </span>
            )}
            {category !== 'All' && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                Category: {category}
              </span>
            )}
            {vendor && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                Vendor filter active
              </span>
            )}
            <button
              onClick={() => setSearchParams({})}
              className="text-red-500 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </form>

          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="">Sort By: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm font-medium">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm font-medium">
          No products found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
