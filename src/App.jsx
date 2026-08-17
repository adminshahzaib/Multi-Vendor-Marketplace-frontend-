// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import OrdersSuccess from './pages/OrdersSuccess';
import VendorDashboard from './pages/vendor/Dashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900">
            <Navbar />
            <CartDrawer />
            <main className="flex-1">
              <Routes>
                {/* Public Storefront Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Guarded Routes */}
                <Route element={<ProtectedRoute allowedRoles={['customer', 'vendor']} />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/ordersuccess" element={<OrdersSuccess />} />
                </Route>

                {/* Vendor Exclusive Merchant Routes */}
                <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;