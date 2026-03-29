# FOOD 101 v2.0 — Nigerian Food Delivery App

A production-grade food ordering PWA built with Vite + React, Tailwind CSS, Framer Motion, and Zustand.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deploy

```bash
npm run build      # outputs to /dist with service worker
npm run preview    # preview production build
```

### Deploy to Vercel
1. Push to GitHub
2. Import repo at vercel.com → Framework: **Vite** (auto-detected)
3. Deploy ✅

## 🗂️ Project Structure

```
food-101/
├── public/
│   ├── favicon.svg
│   ├── icon-192.png    ← add your PWA icons
│   └── icon-512.png
├── src/
│   ├── App.jsx
│   ├── main.jsx        ← HelmetProvider + Toaster
│   ├── index.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         ← Loyalty + Admin links, dark mode toggle
│   │   │   ├── Footer.jsx
│   │   │   └── MobileNav.jsx      ← Home/Menu/Cart/Rewards/Profile
│   │   ├── shared/
│   │   │   ├── PromoBanner.jsx
│   │   │   ├── FloatingCartButton.jsx
│   │   │   ├── InstallBanner.jsx  ← PWA install prompt
│   │   │   ├── ItemDetailModal.jsx ← Add-ons, sizes, reviews tab
│   │   │   ├── ReviewModal.jsx
│   │   │   └── SkeletonCard.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Badge.jsx
│   ├── hooks/
│   │   ├── useCart.js      ← Zustand persisted cart
│   │   ├── useAuth.js      ← Zustand persisted auth
│   │   ├── useTheme.js     ← Dark/light mode
│   │   ├── useOrders.js    ← Real order store with status progression
│   │   ├── useLoyalty.js   ← Points, tiers, streaks, referral codes
│   │   └── useReviews.js   ← Review store with seed data
│   ├── lib/
│   │   ├── data.js         ← 18 food items, categories, formatPrice
│   │   └── utils.js
│   └── pages/
│       ├── HomePage.jsx
│       ├── MenuPage.jsx       ← Fuse.js fuzzy search, voice search,
│       │                         skeleton loaders, item detail modal,
│       │                         sort + dietary filters
│       ├── CartPage.jsx
│       ├── CheckoutPage.jsx   ← Loyalty redemption, scheduled delivery,
│       │                         Paystack/USSD/Cash payment methods
│       ├── OrdersPage.jsx     ← Real order history, review trigger
│       ├── TrackPage.jsx      ← Live status timeline, animated progress,
│       │                         simulate status advance (demo)
│       ├── ProfilePage.jsx    ← Loyalty stats, quick nav, theme toggle
│       ├── LoyaltyPage.jsx    ← Points dashboard, referral code, tier perks
│       ├── AdminPage.jsx      ← Orders queue, menu toggle, analytics
│       ├── LoginPage.jsx      ← Phone OTP + Email modes, guest checkout
│       ├── SignupPage.jsx
│       └── NotFoundPage.jsx
├── index.html            ← OG tags, Twitter Card, Apple PWA meta
├── vite.config.js        ← PWA plugin, service worker, image cache
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Vite 5 + vite-plugin-pwa | Build + PWA/offline |
| React 18 + React Router 6 | UI + routing |
| Tailwind CSS 3 | Styling |
| Framer Motion 11 | Animations |
| Zustand 4 | State (persisted) |
| Fuse.js | Fuzzy search |
| react-hot-toast | Toast notifications |
| react-helmet-async | SEO meta tags |
| Lucide React | Icons |

## ✨ Features v2.0

### 📱 Mobile-first PWA
- Installable on iOS/Android (Add to Homescreen prompt)
- Service worker caches all assets + Unsplash images
- Works offline — menu browsable without internet
- Safe-area padding for iOS notch/home indicator
- 48px minimum touch targets throughout
- Smooth scroll momentum on category pills

### 🔍 Smart Menu
- Fuzzy search with Fuse.js (typo-tolerant, multi-field)
- Voice search via Web Speech API
- Skeleton loaders while fetching
- Item detail modal with add-ons, portion sizes, reviews tab
- Sort by: popular, price, rating, prep time
- Dietary filters: spicy, healthy, traditional, affordable

### 💳 Checkout
- Paystack, USSD *737#, and Cash on Delivery options
- Scheduled delivery (date + time picker)
- Loyalty points redemption at checkout
- Points earned shown before placing order
- Toast confirmation + real order ID

### 🎁 Loyalty & Rewards
- ₦1 spent = 1 point
- 100 points = ₦50 off
- Tiers: Bronze → Silver → Gold
- Daily ordering streak tracking
- Referral code with native share
- Birthday bonus (extensible)

### 📦 Real Order Tracking
- Orders persist in localStorage via Zustand
- Status timeline with timestamps
- Animated rider position on map placeholder
- "Simulate update" button for demo/testing
- ETA countdown timer

### 🖥 Kitchen Dashboard (/admin)
- Live order queue with status advancement
- Menu availability toggle (per-item)
- Category + status breakdown charts

### 🔐 Auth
- Phone OTP mode (6-box input, Nigerian standard)
- Email + password mode
- Guest checkout (no account required)

### 🌍 SEO + Shareability
- Open Graph + Twitter Card meta tags
- Per-page title support (react-helmet-async)
- WhatsApp share on referral codes

## 🔧 Next Steps (connect real backend)

```
1. Replace useOrders mock → POST /api/orders
2. Replace useAuth mock  → Termii SMS OTP API
3. Replace Paystack mock → paystack.com/developers
4. Replace map placeholder → Leaflet.js + WebSocket rider location
5. Replace useReviews    → GET/POST /api/reviews
6. Add Cloudinary URLs   → replace Unsplash for production images
```
