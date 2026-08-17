import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-sm font-extrabold">MV</span>
              Marketplace
            </Link>
            <p className="text-sm text-slate-400 leading-6">
              Discover quality products from trusted vendors with a smooth shopping experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Shop</h3>
            <div className="space-y-3 text-sm">
              <Link to="/catalog" className="block text-slate-400 hover:text-white transition">
                Explore Products
              </Link>
              <Link to="/cart" className="block text-slate-400 hover:text-white transition">
                Shopping Cart
              </Link>
              <Link to="/register" className="block text-slate-400 hover:text-white transition">
                Become a Vendor
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
            <div className="space-y-3 text-sm">
              <Link to="/login" className="block text-slate-400 hover:text-white transition">
                Log In
              </Link>
              <Link to="/register" className="block text-slate-400 hover:text-white transition">
                Create Account
              </Link>
              <Link to="/account" className="block text-slate-400 hover:text-white transition">
                My Account
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>Secure checkout and vendor-managed fulfillment.</p>
              <p>Email: support@mvmarketplace.com</p>
              <p>Hours: Mon - Sat, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MV Marketplace. All rights reserved.</p>
          <p>Built for customers, vendors, and growing online stores.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
