import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import RiddhiChatbot from './components/RiddhiChatbot';

import Home from './pages/Home';
import Collections from './pages/Collections';
import CollectionProducts from './pages/CollectionProducts';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminMessages from './pages/admin/AdminMessages';
import UserOrders from './pages/user/UserOrders';
import UserProfile from './pages/user/UserProfile';
import BlogPost from './pages/BlogPost';

import { AdminLayout } from './pages/admin/AdminDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCollections from './pages/admin/AdminCollections';
import { AdminOrders, AdminUsers } from './pages/admin/AdminOrdersUsers';

const noNavRoutes = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];

// ✅ ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const path = window.location.pathname;
  const isAdmin = path.startsWith('/admin');
  const hideNav = noNavRoutes.some(r => path.startsWith(r));

  return (
    <>
      <ScrollToTop />  {/* ✅ Har page pe top se shuru */}
      {!isAdmin && !hideNav && <Navbar />}
      {!isAdmin && <CartSidebar />}
      <Toaster position="top-right" toastOptions={{
        style: { background: '#111', color: '#fff', border: '1px solid #2a2a2a', borderRadius: '10px' },
        success: { iconTheme: { primary: '#d4af37', secondary: '#000' } },
      }} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<CollectionProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected */}
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/user/orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
        <Route path="/user/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>

      {!isAdmin && !hideNav && <Footer />}
      {!isAdmin && <RiddhiChatbot />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}