import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingCart, Gift, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/loyalty', label: 'Rewards', icon: Gift },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  // Hide bottom nav on auth pages
  if (['/login', '/signup'].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 lg:hidden z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-sm mx-auto px-2">
        {NAV.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 group"
              aria-label={item.label}>
              {isActive && (
                <motion.div layoutId="mobileNavPill"
                  className="absolute inset-x-1 top-1 h-1 bg-food-orange rounded-full" />
              )}
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-food-orange' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                <AnimatePresence>
                  {item.label === 'Cart' && cartCount > 0 && (
                    <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-food-red text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-food-orange' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
