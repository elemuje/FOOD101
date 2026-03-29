import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { ReviewModal } from '@/components/shared/ReviewModal';
import { CheckCircle, ShoppingBag, ArrowRight, Star, RotateCcw } from 'lucide-react';
import { foodItems } from '@/lib/data';

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'out-for-delivery': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export function OrdersPage() {
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';
  const orderId = searchParams.get('orderId');
  const [showSuccessMsg, setShowSuccessMsg] = useState(showSuccess);
  const [reviewItem, setReviewItem] = useState(null);
  const { orders } = useOrders();

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccessMsg(false), 6000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatePresence>
          {showSuccessMsg && (
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="bg-green-500 text-white rounded-2xl p-4 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Order Placed! 🎉</h3>
                <p className="text-green-100 text-sm">#{orderId} is being prepared</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <Link to="/menu"><Button variant="outline" className="rounded-full text-sm">Browse Menu</Button></Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your order history will appear here</p>
            <Link to="/menu"><Button className="bg-gradient-to-r from-food-orange to-food-red rounded-full text-white">Order now</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">#{order.id}</p>
                    <p className="text-xs text-gray-500">{new Date(order.placedAt).toLocaleString('en-NG')}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor[order.status] || ''}`}>
                    {order.status.replace('-', ' ')}
                  </span>
                </div>

                <div className="space-y-0.5 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{item.name} ×{item.quantity}</span>
                      <span className="text-gray-700 dark:text-gray-300">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 flex-wrap gap-2">
                  <span className="font-bold text-food-orange text-lg">{formatPrice(order.total)}</span>
                  <div className="flex gap-2 flex-wrap">
                    {order.status !== 'delivered' && (
                      <Link to={`/track?orderId=${order.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-food-orange to-food-red rounded-full text-white text-xs h-8 px-3">
                          Track <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => {
                          const firstItem = foodItems.find(f => f.name === order.items[0]?.name);
                          if (firstItem) setReviewItem(firstItem);
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-food-orange border border-food-orange/30 rounded-full h-8 px-3 hover:bg-food-orange/10 transition-colors"
                      >
                        <Star className="w-3 h-3" /> Review
                      </button>
                    )}
                    <button className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full h-8 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <RotateCcw className="w-3 h-3" /> Reorder
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {reviewItem && <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} />}
    </div>
  );
}
