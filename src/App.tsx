import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Marquee from './components/Marquee';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Journal from './pages/Journal';
import About from './pages/About';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isCheckout = pathname.startsWith('/checkout');
  return (
    <>
      {!isCheckout && <Marquee />}
      {!isCheckout && <Header />}
      <main>{children}</main>
      {!isCheckout && <Footer />}
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderNumber" element={<OrderConfirmation />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </CartProvider>
    </HashRouter>
  );
}
