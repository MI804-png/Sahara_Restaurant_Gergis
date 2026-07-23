# Deployment Guide - Render.com

This guide explains how to deploy Sahara Restaurant to Render.com from GitHub.

## Prerequisites

1. **GitHub Account** - Repository already exists:
   - https://github.com/MI804-png/Sahara_Restaurant_Gergis

2. **Render Account** - Create free at:
   - https://render.com

3. **Code pushed to GitHub** ✅ (Already done)

## Deployment Steps

### Step 1: Connect GitHub to Render

1. Visit https://render.com and sign in
2. Click **"New +"** in top-right corner
3. Select **"Web Service"**
4. Click **"Connect GitHub"**
5. Authorize Render to access your GitHub account
6. Select **"MI804-png/Sahara_Restaurant_Gergis"** repository
7. Click **"Connect"**

### Step 2: Configure Web Service

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `sahara-restaurant` |
| **Environment** | `Node` |
| **Region** | `us-east1` (or closest to your location) |
| **Branch** | `main` |
| **Build Command** | `npm install && cd site && npm install && npm run build && cd ..` |
| **Start Command** | `node production-server.js` |
| **Plan** | `Free` (for testing) or upgrade to `Pro` for production |

### Step 3: Add Environment Variables (Optional)

In the Web Service dashboard, click **"Environment"** and add:

```
NODE_ENV = production
```

Optional custom admin credentials (defaults are used if not set):
```
SAHARA_ADMIN_USERNAME = gorgtap
SAHARA_ADMIN_KEY = Sahara 612&0611
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Build process takes ~3-5 minutes
4. Watch the live build logs
5. When complete, you'll see: ✅ **Deploy successful**

### Step 5: Access Your Website

After deployment completes:

- **Public Website:** `https://sahara-restaurant.onrender.com`
- **Admin Panel:** `https://sahara-restaurant.onrender.com/admin`

(Your actual URL will show in the Render dashboard)

## Auto-Deployment

After initial setup, any `git push` to `main` branch will trigger automatic deployment:

```bash
git add .
git commit -m "Update menu"
git push origin main
# Render automatically deploys!
```

## Monitoring & Troubleshooting

### View Logs
1. Go to Render dashboard
2. Select your web service
3. Click **"Logs"** to see real-time output

### Common Issues

**Error: "Build command failed"**
- Check `package.json` scripts are correct
- Ensure `site/dist/` is being generated
- Check for missing dependencies

**Error: "Cannot find module"**
- Verify `npm install` runs in build command
- Check all dependencies in `package.json`
- Review build logs for error details

**Website not loading**
- Allow 2-3 minutes after deployment
- Hard refresh browser (Ctrl+Shift+R)
- Check if backend is running in Render logs
- Verify `site/dist/index.html` exists

**Admin not working**
- Verify credentials: `gorgtap` / `Sahara 612&0611`
- Check admin endpoint in browser DevTools Network tab
- Ensure environment variables are set correctly

### Force Redeploy

1. Go to Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. This rebuilds without code changes

## Database & File Storage

### Site Data File

The `site-data.json` file contains all restaurant data:

```json
{
  "updatedAt": "2026-07-23T...",
  "siteData": {
    "hours": {...},
    "business": {...},
    "menuSections": [...]
  }
}
```

**Important:** 
- This file is not persistent on Render's free tier
- Data resets when the web service restarts (daily at midnight)
- For production, consider upgrading to:
  - **Render PostgreSQL** (paid)
  - **Render Redis** (paid)
  - **External database** (AWS, GCP, etc.)

### For Persistent Data (Production):

1. **Upgrade Render Plan** - Persistent volume storage
2. **Use External Database** - PostgreSQL, MongoDB, etc.
3. **Backup Strategy** - Regular git commits of `site-data.json`

## Performance Optimization

### Current Setup
- Single Node.js process handles both backend + frontend
- Free tier: ~512MB RAM, shared CPU
- Good for testing/demo

### Production Improvements

1. **Separate Frontend & Backend**
   - Host frontend on Render static site
   - Host backend on separate Render web service

2. **Add Database**
   - Replace file-based JSON with PostgreSQL
   - Better for concurrent users

3. **CDN for Static Assets**
   - Use Cloudflare or AWS CloudFront
   - Faster image/asset loading globally

4. **Caching Strategy**
   - Add Redis for session/menu caching
   - Reduce database queries

## Security Checklist

- [ ] Change admin password from default
- [ ] Use HTTPS (Render provides automatically)
- [ ] Add CORS restrictions if needed
- [ ] Implement rate limiting for API
- [ ] Never commit `.env` files with secrets
- [ ] Use Render environment variables for sensitive data
- [ ] Enable admin authentication (already done)
- [ ] Validate all user inputs on backend

## PWA Installation on Mobile

After deployment, users can install as app:

### iOS
1. Open `https://sahara-restaurant.onrender.com` in Safari
2. Tap Share → Add to Home Screen
3. Confirm app name
4. App installs with offline support

### Android
1. Open in Chrome/Firefox
2. Menu (⋮) → Install app
3. App installs with offline support

## Updating After Deployment

To push updates:

```bash
# Local changes
git add .
git commit -m "Add new menu items"
git push origin main

# Render automatically redeploys within 1-2 minutes
# Check Render dashboard for build progress
```

## Backup & Recovery

### Backup Site Data

Before major updates, backup the current data:

```bash
# Download backup from Render logs or via API
curl https://sahara-restaurant.onrender.com/api/site-data > backup.json

# Or commit to git
git add site-data.json
git commit -m "Backup menu data"
git push
```

### Restore from Backup

1. Download backup file
2. Replace `site-data.json` locally
3. Commit and push to GitHub
4. Render automatically redeploys

## Upgrading Plan

If you need persistent storage or more resources:

1. Go to Render dashboard
2. Select your web service
3. Click **"Settings"**
4. Scroll to **"Upgrade Plan"**
5. Choose **"Pro"** or **"Business"** tier
6. Add credit card for billing

Pro tier includes:
- Persistent storage (volume)
- More CPU/RAM
- Better SLA/support
- Environment-specific configs

## Next Steps

1. ✅ Repository ready on GitHub
2. ⏳ Deploy to Render (this step)
3. ⏳ Test on live URL
4. ⏳ Setup domain (optional)
5. ⏳ Mobile PWA installation
6. ⏳ Database migration (if needed)

## Support Resources

- **Render Docs:** https://render.com/docs
- **GitHub Setup:** https://github.com/MI804-png/Sahara_Restaurant_Gergis
- **Node.js Help:** https://nodejs.org/docs
- **PWA Guide:** https://web.dev/progressive-web-apps/

---

**Quick Deploy Checklist:**
- [ ] GitHub account with repository
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Build command configured
- [ ] Start command set to `node production-server.js`
- [ ] Environment variables set (if using custom credentials)
- [ ] Deploy initiated
- [ ] Website accessible at Render URL
- [ ] Admin panel working with correct credentials
- [ ] Test CRUD operations

✨ **Deployment ready!**
