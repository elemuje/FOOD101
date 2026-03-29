import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useLoyalty } from '@/hooks/useLoyalty';
import { formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreditCard, MapPin, Phone, User, Truck, Wallet, CheckCircle, Clock, Gift, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'paystack', icon: CreditCard, label: 'Card / Bank Transfer', desc: 'Paystack secure checkout', badge: 'Most popular' },
  { id: 'ussd', icon: Smartphone, label: 'USSD *737#', desc: 'No internet needed' },
  { id: 'cash', icon: Wallet, label: 'Cash on Delivery', desc: 'Pay when delivered' },
];

const DELIVERY_TIMES = [
  { id: 'now', label: 'Deliver now', desc: '25–45 mins', icon: Truck },
  { id: 'scheduled', label: 'Schedule', desc: 'Pick a time', icon: Clock },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { points, redeemPoints, getDiscount, addPoints, updateStreak } = useLoyalty();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [deliveryType, setDeliveryType] = useState('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notes: '',
  });

  const deliveryFee = 500;
  const subtotal = getTotalPrice();
  const pointsDiscount = usePoints ? getDiscount() : 0;
  const total = Math.max(0, subtotal + deliveryFee - pointsDiscount);
  const pointsToEarn = Math.floor(total / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all delivery details');
      return;
    }
    setIsProcessing(true);

    if (paymentMethod === 'paystack') {
      toast.loading('Opening Paystack…', { duration: 1500 });
    }

    await new Promise((r) => setTimeout(r, 2000));

    const orderId = placeOrder({ items, total, deliveryFee, formData, paymentMethod });
    if (usePoints) redeemPoints(Math.floor(pointsDiscount / 50) * 100);
    addPoints(total);
    updateStreak();
    clearCart();

    toast.success('Order placed! 🎉', { duration: 3000 });
    navigate(`/orders?success=true&orderId=${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your cart is empty</h2>
          <Link to="/menu"><Button className="bg-gradient-to-r from-food-orange to-food-red rounded-full text-white">Browse Menu</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-6 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Delivery type */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Delivery time</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {DELIVERY_TIMES.map(({ id, label, desc, icon: Icon }) => (
                  <button key={id} onClick={() => setDeliveryType(id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${deliveryType === id ? 'border-food-orange bg-food-orange/5' : 'border-gray-200 dark:border-gray-700'}`}>
                    <Icon className={`w-5 h-5 flex-shrink-0 ${deliveryType === id ? 'text-food-orange' : 'text-gray-400'}`} />
                    <div>
                      <p className={`text-sm font-medium ${deliveryType === id ? 'text-food-orange' : 'text-gray-900 dark:text-white'}`}>{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {deliveryType === 'scheduled' && (
                <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} min={new Date(Date.now() + 30 * 60000).toISOString().slice(0,16)} className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white" />
              )}
            </motion.div>

            {/* Delivery details */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                <Truck className="w-4 h-4 text-food-orange" /> Delivery details
              </h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Full name</label>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-9 h-11" placeholder="John Doe" /></div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                    <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-9 h-11" placeholder="+234 803 123 4567" /></div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Delivery address</label>
                  <div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:ring-2 focus:ring-food-orange focus:border-transparent" rows={2} placeholder="Your delivery address in Ilorin…" /></div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes (optional)</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:ring-2 focus:ring-food-orange focus:border-transparent" rows={2} placeholder="Gate colour, nearest landmark, etc." />
                </div>
              </form>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-food-orange" /> Payment
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ id, icon: Icon, label, desc, badge }) => (
                  <button key={id} onClick={() => setPaymentMethod(id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${paymentMethod === id ? 'border-food-orange bg-food-orange/5' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'bg-food-orange/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <Icon className={`w-5 h-5 ${paymentMethod === id ? 'text-food-orange' : 'text-gray-500'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                        {badge && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{badge}</span>}
                      </div>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    {paymentMethod === id && <CheckCircle className="w-5 h-5 text-food-orange flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 sticky top-24 space-y-4">
              <h2 className="font-bold text-gray-900 dark:text-white">Order summary</h2>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate pr-2">{item.name} ×{item.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
                {pointsDiscount > 0 && usePoints && (
                  <div className="flex justify-between text-green-600"><span>Points discount</span><span>−{formatPrice(pointsDiscount)}</span></div>
                )}
              </div>

              {/* Loyalty redemption */}
              {points >= 100 && (
                <div className="bg-food-orange/5 border border-food-orange/20 rounded-xl p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${usePoints ? 'bg-food-orange border-food-orange' : 'border-gray-300'}`}>
                      {usePoints && <span className="text-white text-xs">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-food-orange" /> Use {points} points
                      </p>
                      <p className="text-xs text-gray-500">Save {formatPrice(getDiscount())}</p>
                    </div>
                  </label>
                </div>
              )}

              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                  <span>Total</span><span className="text-food-orange">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">+{pointsToEarn} pts after this order</p>
              </div>

              <button form="checkout-form" type="submit" disabled={isProcessing} className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-full text-base disabled:opacity-60">
                {isProcessing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>Place Order · {formatPrice(total)}</>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
