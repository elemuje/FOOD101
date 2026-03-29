import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateOrderId } from '@/lib/data';

const STATUSES = ['pending','confirmed','preparing','ready','out-for-delivery','delivered'];

export const useOrders = create(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: ({ items, total, deliveryFee, formData, paymentMethod }) => {
        const order = {
          id: generateOrderId(),
          items,
          total,
          deliveryFee,
          formData,
          paymentMethod,
          status: 'pending',
          statusIndex: 0,
          placedAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 35 * 60000).toISOString(),
          timeline: [{ status: 'pending', time: new Date().toISOString(), label: 'Order placed' }],
          driver: {
            name: 'Abdul Ibrahim',
            phone: '+234 805 123 4567',
            rating: 4.9,
            vehicle: 'Motorcycle – ABC 123 XY',
          },
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order.id;
      },

      advanceStatus: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId) return o;
            const nextIndex = Math.min(o.statusIndex + 1, STATUSES.length - 1);
            const nextStatus = STATUSES[nextIndex];
            return {
              ...o,
              status: nextStatus,
              statusIndex: nextIndex,
              timeline: [
                ...o.timeline,
                { status: nextStatus, time: new Date().toISOString(), label: nextStatus },
              ],
            };
          }),
        }));
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'food101-orders' }
  )
);
