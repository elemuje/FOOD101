import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PromoBanner } from '@/components/shared/PromoBanner';
import { FloatingCartButton } from '@/components/shared/FloatingCartButton';
import { InstallBanner } from '@/components/shared/InstallBanner';

import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { TrackPage } from '@/pages/TrackPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoyaltyPage } from '@/pages/LoyaltyPage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PromoBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
      <FloatingCartButton />
      <InstallBanner />
    </div>
  );
}

function App() {
  const { theme, initTheme } = useTheme();

  useEffect(() => {
    initTheme(theme);
  }, []);

  return (
    <Routes>
      {/* Auth — no chrome */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Full app */}
      <Route path="*" element={
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      } />
    </Routes>
  );
}

export default App;
