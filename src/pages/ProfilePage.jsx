import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, MapPin, Edit2, LogOut, Camera, Gift, ShoppingBag, Star, ChevronRight, Moon, Sun, Shield } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { points, tier, streak } = useLoyalty();
  const { orders } = useOrders();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Sign In</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Sign in to view your profile and orders</p>
          <Link to="/login"><Button className="bg-gradient-to-r from-food-orange to-food-red rounded-full text-white px-8">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const handleSave = () => { updateUser(formData); setIsEditing(false); };

  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-8 pb-24 lg:pb-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>

        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-food-orange to-food-red rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 dark:bg-gray-600 text-white rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{user?.name}</h2>
              <p className="text-gray-500 text-sm truncate">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-food-orange/10 text-food-orange px-2 py-0.5 rounded-full font-medium">{tier} Member</span>
                {streak > 1 && <span className="text-xs text-gray-500">🔥 {streak}d streak</span>}
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="flex-shrink-0 p-2 text-gray-400 hover:text-food-orange transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: ShoppingBag, label: 'Orders', value: orders.length },
            { icon: Gift, label: 'Points', value: points.toLocaleString() },
            { icon: Star, label: 'Delivered', value: deliveredOrders },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700">
              <Icon className="w-4 h-4 text-food-orange mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-[11px] text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Edit form */}
        {isEditing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Edit Information</h3>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Full Name', icon: User, type: 'text' },
                { key: 'email', label: 'Email', icon: Mail, type: 'email' },
                { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
                { key: 'address', label: 'Address', icon: MapPin, type: 'text' },
              ].map(({ key, label, icon: Icon, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input type={type} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="pl-9 h-10 text-sm" />
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-food-orange to-food-red rounded-full text-white text-sm h-10">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 rounded-full text-sm h-10">Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
          {[
            { to: '/loyalty', icon: Gift, label: 'Rewards & Loyalty', desc: `${points} points · ${tier}`, color: 'text-food-orange' },
            { to: '/orders', icon: ShoppingBag, label: 'My Orders', desc: `${orders.length} orders placed`, color: 'text-blue-500' },
            { to: '/admin', icon: Shield, label: 'Kitchen Dashboard', desc: 'Manage orders & menu', color: 'text-purple-500' },
          ].map(({ to, icon: Icon, label, desc, color }, i, arr) => (
            <Link key={to} to={to} className={`flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${i < arr.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
              <div className={`w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-500 truncate">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </motion.div>

        {/* Settings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Appearance</p>
              <p className="text-xs text-gray-500 capitalize">{theme} mode</p>
            </div>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${theme === 'dark' ? 'bg-food-orange' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </motion.div>

        {/* Sign out */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 dark:border-red-900/40 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
