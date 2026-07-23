# Sahara Restaurant Site

Responsive restaurant website and installable PWA for Sahara Restaurant in Hungary.

## Included

- Hungarian default UI with English and Arabic language switching
- Owner-approved HD video staged at `public/media/sahara-story.mp4`
- Auto-generated visual gallery derived from the approved video
- Persistent admin dashboard for hours, business details, products, prices, gallery images, offers, and sales totals
- Timed product offers with discount percent, date range, daily time range, enabled state, and client limits
- Website visit tracking with admin summary cards for visits, live offers, units sold, and revenue
- Mobile-first landing page suitable for GitHub hosting and Render deployment
- Web app manifest and service worker for installability groundwork

## Local development

```bash
npm install
npm run dev
```

For the admin editor and permanent save flow, run the disk-backed API server from the workspace root in a second terminal:

```bash
npm run serve
```

The Vite dev server proxies `/api`, `/uploads`, and `/__save_frame` to `http://127.0.0.1:4173`.

## Admin editing

- The page now includes an admin editor section for opening hours, business details, menu sections, products, prices, menu/gallery images, timed offers, and sold-product quantities.
- Saving writes the latest approved version to `D:/Sahara_restaurant/site-data.json`. Each save replaces the previous saved version, so only the latest edits remain permanent.
- Uploaded admin images are stored in `site/public/uploads/` and can be referenced again after refresh.
- Business details now let the admin update the displayed location label, optional phone number, and delivery availability without editing source files.
- Website visits are counted through `/api/track-visit` once per browser session and shown in the admin dashboard.
- Sales totals are calculated from the quantities entered in the admin dashboard. Offer-adjusted revenue uses any currently live discount tied to each product.
- The default local admin key is `sahara-local-admin`. Override it by starting the server with the `SAHARA_ADMIN_KEY` environment variable.

## Production build

```bash
npm run build
```

## Content notes

- The current version uses the approved video as the primary media source.
- The exact street address, phone number, and opening hours should be added once confirmed.
- Facebook profile link is wired to `https://www.facebook.com/gorgoo.noshy`.

## Deployment

- GitHub Pages or any static-only host can publish the frontend, but admin saves will not persist there because static hosting cannot write `site-data.json`.
- To keep admin edits permanent, deploy the app behind a stateful Node host that runs `temp-server.cjs` and has write access to the workspace or a mounted data volume.
- Render static site deployment is still fine for read-only publishing, but permanent admin editing needs a web service or another backend with persistent storage.
- Play Store later: this PWA can be wrapped with Trusted Web Activity or Capacitor once branding, contact details, and final icons are locked.
