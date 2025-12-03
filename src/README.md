# Epicure Cafe - Loyalty Program & Menu Website

A dynamic cafe website with gamified loyalty program, featuring 3D floating menu items, customer progress tracking, and barista purchase logging.

## 🎯 Features

### Landing Page
- Animated logo with blend effects
- Split text animation ("Epicure" slides from left, "Cafe" from right)
- Scroll-triggered motto section with scale/opacity effects
- Smooth scroll indicator
- Full menu display with 3D floating animations

### Authentication
- Phone number + OTP login system (Demo Mode)
- Automatic user registration for new customers
- Persistent sessions using localStorage

### Customer Dashboard
- **4 Gamified Roadmaps:**
  - ☕ Hot Drinks Explorer (3 drinks)
  - 🧊 Cold Drinks Fan (3 drinks)
  - 🍦 Sweet Tooth (3 milkshakes)
  - 👑 Epicure Master (8 drinks across all categories)
- Progress tracking with visual progress bars
- Badge collection system
- Reward redemption
- Menu view toggle
- Logout functionality

### Barista Dashboard
- Customer lookup by phone number
- Quick purchase logging
- Automatic progress updates
- Real-time badge unlocking notifications
- Multi-item purchase support

### Menu
- **50 Items across 4 categories:**
  - Hot Drinks (25 items)
  - Cold Drinks (8 items)
  - Milkshakes (5 items)
  - Tea (5 items)
- 3D floating animations with:
  - Continuous bobbing motion
  - Magical glow effects
  - Particle effects
  - Dynamic shadows
  - Interactive hover states

## 🎨 Design

**Color Scheme:**
- Primary Dark: `#1a2f2a`
- Primary Light: `#a8c5a0`
- Accent: `#d4e4d0`

**Typography:**
- Headings: Mr Stalwart (custom font)
- Bold Text: Impact, Arial Black
- Body: System default

## 💾 Data Storage

**Currently:** Uses `localStorage` (browser storage) for demo mode
- User accounts: `user_{phoneNumber}`
- Progress: `progress_{phoneNumber}`
- Badges: `badges_{phoneNumber}`
- Rewards: `rewards_{phoneNumber}`

**Note:** This is NOT connected to Supabase database. All data is stored locally in your browser and will be lost when you clear browser data.

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- **Epicure Logo Image** (see setup below)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd epicure-cafe
```

2. **🎨 CRITICAL: Add the Epicure Logo**
   
   The app will NOT display properly without the logo file.
   
   **Steps:**
   - Take the circular green Epicure logo image (with coffee cup and leaves)
   - Rename it to: `epicure-logo.png`
   - Place it in: `/public/epicure-logo.png`
   
   **Expected file:** `/public/epicure-logo.png`

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

📖 **Detailed Setup Instructions:** See [SETUP.md](SETUP.md) for troubleshooting

## 🧪 Testing the App

### Login (Demo Mode)
1. Click "Login" button in top right
2. Enter ANY phone number (e.g., 1234567890)
3. Click "Send OTP"
4. Enter ANY 6-digit code (e.g., 123456)
5. If new user: Enter your name to register
6. If existing user: You'll be logged in automatically

### Customer Experience
1. After login, you'll see your dashboard with 4 roadmaps
2. Check your progress on each roadmap
3. Toggle to "Menu" view to see all items
4. Logout when done

### Barista Testing
1. Click the user icon (👥) in top right corner
2. Enter a customer's phone number
3. Click "Search"
4. Select purchased items from the menu
5. Click "Save Purchase"
6. System automatically:
   - Updates customer progress
   - Awards badges when roadmaps complete
   - Shows celebration notifications

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (optimized)
- Tablets
- Mobile phones

## 🔧 Technology Stack

- **Frontend:** React 18+ with TypeScript
- **Animations:** Motion (Framer Motion)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **UI Components:** shadcn/ui
- **Storage:** localStorage (demo mode)
- **Build Tool:** Vite

## 📂 Project Structure

```
epicure-cafe/
├── App.tsx                      # Main app component & routing
├── components/
│   ├── AboutSection.tsx         # About us section
│   ├── MenuSection.tsx          # 3D animated menu display
│   ├── LoginPage.tsx            # Phone + OTP authentication
│   ├── CustomerDashboard.tsx    # Customer progress & roadmaps
│   ├── BaristaDashboard.tsx     # Staff purchase logging
│   ├── ui/                      # shadcn UI components
│   └── figma/
│       └── ImageWithFallback.tsx
├── data/
│   └── menuData.ts              # All 50 menu items
├── styles/
│   └── globals.css              # Global styles & fonts
└── README.md
```

## 🎮 Roadmap System

### How It Works:
1. Each roadmap has specific drinks that must be purchased
2. When barista logs a purchase, system checks all roadmaps
3. Progress updates automatically
4. When all items in a roadmap are purchased, badge is awarded
5. Rewards become available in customer dashboard

### Current Roadmaps:
- **Hot Drinks Explorer:** Latte, Cappuccino Med, Americano → Free Latte
- **Cold Drinks Fan:** Cold Brew, Iced Americano, Iced Tea → Free Cold Brew
- **Sweet Tooth:** Chocolate Shake, Strawberry Shake, Mango → Free Milkshake
- **Epicure Master:** 8 drinks from all categories → Free drink of choice

## 🐛 Known Issues & Solutions

### Logo Not Visible (Blending with Background)
✅ **Fixed:** Removed `mixBlendMode: 'screen'` and added brightness/contrast filters to make logo stand out on dark background. See [LOGO_FIX.md](LOGO_FIX.md) for details.

### Logo File Requirements
⚠️ **Important:** Your logo file should be bright/light colored to show well on the dark green background. If your logo is too dark, consider:
- Using a lighter version of the logo
- Adding brightness in an image editor
- Using a version optimized for dark backgrounds

### Database Not Connected
ℹ️ **By Design:** Currently using localStorage for demo purposes. To connect to Supabase:
1. Set up Supabase project
2. Configure environment variables
3. Implement backend API routes
4. Update frontend to use API calls instead of localStorage

## 🔮 Future Enhancements

- [ ] Connect to Supabase backend for real data persistence
- [ ] Add payment integration for online orders
- [ ] Implement real SMS OTP authentication
- [ ] Add order history tracking
- [ ] Create admin panel for menu management
- [ ] Add social login (Google, Facebook)
- [ ] Implement push notifications for rewards
- [ ] Add table reservation system

## 📄 License

All rights reserved © 2025 Epicure Cafe

## 🙋‍♂️ Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Epicure Cafe**
