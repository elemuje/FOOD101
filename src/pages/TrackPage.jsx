import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '@/hooks/useOrders';
import { orderStatuses, formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, MessageCircle, Bike, Clock, CheckCircle2, Star, Package, ChefHat, ClipboardList, Home, RefreshCw } from 'lucide-react';

const STATUS_ICONS = {
  pending: ClipboardList,
  confirmed: CheckCircle2,
  preparing: ChefHat,
  ready: Package,
  'out-for-delivery': Bike,
  delivered: Home,
};

const STATUS_PROGRESS = {
  pending: 5,
  confirmed: 22,
  preparing: 44,
  ready: 66,
  'out-for-delivery': 84,
  delivered: 100,
};

export function TrackPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders, advanceStatus } = useOrders();
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(35);

  const order = orderId ? orders.find((o) => o.id === orderId) : orders[0];

  useEffect(() => {
    if (!order) return;
    const target = STATUS_PROGRESS[order.status] || 0;
    const t = setTimeout(() => setProgress(target), 400);
    return () => clearTimeout(t);
  }, [order?.status]);

  // countdown
  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const t = setInterval(() => setEta((p) => Math.max(0, p - 1)), 60000);
    return () => clearInterval(t);
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <Bike className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active order</h2>
          <p className="text-gray-500 mb-6">Place an order and track it here in real time</p>
          <Link to="/menu">
            <Button className="bg-gradient-to-r from-food-orange to-food-red rounded-full text-white">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = orderStatuses.find((s) => s.id === order.status);
  const isDelivered = order.status === 'delivered';
  const steps = orderStatuses.map((s, i) => {
    const stepIndex = orderStatuses.findIndex((x) => x.id === order.status);
    return {
      ...s,
      completed: i <= stepIndex,
      current: s.id === order.status,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-6 pb-24 lg:pb-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Track Order</h1>
          {/* Demo: advance status */}
          {!isDelivered && (
            <button
              onClick={() => advanceStatus(order.id)}
              className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 hover:border-food-orange hover:text-food-orange transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Simulate update
            </button>
          )}
        </div>

        {/* Status hero */}
        <motion.div
          key={order.status}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 text-white mb-5 relative overflow-hidden ${isDelivered ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-food-orange to-food-red'}`}
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm mb-0.5">Order #{order.id}</p>
                <h2 className="text-2xl font-bold">{currentStatus?.label}</h2>
                <p className="text-white/80 text-sm mt-1">{currentStatus?.description}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                {isDelivered ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <Bike className="w-7 h-7" />
                )}
              </div>
            </div>
            {!isDelivered && (
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-white/80" />
                <span className="font-semibold">~{eta} min{eta !== 1 ? 's' : ''} away</span>
              </div>
            )}
            {isDelivered && (
              <p className="text-white/90 font-medium mb-4">Delivered at {new Date(order.timeline[order.timeline.length - 1]?.time).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</p>
            )}
            {/* Progress bar */}
            <div className="bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="bg-white h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Driver card */}
        {!isDelivered && order.driver && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Delivery Partner</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-food-orange to-food-red rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {order.driver.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.driver.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-medium">{order.driver.rating}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{order.driver.vehicle}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.driver.phone}`}
                  className="w-10 h-10 bg-food-orange/10 rounded-full flex items-center justify-center text-food-orange hover:bg-food-orange hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
                <button className="w-10 h-10 bg-food-orange/10 rounded-full flex items-center justify-center text-food-orange hover:bg-food-orange hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Map placeholder */}
        {!isDelivered && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-4 h-40 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-food-orange/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-6 h-6 text-food-orange" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Live map</p>
                <p className="text-xs text-gray-400">Connect Leaflet.js + backend</p>
              </div>
            </div>
            {/* Animated rider dot */}
            <motion.div
              animate={{ x: [0, 40, 80, 120, 80], y: [0, -10, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/4 w-6 h-6 bg-food-orange rounded-full flex items-center justify-center shadow-lg"
            >
              <Bike className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
        )}

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Order Timeline</h3>
          <div className="space-y-1">
            {steps.map((step, i) => {
              const Icon = STATUS_ICONS[step.id] || CheckCircle2;
              const timeEntry = order.timeline?.find((t) => t.status === step.id);
              return (
                <div key={step.id} className="flex items-start gap-3 relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-6 ${step.completed ? 'bg-food-orange' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    step.current ? 'bg-food-orange text-white shadow-md shadow-food-orange/30' :
                    step.completed ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${step.current ? 'text-food-orange' : step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {step.label}
                        {step.current && (
                          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="ml-2 text-xs">●</motion.span>
                        )}
                      </p>
                      {timeEntry && (
                        <span className="text-xs text-gray-400">
                          {new Date(timeEntry.time).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order items */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Your Order</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.name} ×{item.quantity}</span>
                <span className="text-gray-700 dark:text-gray-300">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 flex justify-between font-bold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-food-orange">{formatPrice(order.total)}</span>
          </div>
          {isDelivered && (
            <Link to="/orders" className="block mt-3">
              <Button className="w-full bg-gradient-to-r from-food-orange to-food-red rounded-full text-white text-sm">
                Rate your order
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
