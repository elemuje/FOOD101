import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { foodItems, formatPrice } from '@/lib/data';
import { ChefHat, TrendingUp, ShoppingBag, Users, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = ['Orders','Menu','Analytics'];

export function AdminPage() {
  const { orders, advanceStatus } = useOrders();
  const { user } = useAuth();
  const [tab, setTab] = useState('Orders');
  const [menuItems, setMenuItems] = useState(foodItems.map(f => ({ ...f, available: f.isAvailable })));

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;

  const toggleAvailable = (id) =>
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    preparing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'out-for-delivery': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-food-orange to-food-red rounded-full flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kitchen Dashboard</h1>
            <p className="text-sm text-gray-500">Hello, {user?.name || 'Admin'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: 'text-food-orange' },
            { icon: TrendingUp, label: 'Revenue', value: formatPrice(revenue), color: 'text-green-500' },
            { icon: Clock, label: 'Active', value: activeOrders.length, color: 'text-blue-500' },
            { icon: Users, label: 'Avg Order', value: formatPrice(avgOrder), color: 'text-purple-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No orders yet. <Link to="/menu" className="text-food-orange">Place a test order</Link></p>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div key={order.id} layout className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">#{order.id}</p>
                      <p className="text-xs text-gray-500">{new Date(order.placedAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor[order.status] || ''}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-food-orange">{formatPrice(order.total)}</span>
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => advanceStatus(order.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-food-orange to-food-red text-white px-3 py-2 rounded-full hover:opacity-90 transition-opacity"
                      >
                        Advance Status <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle className="w-3 h-3" /> Delivered</span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {tab === 'Menu' && (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.category} · {formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {item.available ? 'Available' : 'Out of stock'}
                  </span>
                  <button
                    onClick={() => toggleAvailable(item.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${item.available ? 'bg-food-orange' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Analytics' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Orders by category</h3>
              {['rice','soup','swallow','protein','snacks','drinks','breakfast'].map((cat) => {
                const count = orders.reduce((s, o) => s + o.items.filter(i => i.category === cat).length, 0);
                const max = 10;
                return (
                  <div key={cat} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-gray-500 w-20 capitalize">{cat}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-food-orange to-food-red h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (count / max) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-4">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order status breakdown</h3>
              {['pending','confirmed','preparing','ready','out-for-delivery','delivered'].map((s) => {
                const cnt = orders.filter(o => o.status === s).length;
                return (
                  <div key={s} className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor[s] || ''}`}>{s.replace('-',' ')}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
