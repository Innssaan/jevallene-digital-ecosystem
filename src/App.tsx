import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LangProvider } from './context/LangContext';
import { AboutPage } from './pages/AboutPage';
import { AuthPage } from './pages/AuthPage';
import { BlogPage } from './pages/BlogPage';
import { CatalogPage } from './pages/CatalogPage';
import { ContactPage } from './pages/ContactPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { SolutionsPage } from './pages/SolutionsPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);
  return null;
}

export function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/produk/:slug" element={<ProductDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LangProvider>
  );
}

export default App;
