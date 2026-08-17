// src/components/product/ProductCard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { from: `/product/${product._id || product.id}` } });
      return;
    }

    if (outOfStock) return;

    const result = addToCart(product);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col overflow-hidden">
      
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
        />
        {product.originalPrice > product.price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
            SAVE ${Math.round(product.originalPrice - product.price)}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor Badge */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{product.category}</span>
            <span className="font-medium text-blue-600">{product.vendor?.name}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product._id || product.id}`} className="block">
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
            <span>★ {product.rating}</span>
            <span className="text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-slate-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="bg-slate-900 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
          >
            {outOfStock ? 'Out of Stock' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;