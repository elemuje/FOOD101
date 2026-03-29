import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/data';
import { Gift, Star, Zap, Trophy, Copy, Check, Users } from 'lucide-react';
import { useState } from 'react';

const TIERS = [
  { name: 'Bronze', min: 0, max: 1999, color: 'from-amber-600 to-amber-800', icon: '🥉', perks: ['5% off every 5th order','Free delivery on birthdays','Early access to new dishes'] },
  { name: 'Silver', min: 2000, max: 4999, color: 'from-gray-400 to-gray-600', icon: '🥈', perks: ['10% off every 3rd order','Free delivery Fridays','Priority customer support'] },
  { name: 'Gold', min: 5000, max: Infinity, color: 'from-yellow-400 to-yellow-600', icon: '🥇', perks: ['Free delivery always','15% off all orders','Dedicated support line','Free dessert monthly'] },
];

export function LoyaltyPage() {
  const { points, tier, referralCode, streak, getDiscount } = useLoyalty();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const currentTier = TIERS.find((t) => t.name === tier) || TIERS[0];
  const nextTier = TIERS[TIERS.findIndex((t) => t.name === tier) + 1];
  const discount = getDiscount();
  const progress = nextTier ? Math.min(100, ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loyalty Rewards</h2>
          <p className="text-gray-500 mb-6">Sign in to earn points on every order</p>
          <Link to="/login" className="btn-primary inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Rewards</h1>

        {/* Points card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${currentTier.color} rounded-3xl p-6 text-white mb-6 relative overflow-hidden`}
        >
          <div className="absolute top-4 right-4 text-4xl opacity-30">{currentTier.icon}</div>
          <p className="text-white/70 text-sm mb-1">{currentTier.name} Member</p>
          <p className="text-5xl font-bold">{points.toLocaleString()}</p>
          <p className="text-white/80 text-sm mt-1">points earned</p>
          {discount > 0 && (
            <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 inline-block">
              <p className="text-sm font-semibold">Redeemable discount: {formatPrice(discount)}</p>
            </div>
          )}
          {nextTier && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{points.toLocaleString()} pts</span>
                <span>{nextTier.min.toLocaleString()} pts for {nextTier.name}</span>
              </div>
              <div className="bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          {streak > 1 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>{streak} day ordering streak! Keep it up 🔥</span>
            </div>
          )}
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Star, label: 'Points', value: points.toLocaleString() },
            { icon: Zap, label: 'Streak', value: `${streak}d` },
            { icon: Trophy, label: 'Tier', value: tier },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700">
              <Icon className="w-5 h-5 text-food-orange mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* How to earn */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Gift className="w-5 h-5 text-food-orange" /> How to earn</h3>
          <div className="space-y-3">
            {[
              { label: 'Place an order', value: '₦1 = 1 point' },
              { label: 'Write a review', value: '+50 points' },
              { label: 'Refer a friend', value: '+200 points' },
              { label: '5-day streak', value: '+100 bonus points' },
              { label: 'Birthday bonus', value: '+500 points' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-sm font-semibold text-food-orange">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Referral */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-food-orange" /> Refer a Friend</h3>
          <p className="text-sm text-gray-500 mb-4">Share your code. They get ₦500 off first order, you get 200 points.</p>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
            <span className="font-mono font-bold text-lg text-food-orange flex-1 tracking-widest">{referralCode}</span>
            <button onClick={copyCode} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-food-orange transition-colors">
              {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
          <button
            onClick={() => navigator.share?.({ title: 'FOOD 101', text: `Use my code ${referralCode} for ₦500 off your first order!`, url: window.location.origin })}
            className="w-full mt-3 py-3 rounded-full border border-food-orange text-food-orange text-sm font-semibold hover:bg-food-orange/10 transition-colors"
          >
            Share via WhatsApp / SMS
          </button>
        </motion.div>

        {/* Tier perks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Your {tier} perks</h3>
          <ul className="space-y-2">
            {currentTier.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500">✓</span> {perk}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
