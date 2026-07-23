# Sahara Restaurant - Multi-Language Website

A modern, responsive restaurant website featuring multi-language support (Hungarian, English, Arabic), admin dashboard with CRUD operations, menu management, and PWA capabilities.

## 🌟 Features

- **Multi-Language Support**: Hungarian (default), English, and Arabic (RTL)
- **Admin Dashboard**: Complete CRUD operations for menu items and pricing
- **Auto-Save**: Changes automatically saved to database
- **Menu Management**: Dynamic menu sections with pricing in HUF and EUR
- **Payment Integration**: Revolut QR code and payment method display
- **PWA Ready**: Install as mobile app from browser
- **Responsive Design**: Mobile-first, works on all devices
- **Fast Performance**: Built with Vite, optimized bundle

## 📋 Project Structure

```
Sahara_Restaurant/
├── site/                      # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx           # Main application with admin dashboard
│   │   ├── content.ts        # Multi-language content and localization
│   │   ├── menuData.ts       # Fallback menu structure
│   │   ├── siteData.ts       # Site data fetching utilities
│   │   ├── App.css           # Styling
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets, PWA files
│   ├── vite.config.ts        # Vite configuration with API proxy
│   └── package.json
├── temp-server.cjs           # Node.js backend API server
├── site-data.json            # Central data store (source of truth)
├── package.json              # Root package configuration
└── render.yaml               # Render deployment configuration

```

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MI804-png/Sahara_Restaurant_Gergis.git
cd Sahara_Restaurant_Gergis
```

2. **Install dependencies**
```bash
npm install
cd site && npm install && cd ..
```

3. **Start backend server** (Terminal 1)
```bash
node temp-server.cjs
# Server running at http://localhost:4173
```

4. **Start frontend dev server** (Terminal 2)
```bash
cd site
npm run dev
# Visit http://localhost:5173
```

5. **Access Admin Dashboard**
- URL: `http://localhost:5173/admin`
- Username: `gorgtap`
- Password: `Sahara 612&0611`

## 🔑 Admin Credentials

**Username:** `gorgtap`  
**Password:** `Sahara 612&0611`

Environment variables (optional):
```bash
SAHARA_ADMIN_USERNAME=gorgtap
SAHARA_ADMIN_KEY=Sahara 612&0611
```

## 🌐 Website URLs

- **Public Website:** `http://localhost:5173/`
- **Admin Panel:** `http://localhost:5173/admin`
- **API Server:** `http://localhost:4173`

## 📝 Admin Features

### Dashboard Sections
1. **Opening Hours** - Manage business hours
2. **Business Details** - Location, phone, delivery status
3. **Products & Prices** - Full CRUD for menu items
4. **Offers** - Time-based discounts and promotions
5. **Sales Tracking** - Total sold products metrics
6. **Gallery Management** - Upload and manage images

### CRUD Operations
- ✅ **Create**: Add new menu items with "Add product" button
- ✅ **Read**: View all items in admin and public website
- ✅ **Update**: Edit names, prices with auto-save
- ✅ **Delete**: Remove items permanently

**Important**: Use proper keyboard input (Tab, Ctrl+A, type) to ensure React state updates for form changes.

## 💾 Data Persistence

**Site Data File:** `site-data.json`
- Central data store for all restaurant information
- Stores: hours, business details, menu sections, images, metrics
- Updated automatically when admin makes changes
- Backend API (temp-server.cjs) handles all file I/O

## 🎨 Supported Languages

- 🇭🇺 **Hungarian** (Magyar) - Default
- 🇬🇧 **English** (English)
- 🇸🇦 **Arabic** (العربية) - RTL support

Switch languages using top navigation bar buttons.

## 🏗️ Deployment on Render

### Prerequisites
- GitHub account with this repository
- Render account (https://render.com)

### Steps

1. **Push to GitHub** (Already done ✅)
```bash
git push origin main
```

2. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub and select this repository
   - Choose branch: `main`
   - Render will auto-detect configuration from `render.yaml`

3. **Set Environment Variables** (Optional)
```
SAHARA_ADMIN_USERNAME=gorgtap
SAHARA_ADMIN_KEY=Sahara 612&0611
```

4. **Auto-Deployment**
   - Render automatically deploys on `git push` to main branch
   - Build takes ~2-3 minutes
   - View logs in Render dashboard

### Build & Start Commands
The `render.yaml` file specifies:
- **Build**: `npm install && npm run build`
- **Start**: `node start-production.js`

## 🔧 API Endpoints

### Admin API
- `POST /api/admin/verify` - Verify admin credentials
- `POST /api/admin/site-data` - Save menu and business data
- `POST /api/admin/upload-image` - Upload images
- `GET /api/site-data` - Retrieve current site data

### Request Format
```bash
# Verify admin
curl -X POST http://localhost:4173/api/admin/verify \
  -H "Authorization: gorgtap:Sahara 612&0611"

# Get site data
curl http://localhost:4173/api/site-data
```

## 📱 PWA Installation

### On Desktop
1. Visit `https://your-domain.onrender.com`
2. Click address bar menu → "Install app" or "Add to home screen"
3. App installs with offline support

### On Mobile
1. Visit site in browser
2. Tap menu (⋯) → "Add to Home Screen"
3. App icon appears on home screen
4. Works offline with cached content

## 🛠️ Development Commands

```bash
# Frontend development
cd site && npm run dev

# Frontend production build
cd site && npm run build

# Lint frontend code
cd site && npm run lint

# Backend server
node temp-server.cjs

# Git operations
git add .
git commit -m "Your message"
git push origin main
```

## 📊 Menu Structure

Menu is organized in sections stored in `site-data.json`:

```json
{
  "menuSections": [
    {
      "id": "pizza",
      "title": "Pizza",
      "subtitle": "Italian classics",
      "items": [
        {
          "id": "pizza-margarita",
          "name": "Margarita",
          "priceHuf": 2500,
          "details": "tomato, basil, cheese"
        }
      ]
    }
  ]
}
```

Current menu sections:
1. Desszertek (Desserts)
2. Tészták (Pasta)
3. Választható feltételek (Optional toppings)
4. Borok (Wines)
5. Sörök (Beers)
6. Rövid italok (Shots)
7. Rostos üdítők (Fruit juices)
8. Szénsavas üdítők (Carbonated drinks)
9. Ásványvizek (Mineral water)
10. Energiaitalok (Energy drinks)
11. Pizza
12. Gyros & Kebab
13. Rántott hús (Fried meat)
14. Rántott sajt (Fried cheese)
15. Italok (Beverages)

## 🔐 Security

- Admin panel locked with credentials
- Passwords hardcoded (for this version) - consider using environment variables for production
- API endpoints require authentication headers
- CORS configured for local development

## 📦 Tech Stack

**Frontend:**
- React 19.2.6
- TypeScript
- Vite 7.3.5
- CSS3 with responsive design

**Backend:**
- Node.js (temp-server.cjs)
- Express-like API handling
- File-based JSON storage

**Deployment:**
- Render.com
- GitHub Actions (auto-deploy)
- Service Worker for PWA

## 🤝 Contributing

To make changes:
1. Clone repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request on GitHub

## 📞 Support

For issues or questions:
1. Check `site-data.json` format if changes don't appear
2. Ensure both backend and frontend servers are running
3. Clear browser cache and reload
4. Check browser console for error messages
5. Verify admin credentials in `temp-server.cjs`

## 📄 License

This project is created for Sahara Restaurant (Gergis).

## 🚢 Deployment Status

- ✅ GitHub Repository: https://github.com/MI804-png/Sahara_Restaurant_Gergis
- ⏳ Render Deployment: Ready (pending manual setup)
- ✅ PWA Ready: Yes
- ✅ Production Build: Yes

---

**Last Updated:** 2026-07-23  
**Version:** 1.0.0
