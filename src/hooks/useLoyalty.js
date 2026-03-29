import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoyalty = create(
  persist(
    (set, get) => ({
      points: 0,
      tier: 'Bronze',
      referralCode: `FOOD${Math.random().toString(36).substring(2,7).toUpperCase()}`,
      streak: 0,
      lastOrderDate: null,

      addPoints: (amount) => {
        const earned = Math.floor(amount / 100);
        set((state) => {
          const newPoints = state.points + earned;
          return { points: newPoints, tier: getTier(newPoints) };
        });
        return earned;
      },

      redeemPoints: (pointsToRedeem) => {
        set((state) => ({
          points: Math.max(0, state.points - pointsToRedeem),
        }));
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastOrderDate;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        set((state) => ({
          streak: last === yesterday ? state.streak + 1 : 1,
          lastOrderDate: today,
        }));
      },

      getDiscount: () => {
        const points = get().points;
        return Math.floor(points / 100) * 50;
      },
    }),
    { name: 'food101-loyalty' }
  )
);

function getTier(points) {
  if (points >= 5000) return 'Gold';
  if (points >= 2000) return 'Silver';
  return 'Bronze';
}
