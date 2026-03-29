import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Flame, Plus, Minus, ShoppingCart, Share2, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useReviews } from '@/hooks/useReviews';
import { formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/Button';

const ADD_ONS = [
  { id: 'extra-meat', label: 'Extra meat', price: 500 },
  { id: 'extra-fish', label: 'Extra fish', price: 400 },
  { id: 'extra-soup', label: 'Extra soup', price: 300 },
  { id: 'plantain', label: 'Fried plantain', price: 300 },
  { id: 'egg', label: 'Boiled egg', price: 200 },
];
const SIZES = [
  { id: 'regular', label: 'Regular', multiplier: 1 },
  { id: 'large', label: 'Large', multiplier: 1.4 },
  { id: 'family', label: 'Family', multiplier: 2 },
];

export function ItemDetailModal({ item, onClose }) {
  const { addItem } = useCart();
  const { getItemReviews } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('regular');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [wishlist, setWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const reviews = getItemReviews(item.id);
  const selectedSize = SIZES.find((s) => s.id === size);
  const addOnTotal = selectedAddOns.reduce((sum, id) => {
    const a = ADD_ONS.find((x) => x.id === id);
    return sum + (a?.price || 0);
  }, 0);
  const unitPrice = Math.round(item.price * selectedSize.multiplier) + addOnTotal;
  const total = unitPrice * quantity;

  const toggleAddOn = (id) =>
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleAdd = () => {
    addItem({ ...item, price: unitPrice, quantity });
    onClose();
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: item.name, text: item.description, url: window.location.href });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white dark:bg-gray-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Image */}
          <div className="relative h-56 flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <X className="w-5 h-5" />
            </button>
            <button onClick={() => setWishlist(!wishlist)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className={`w-5 h-5 ${wishlist ? 'text-red-400 fill-red-400' : 'text-white'}`} />
            </button>
            <button onClick={share} className="absolute top-4 left-16 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 p-5">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white pr-4">{item.name}</h2>
              <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{item.rating}</span>
                <span className="text-gray-400 text-sm">({item.reviews})</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.prepTime}</span>
              <span>{item.calories} cal</span>
              {item.tags.includes('spicy') && (
                <span className="flex items-center gap-1 text-red-500"><Flame className="w-3.5 h-3.5" />Spicy</span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4">
              {['details','reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                    activeTab === tab ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {tab} {tab === 'reviews' && `(${reviews.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'details' ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>

                {/* Size */}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Portion size</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSize(s.id)}
                        className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                          size === s.id
                            ? 'border-food-orange bg-food-orange/10 text-food-orange'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div>{s.label}</div>
                        {s.multiplier > 1 && <div className="text-xs opacity-70">×{s.multiplier}</div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Add-ons</p>
                  <div className="space-y-2">
                    {ADD_ONS.map((a) => (
                      <label key={a.id} className="flex items-center justify-between cursor-pointer py-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedAddOns.includes(a.id) ? 'bg-food-orange border-food-orange' : 'border-gray-300'
                          }`}>
                            {selectedAddOns.includes(a.id) && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{a.label}</span>
                        </div>
                        <span className="text-sm text-food-orange font-medium">+{formatPrice(a.price)}</span>
                        <input type="checkbox" className="hidden" checked={selectedAddOns.includes(a.id)} onChange={() => toggleAddOn(a.id)} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{r.userName}</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className={`w-3 h-3 ${i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{r.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-food-orange">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-food-orange">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-2xl font-bold text-food-orange flex-1 text-right">{formatPrice(total)}</span>
            </div>
            <Button onClick={handleAdd} className="w-full bg-gradient-to-r from-food-orange to-food-red rounded-full text-white py-4 text-base font-semibold flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
