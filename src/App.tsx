import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/Toast';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { AccountPage } from './pages/AccountPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { currentPath } = useApp();

  // Route selector
  const renderCurrentPage = () => {
    // Normalise path (strip trailing slash if length > 1)
    const path = currentPath.length > 1 && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

    if (path === '/' || path === '') {
      return <HomePage />;
    }
    if (path.startsWith('/menu/pizza')) {
      return <MenuPage initialCategory="pizza" />;
    }
    if (path.startsWith('/menu/burger')) {
      return <MenuPage initialCategory="burger" />;
    }
    if (path.startsWith('/menu/sandwich')) {
      return <MenuPage initialCategory="sandwich" />;
    }
    if (path === '/menu') {
      return <MenuPage initialCategory="all" />;
    }
    if (path === '/cart') {
      return <CartPage />;
    }
    if (path === '/checkout') {
      return <CheckoutPage />;
    }
    if (path === '/gallery') {
      return <GalleryPage />;
    }
    if (path === '/videos') {
      return <VideosPage />;
    }
    if (path === '/reviews') {
      return <ReviewsPage />;
    }
    if (path === '/contact') {
      return <ContactPage />;
    }
    if (path === '/auth') {
      return <CustomerAuthPage />;
    }
    if (path === '/account') {
      return <AccountPage />;
    }
    if (path === '/admin-login') {
      return <AdminLoginPage />;
    }
    if (path === '/admin') {
      return <AdminPage />;
    }

    // Default fallback to HomePage
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#1E1915] selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header */}
      <Header />

      {/* Main Page Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Customizer Modal */}
      <ProductDetailModal />

      {/* Cart Quick Drawer */}
      <CartDrawer />

      {/* Notification Toasts */}
      <ToastContainer />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
