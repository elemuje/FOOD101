import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const seed = [
  { id:'r1', itemId:'1', userName:'Adeola W.', rating:5, text:'Best Jollof in Ilorin! Hot and fresh every time.', date:'2024-03-15', verified:true },
  { id:'r2', itemId:'6', userName:'Emmanuel O.', rating:5, text:'Egusi is on point. The assorted meat is generous!', date:'2024-03-10', verified:true },
  { id:'r3', itemId:'4', userName:'Fatima A.', rating:5, text:'Smoothest pounded yam I have had. Perfect with egusi.', date:'2024-03-08', verified:true },
  { id:'r4', itemId:'10', userName:'Chidi N.', rating:4, text:'Suya is amazing, could be a bit spicier though.', date:'2024-03-05', verified:true },
  { id:'r5', itemId:'1', userName:'Blessing T.', rating:5, text:'Ordered 3 times already. Consistent quality!', date:'2024-03-01', verified:true },
];

export const useReviews = create(
  persist(
    (set, get) => ({
      reviews: seed,

      addReview: ({ itemId, rating, text, userName }) => {
        const review = {
          id: `r${Date.now()}`,
          itemId,
          userName: userName || 'Anonymous',
          rating,
          text,
          date: new Date().toISOString().split('T')[0],
          verified: true,
        };
        set((state) => ({ reviews: [review, ...state.reviews] }));
      },

      getItemReviews: (itemId) => get().reviews.filter((r) => r.itemId === itemId),

      getItemRating: (itemId) => {
        const reviews = get().reviews.filter((r) => r.itemId === itemId);
        if (!reviews.length) return null;
        return +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
      },
    }),
    { name: 'food101-reviews' }
  )
);
