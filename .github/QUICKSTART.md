# 🚀 Quick Start Guide

Welcome to Sahara Restaurant on GitHub! This guide will help you get started.

## 📋 What's Ready

✅ **Complete Project Structure**
- React + TypeScript frontend with Vite
- Node.js backend API server
- Multi-language support (HU/EN/AR)
- Admin dashboard with CRUD operations
- PWA support (mobile app installation)

✅ **Documentation**
- [README.md](../README.md) - Main documentation
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Render deployment guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical architecture

✅ **Deployment Ready**
- [render.yaml](../render.yaml) - Render configuration (auto-detected)
- [production-server.js](../production-server.js) - Production server
- GitHub integration configured

## ⚡ 5-Minute Local Setup

```bash
# 1. Clone repository
git clone https://github.com/MI804-png/Sahara_Restaurant_Gergis.git
cd Sahara_Restaurant_Gergis

# 2. Install dependencies
npm install
cd site && npm install && cd ..

# 3. Start backend (Terminal 1)
node temp-server.cjs

# 4. Start frontend (Terminal 2)
cd site && npm run dev

# 5. Open browser
# Public: http://localhost:5173
# Admin:  http://localhost:5173/admin
# Username: gorgtap
# Password: Sahara 612&0611
```

## 🌐 Deploy to Render (5 Minutes)

### Option 1: Auto-Deploy (Recommended)
1. Go to https://render.com
2. Click "New Web Service"
3. Connect GitHub → Select this repository
4. Render auto-detects `render.yaml`
5. Click "Deploy"
6. Done! ✅

### Option 2: Manual Setup
See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed step-by-step instructions

## 📱 Website URLs (After Deployment)

- **Public Site:** `https://sahara-restaurant.onrender.com`
- **Admin Panel:** `https://sahara-restaurant.onrender.com/admin`
- **GitHub:** `https://github.com/MI804-png/Sahara_Restaurant_Gergis`

## 🔑 Admin Credentials

```
Username: gorgtap
Password: Sahara 612&0611
```

(Changeable via environment variables in Render dashboard)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Project overview, features, quick start |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Render deployment guide with troubleshooting |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Technical details, stack, API endpoints |

## 🎯 Next Steps

### Immediate (Do Now)
- [ ] Clone repository locally
- [ ] Run `npm install` in both root and site/ directories
- [ ] Test locally with `node temp-server.cjs` + `npm run dev`

### Short-term (This Week)
- [ ] Deploy to Render.com
- [ ] Test admin dashboard on live URL
- [ ] Test CRUD operations (Create/Read/Update/Delete)
- [ ] Test mobile PWA installation

### Medium-term (This Month)
- [ ] Customize admin credentials (env variables)
- [ ] Add more menu items/sections
- [ ] Configure custom domain (optional)
- [ ] Set up backups for site-data.json

### Long-term (Future)
- [ ] Migrate from JSON to PostgreSQL database
- [ ] Add multi-user admin support
- [ ] Implement advanced analytics
- [ ] Create mobile app (React Native)

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start frontend dev server
node temp-server.cjs    # Start backend dev server

# Production
npm run build           # Build frontend for production
npm run production      # Build + start production server
npm start              # Shorthand for backend

# Git/GitHub
git status             # Check uncommitted changes
git add .              # Stage all changes
git commit -m "msg"    # Commit with message
git push origin main   # Push to GitHub (auto-deploys to Render)

# Linting
npm run lint           # Lint frontend code
```

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| [GitHub Repo](https://github.com/MI804-png/Sahara_Restaurant_Gergis) | Source code |
| [Render Dashboard](https://dashboard.render.com) | Deployment management |
| [GitHub Settings](https://github.com/MI804-png/Sahara_Restaurant_Gergis/settings) | Repository settings |

## 🆘 Troubleshooting

### Local Setup Issues

**"npm install fails"**
- Delete `node_modules` and `package-lock.json`
- Run `npm cache clean --force`
- Try `npm install` again

**"Backend not connecting"**
- Ensure `node temp-server.cjs` is running first
- Check if port 4173 is already in use
- Kill process: `lsof -ti:4173 | xargs kill -9` (macOS/Linux)

**"Admin login fails"**
- Clear browser cookies
- Try incognito/private mode
- Check credentials: `gorgtap` / `Sahara 612&0611`

### Deployment Issues

**"Build failed on Render"**
- Check build logs in Render dashboard
- Verify `package.json` scripts are correct
- Ensure `site/dist/` is being generated

**"Website not loading"**
- Wait 2-3 minutes after deployment
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check Render logs for errors

**"Admin not working on live site"**
- Verify environment variables are set
- Check if backend is running (Render logs)
- Clear browser cache and try again

## 💡 Tips & Tricks

### For Developers
- Use VS Code extensions: ESLint, Prettier, TypeScript
- Keep browser DevTools open for debugging
- Use `git add -p` for selective commits
- Test locally before pushing to GitHub

### For Deployments
- Make small commits (easier to debug if issues)
- Always test locally before pushing
- Check Render logs immediately after deployment
- Keep `site-data.json` backed up in git

### For Admin Operations
- Use proper keyboard input (Tab, Ctrl+A, type) for form edits
- Click "Save permanently" for important changes
- Auto-save takes ~1.5 seconds after last input
- Check browser console for error messages

## 🚀 Pro Tips

1. **Auto-deploy on push:**
   ```bash
   git add .
   git commit -m "Update menu"
   git push origin main
   # Render automatically deploys in 1-2 minutes!
   ```

2. **Backup before major changes:**
   ```bash
   cp site-data.json site-data.backup.json
   git add site-data.backup.json
   git commit -m "Backup before major update"
   ```

3. **Check deployment status:**
   - Visit https://render.com
   - Select your web service
   - View real-time logs and deployment status

4. **PWA installation:**
   - Desktop: Click "Install" in browser address bar
   - Mobile: Menu (⋯) → "Add to Home Screen"
   - Works offline with cached data!

## 📞 Support

For detailed information:
1. Check [README.md](../README.md) for general questions
2. See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment help
3. Read [ARCHITECTURE.md](../ARCHITECTURE.md) for technical details
4. Check [GitHub Issues](https://github.com/MI804-png/Sahara_Restaurant_Gergis/issues)

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Production Ready | React 19 + TypeScript |
| Backend | ✅ Production Ready | Node.js API server |
| Admin Dashboard | ✅ Fully Functional | CRUD operations working |
| Multi-language | ✅ Ready | HU/EN/AR supported |
| PWA | ✅ Ready | Mobile installable |
| Render Deployment | ✅ Configured | Auto-deploy enabled |
| Database | ⏳ Future | Currently file-based JSON |
| Analytics | ⏳ Future | Coming in Phase 2 |
| Mobile App | ⏳ Future | React Native planned |

---

**Ready to deploy?** Start with [DEPLOYMENT.md](../DEPLOYMENT.md)! 🎉

**Questions?** See [ARCHITECTURE.md](../ARCHITECTURE.md) for technical details.

**Need help locally?** Follow the 5-minute setup above!

---

Last Updated: 2026-07-23  
Version: 1.0.0  
Status: ✅ Production Ready
