#!/usr/bin/env node

/**
 * Production Server
 * 
 * This server runs both the backend API and serves the built frontend
 * Used for Render deployment and other production environments
 * 
 * Combines:
 * - Backend API (Express-like server)
 * - Frontend static file serving
 * - Single process management
 */

const fs = require('fs');
const path = require('path');

// Production environment configuration
const BACKEND_PORT = process.env.BACKEND_PORT || 4173;
const FRONTEND_PORT = process.env.FRONTEND_PORT || process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const DATA_FILE = path.join(__dirname, 'site-data.json');

// Admin credentials from environment or defaults
const ADMIN_USERNAME = process.env.SAHARA_ADMIN_USERNAME || 'gorgtap';
const ADMIN_KEY = process.env.SAHARA_ADMIN_KEY || 'Sahara 612&0611';

console.log(`🍽️  Sahara Restaurant Production Server`);
console.log(`📍 Environment: ${NODE_ENV}`);
console.log(`🔐 Admin user: ${ADMIN_USERNAME}`);
console.log(`🚀 Starting servers...`);

// Helper: Parse request body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Per-day hours normalization helpers
const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

function normalizeTime(val, fallback) {
  if (typeof val === 'string' && /^\d{2}:\d{2}$/.test(val)) return val;
  return fallback;
}

function normalizeBoolean(val, fallback) {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return fallback;
}

function normalizeDayHours(raw, defaultOpen, defaultClose) {
  return {
    open: normalizeTime(raw && raw.open, defaultOpen || '08:00'),
    close: normalizeTime(raw && raw.close, defaultClose || '15:00'),
    closed: normalizeBoolean(raw && raw.closed, false),
  };
}

function normalizeSiteHours(rawHours) {
  const h = rawHours && typeof rawHours === 'object' ? rawHours : {};
  // Migrate old flat format { open, close } → per-day
  const isOldFormat = typeof h.open === 'string' && !h.monday;
  const result = {};
  for (const day of DAYS) {
    const src = isOldFormat ? { open: h.open, close: h.close } : h[day];
    result[day] = normalizeDayHours(src);
  }
  return result;
}

function normalizeSiteData(siteData) {
  if (!siteData || typeof siteData !== 'object') return {};
  return {
    ...siteData,
    hours: normalizeSiteHours(siteData.hours),
    announcement: {
      text: String(siteData.announcement && siteData.announcement.text || '').trim().slice(0, 300),
      enabled: Boolean(siteData.announcement && siteData.announcement.enabled),
    },
    eventEnabled: siteData.eventEnabled !== false,
  };
}

// Helper: Load site data
function loadSiteData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading site-data.json:', e.message);
  }
  return { updatedAt: new Date().toISOString(), siteData: {} };
}

// Helper: Save site data
function saveSiteData(data) {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving site-data.json:', e.message);
    return false;
  }
}

// Helper: Verify admin credentials
function verifyAdmin(req) {
  return (
    req.headers['x-admin-username'] === ADMIN_USERNAME &&
    req.headers['x-admin-key'] === ADMIN_KEY
  );
}

// Backend API Server
const http = require('http');

const backendServer = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /api/site-data - Retrieve current site data
  if (req.method === 'GET' && req.url === '/api/site-data') {
    try {
      const data = loadSiteData();
      if (data.siteData) data.siteData = normalizeSiteData(data.siteData);
      res.writeHead(200);
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to load site data' }));
    }
    return;
  }

  // POST /api/admin/verify - Verify admin credentials
  if (req.method === 'POST' && req.url === '/api/admin/verify') {
    if (verifyAdmin(req)) {
      res.writeHead(200);
      res.end(JSON.stringify({ verified: true }));
    } else {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
    }
    return;
  }

  // POST /api/admin/site-data - Save site data
  if (req.method === 'POST' && req.url === '/api/admin/site-data') {
    if (!verifyAdmin(req)) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    parseBody(req)
      .then(body => {
        if (saveSiteData(body)) {
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, saved: true }));
        } else {
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to save data' }));
        }
      })
      .catch(e => {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      });
    return;
  }

  // POST /api/register-event - Register for Blind Date Night
  if (req.method === 'POST' && req.url === '/api/register-event') {
    parseBody(req).then(body => {
      const name = String(body.name || '').trim().slice(0, 100);
      if (!name) {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, error: 'name_required' }));
        return;
      }

      const registration = {
        id: `reg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        age: String(body.age || '').trim().slice(0, 10),
        gender: String(body.gender || '').trim().slice(0, 20),
        interests: String(body.interests || '').trim().slice(0, 200),
        personality: String(body.personality || '').trim().slice(0, 40),
        lookingFor: String(body.lookingFor || '').trim().slice(0, 200),
        rating: Math.min(5, Math.max(1, parseInt(body.rating) || 3)),
        registeredAt: new Date().toISOString(),
      };

      const data = loadSiteData();
      if (!Array.isArray(data.eventRegistrations)) data.eventRegistrations = [];
      data.eventRegistrations.push(registration);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, id: registration.id }));
    }).catch(() => {
      res.writeHead(400);
      res.end(JSON.stringify({ ok: false, error: 'invalid_body' }));
    });
    return;
  }

  // GET /api/admin/event-registrations - Get all event registrations
  if (req.method === 'GET' && req.url === '/api/admin/event-registrations') {
    if (!verifyAdmin(req)) {
      res.writeHead(401);
      res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
      return;
    }

    const data = loadSiteData();
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, registrations: data.eventRegistrations || [] }));
    return;
  }

  // 404 for other API routes
  if (req.url.startsWith('/api')) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }

  // Default
  res.writeHead(200);
  res.end(JSON.stringify({ message: 'Backend API running' }));
});

// Frontend Static Server (serves built React app)
const { createServer: createStaticServer } = require('http');
const frontendServer = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const distPath = path.join(__dirname, 'site', 'dist');
  let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);

  // Prevent directory traversal
  if (!filePath.startsWith(distPath)) {
    filePath = path.join(distPath, 'index.html');
  }

  // Try to serve requested file
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Add cache headers
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    const fileContent = fs.readFileSync(filePath);
    res.writeHead(200);
    res.end(fileContent);
  } else {
    // SPA fallback to index.html
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.writeHead(200);
      res.end(fs.readFileSync(indexPath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }
});

// Start servers
backendServer.listen(BACKEND_PORT, '0.0.0.0', () => {
  console.log(`✅ Backend API running at http://0.0.0.0:${BACKEND_PORT}`);
  console.log(`   GET  /api/site-data`);
  console.log(`   POST /api/admin/verify`);
  console.log(`   POST /api/admin/site-data`);
});

frontendServer.listen(FRONTEND_PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend serving at http://0.0.0.0:${FRONTEND_PORT}`);
  console.log(`   📱 Public: http://0.0.0.0:${FRONTEND_PORT}/`);
  console.log(`   🔧 Admin:  http://0.0.0.0:${FRONTEND_PORT}/admin`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  backendServer.close(() => console.log('Backend closed'));
  frontendServer.close(() => console.log('Frontend closed'));
  process.exit(0);
});

console.log(`\n🌐 Sahara Restaurant is running!`);
console.log(`📖 Documentation: https://github.com/MI804-png/Sahara_Restaurant_Gergis#readme`);
console.log(`🔑 Admin Credentials: ${ADMIN_USERNAME} / ${ADMIN_KEY.substring(0, 3)}****`);
