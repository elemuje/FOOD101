import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { foodItems, categories, formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/hooks/useCart';
import { useReviews } from '@/hooks/useReviews';
import { ItemDetailModal } from '@/components/shared/ItemDetailModal';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { Search, SlidersHorizontal, X, Star, Clock, Flame, ChevronDown, Mic, MicOff } from 'lucide-react';

const fuse = new Fuse(foodItems, {
  keys: ['name', 'description', 'tags', 'category'],
  threshold: 0.35,
  includeScore: true,
});

const SORT_OPTIONS = [
  { id: 'popular', label: 'Popular' },
  { id: 'price-asc', label: 'Price: Low' },
  { id: 'price-desc', label: 'Price: High' },
  { id: 'rating', label: 'Top rated' },
  { id: 'fastest', label: 'Fastest' },
];

const DIET_FILTERS = ['spicy','healthy','traditional','affordable'];

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [dietFilter, setDietFilter] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const { addItem } = useCart();
  const { getItemRating } = useReviews();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const startVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-NG';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setSearchQuery(e.results[0][0].transcript);
    recognition.start();
  }, []);

  const handleCategory = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(catId !== 'all' ? { category: catId } : {});
  };

  const toggleDiet = (tag) =>
    setDietFilter((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  let results = searchQuery.length > 1
    ? fuse.search(searchQuery).map((r) => r.item)
    : foodItems;

  results = results.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchPrice = item.price <= maxPrice;
    const matchDiet = dietFilter.length === 0 || dietFilter.some((d) => item.tags.includes(d));
    return matchCat && matchPrice && matchDiet;
  });

  results = [...results].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fastest') return parseInt(a.prepTime) - parseInt(b.prepTime);
    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
  });

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || maxPrice < 10000 || dietFilter.length > 0 || sortBy !== 'popular';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 pb-24 lg:pb-8">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes… (try 'spicy rice')"
                className="w-full pl-9 pr-16 h-11 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-food-orange"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={startVoiceSearch}
                  className={`p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-400 hover:text-food-orange'}`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 h-11 px-4 rounded-full border text-sm font-medium transition-colors ${showFilters || hasActiveFilters ? 'bg-food-orange/10 border-food-orange text-food-orange' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 bg-food-orange rounded-full" />}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-food-orange to-food-red text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort by</p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${sortBy === opt.id ? 'bg-food-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Diet */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dietary</p>
                <div className="flex flex-wrap gap-2">
                  {DIET_FILTERS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleDiet(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${dietFilter.includes(tag) ? 'bg-food-orange text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Max price: ₦{maxPrice.toLocaleString()}
                </p>
                <input type="range" min="500" max="10000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full sm:w-64 accent-food-orange" />
              </div>
              {hasActiveFilters && (
                <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(10000); setSortBy('popular'); setDietFilter([]); setSearchParams({}); }} className="text-sm text-food-orange font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-gray-500 text-sm mb-4">
          {loading ? 'Loading...' : `${results.length} ${results.length === 1 ? 'dish' : 'dishes'}`}
          {searchQuery && <span className="text-food-orange"> for "{searchQuery}"</span>}
        </p>

        {loading ? (
          <SkeletonList count={8} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {results.map((item, index) => {
                const liveRating = getItemRating(item.id) || item.rating;
                return (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {item.isPopular && <Badge className="bg-food-orange text-white border-0 text-[10px] px-2 py-0.5">🔥 Popular</Badge>}
                        {item.tags.includes('spicy') && <Badge className="bg-red-500 text-white border-0 text-[10px] px-2 py-0.5">Spicy</Badge>}
                        {item.tags.includes('healthy') && <Badge className="bg-green-500 text-white border-0 text-[10px] px-2 py-0.5">Healthy</Badge>}
                      </div>
                    </div>
                    <div className="p-3.5">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-food-orange transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-0.5 text-yellow-500 ml-2 flex-shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-semibold">{liveRating}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mb-2 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-3">
                        <Clock className="w-3 h-3" />{item.prepTime}
                        <span>·</span><span>{item.calories} cal</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-food-orange">{formatPrice(item.price)}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); addItem(item); }}
                          className="w-8 h-8 bg-gradient-to-r from-food-orange to-food-red rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg mb-4">No dishes found</p>
            <Button variant="outline" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(10000); setDietFilter([]); }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {selectedItem && <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
