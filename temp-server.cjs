const http = require('http')
const fs = require('fs')
const path = require('path')

const base = __dirname
const dataFile = path.join(base, 'site-data.json')
const distDir = path.join(base, 'site', 'dist')
const publicDir = path.join(base, 'site', 'public')
const uploadsDir = path.join(publicDir, 'uploads')
const adminUsername = process.env.SAHARA_ADMIN_USERNAME || 'gorgtap'
const adminKey = process.env.SAHARA_ADMIN_KEY || 'Sahara 612&0611'
const defaultMetrics = {
  totalVisits: 0,
  lastVisitedAt: null,
}
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
}

function sendJson(response, statusCode, body, extraHeaders = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  })
  response.end(JSON.stringify(body))
}

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
  response.end(body)
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
    })

    request.on('end', () => {
      resolve(body)
    })

    request.on('error', reject)
  })
}

async function parseJsonBody(request, response) {
  try {
    const body = await readRequestBody(request)
    return body ? JSON.parse(body) : {}
  } catch {
    sendJson(response, 400, { ok: false, error: 'invalid_json' })
    return null
  }
}

function normalizeText(value, maxLength = 160) {
  return String(value || '').trim().slice(0, maxLength)
}

function normalizeOptionalText(value, maxLength = 240) {
  return normalizeText(value, maxLength)
}

function normalizeId(value, prefix, index) {
  const normalized = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || `${prefix}-${index + 1}`
}

function normalizeTime(value, fallback = '') {
  const candidate = String(value || '').trim()

  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(candidate)) {
    return candidate
  }

  return fallback
}

function normalizeDateTimeLocal(value) {
  const candidate = String(value || '').trim()
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(candidate) ? candidate : ''
}

function normalizeIsoTimestamp(value) {
  const candidate = String(value || '').trim()

  if (!candidate) {
    return null
  }

  const parsed = new Date(candidate)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function normalizeInteger(value, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return Math.min(max, Math.round(parsed))
}

function normalizePrice(value) {
  return normalizeInteger(value)
}

function normalizePercent(value) {
  return normalizeInteger(value, 100)
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true
    }

    if (value.toLowerCase() === 'false') {
      return false
    }
  }

  if (typeof value === 'number') {
    return value !== 0
  }

  return fallback
}

function normalizeSrc(value) {
  const src = String(value || '').trim()

  if (!src) {
    return ''
  }

  if (src.startsWith('/') || /^https?:\/\//i.test(src)) {
    return src
  }

  return `/${src.replace(/^\/+/, '')}`
}

function normalizeMenuItem(item, sectionIndex, itemIndex) {
  const name = normalizeText(item && item.name, 120) || `Item ${itemIndex + 1}`

  return {
    id: normalizeId(item && (item.id || item.name), `item-${sectionIndex + 1}`, itemIndex),
    name,
    priceHuf: normalizePrice(item && item.priceHuf),
    details: normalizeOptionalText(item && item.details, 280),
  }
}

function normalizeMenuSection(section, index) {
  const title = normalizeText(section && section.title, 120) || `Section ${index + 1}`

  return {
    id: normalizeId(section && (section.id || section.title), 'section', index),
    title,
    subtitle: normalizeOptionalText(section && section.subtitle, 80),
    items: Array.isArray(section && section.items)
      ? section.items.map((item, itemIndex) => normalizeMenuItem(item, index, itemIndex))
      : [],
  }
}

function normalizeEvidenceImage(image, index) {
  const src = normalizeSrc(image && image.src)

  if (!src) {
    return null
  }

  return {
    id: normalizeId(image && (image.id || image.src), 'evidence', index),
    src,
    timestamp: normalizeOptionalText(image && image.timestamp, 40) || `Image ${index + 1}`,
  }
}

function normalizeGalleryImage(image, index) {
  const src = normalizeSrc(image && image.src)

  if (!src) {
    return null
  }

  return {
    id: normalizeId(image && (image.id || image.src), 'gallery', index),
    src,
  }
}

function normalizeOffer(offer, index) {
  const maxClients = normalizeInteger(offer && offer.maxClients)
  const redeemedClients = normalizeInteger(offer && offer.redeemedClients)

  return {
    id: normalizeId(offer && (offer.id || offer.title || offer.itemId), 'offer', index),
    itemId: normalizeText(offer && offer.itemId, 120),
    title: normalizeOptionalText(offer && offer.title, 120),
    discountPercent: normalizePercent(offer && offer.discountPercent),
    startsAt: normalizeDateTimeLocal(offer && offer.startsAt),
    endsAt: normalizeDateTimeLocal(offer && offer.endsAt),
    dailyStartTime: normalizeTime(offer && offer.dailyStartTime),
    dailyEndTime: normalizeTime(offer && offer.dailyEndTime),
    maxClients,
    redeemedClients: maxClients > 0 ? Math.min(redeemedClients, maxClients) : redeemedClients,
    enabled: normalizeBoolean(offer && offer.enabled, true),
  }
}

function normalizeProductSale(entry) {
  const itemId = normalizeText(entry && entry.itemId, 120)

  if (!itemId) {
    return null
  }

  return {
    itemId,
    quantitySold: normalizeInteger(entry && entry.quantitySold),
  }
}

function normalizeMetrics(metrics) {
  return {
    totalVisits: normalizeInteger(metrics && metrics.totalVisits),
    lastVisitedAt: normalizeIsoTimestamp(metrics && metrics.lastVisitedAt),
  }
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function normalizeDayHours(raw, defaultOpen, defaultClose) {
  return {
    open: normalizeTime(raw && raw.open, defaultOpen || '08:00'),
    close: normalizeTime(raw && raw.close, defaultClose || '15:00'),
    closed: normalizeBoolean(raw && raw.closed, false),
  }
}

function normalizeSiteHours(rawHours) {
  const h = rawHours && typeof rawHours === 'object' ? rawHours : {}
  // Migration from old format: { open, close } -> per-day record
  const isOldFormat = typeof h.open === 'string' && !h.monday
  const result = {}
  for (const day of DAYS) {
    const src = isOldFormat ? { open: h.open, close: h.close } : h[day]
    result[day] = normalizeDayHours(src)
  }
  return result
}

function normalizeSiteData(payload) {
  const rawSiteData = payload && typeof payload === 'object' && payload.siteData
    ? payload.siteData
    : payload
  const siteData = rawSiteData && typeof rawSiteData === 'object' ? rawSiteData : {}

  return {
    hours: normalizeSiteHours(siteData.hours),
    business: {
      locationLabel:
        normalizeOptionalText(siteData.business && siteData.business.locationLabel, 160) ||
        '47.4881859, 19.0975971',
      phoneNumber: normalizeOptionalText(siteData.business && siteData.business.phoneNumber, 60),
      deliveryAvailable: normalizeBoolean(
        siteData.business && siteData.business.deliveryAvailable,
        false,
      ),
    },
    pricing: {
      taxEnabled: normalizeBoolean(siteData.pricing && siteData.pricing.taxEnabled, false),
      taxPercent: normalizePercent(siteData.pricing && siteData.pricing.taxPercent),
    },
    menuSections: Array.isArray(siteData.menuSections)
      ? siteData.menuSections.map((section, index) => normalizeMenuSection(section, index))
      : [],
    menuEvidenceImages: Array.isArray(siteData.menuEvidenceImages)
      ? siteData.menuEvidenceImages
          .map((image, index) => normalizeEvidenceImage(image, index))
          .filter(Boolean)
      : [],
    galleryImages: Array.isArray(siteData.galleryImages)
      ? siteData.galleryImages
          .map((image, index) => normalizeGalleryImage(image, index))
          .filter(Boolean)
      : [],
    offers: Array.isArray(siteData.offers)
      ? siteData.offers.map((offer, index) => normalizeOffer(offer, index))
      : [],
    productSales: Array.isArray(siteData.productSales)
      ? siteData.productSales
          .map((entry) => normalizeProductSale(entry))
          .filter(Boolean)
      : [],
    announcement: {
      text: normalizeOptionalText(siteData.announcement && siteData.announcement.text, 300),
      enabled: normalizeBoolean(siteData.announcement && siteData.announcement.enabled, false),
    },
    event: {
      enabled: normalizeBoolean(siteData.event && siteData.event.enabled, false),
      showFrom: normalizeDateTimeLocal(siteData.event && siteData.event.showFrom),
      showUntil: normalizeDateTimeLocal(siteData.event && siteData.event.showUntil),
      registrationOpen: normalizeDateTimeLocal(siteData.event && siteData.event.registrationOpen),
      registrationClose: normalizeDateTimeLocal(siteData.event && siteData.event.registrationClose),
      eventDate: normalizeOptionalText(siteData.event && siteData.event.eventDate, 100),
      eventTime: normalizeOptionalText(siteData.event && siteData.event.eventTime, 60),
    },
  }
}

function readStoredRecord() {
  if (!fs.existsSync(dataFile)) {
    return {
      updatedAt: null,
      siteData: null,
      metrics: { ...defaultMetrics },
    }
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'))

    return {
      updatedAt: normalizeIsoTimestamp(parsed.updatedAt),
      siteData:
        parsed.siteData && typeof parsed.siteData === 'object'
          ? normalizeSiteData(parsed.siteData)
          : null,
      metrics: normalizeMetrics(parsed.metrics),
    }
  } catch {
    return {
      updatedAt: null,
      siteData: null,
      metrics: { ...defaultMetrics },
    }
  }
}

function writeStoredRecord(record) {
  fs.writeFileSync(
    dataFile,
    `${JSON.stringify(
      {
        updatedAt: record.updatedAt,
        siteData: record.siteData,
        metrics: record.metrics,
      },
      null,
      2,
    )}\n`,
    'utf8',
  )
}

function loadSavedRecord() {
  const record = readStoredRecord()

  return {
    hasSavedData: record.siteData !== null,
    updatedAt: record.updatedAt,
    siteData: record.siteData,
    metrics: record.metrics,
  }
}

function writeSavedRecord(payload) {
  const current = readStoredRecord()
  const record = {
    updatedAt: new Date().toISOString(),
    siteData: normalizeSiteData(payload),
    metrics: current.metrics,
    eventRegistrations: current.eventRegistrations,
  }

  writeStoredRecord(record)

  return {
    hasSavedData: true,
    ...record,
  }
}

function recordVisit() {
  const current = readStoredRecord()
  const record = {
    updatedAt: current.updatedAt,
    siteData: current.siteData,
    metrics: {
      totalVisits: current.metrics.totalVisits + 1,
      lastVisitedAt: new Date().toISOString(),
    },
    eventRegistrations: current.eventRegistrations,
  }

  writeStoredRecord(record)

  return {
    hasSavedData: record.siteData !== null,
    ...record,
  }
}

function isAuthorized(request) {
  return (
    request.headers['x-admin-username'] === adminUsername &&
    request.headers['x-admin-key'] === adminKey
  )
}

function requireAdmin(request, response) {
  if (isAuthorized(request)) {
    return true
  }

  sendJson(response, 401, { ok: false, error: 'unauthorized' })
  return false
}

function ensureUploadDirectory() {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

function saveDataUrlImage(fileName, dataUrl) {
  const match = String(dataUrl || '').match(
    /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/i,
  )

  if (!match) {
    return null
  }

  const extension = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase()
  const parsedName = path.parse(String(fileName || 'image'))
  const safeBaseName = parsedName.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const finalFileName = `${safeBaseName || 'image'}-${Date.now()}.${extension}`

  ensureUploadDirectory()
  fs.writeFileSync(path.join(uploadsDir, finalFileName), match[2], 'base64')

  return `/uploads/${finalFileName}`
}

function deleteUploadedImage(src) {
  const safeFileName = path.basename(String(src || ''))

  if (!safeFileName) {
    return false
  }

  const filePath = path.join(uploadsDir, safeFileName)

  if (!filePath.startsWith(uploadsDir) || !fs.existsSync(filePath)) {
    return false
  }

  fs.unlinkSync(filePath)
  return true
}

function hasBuiltSite() {
  return fs.existsSync(path.join(distDir, 'index.html'))
}

function resolvePublicFile(rawPath) {
  if (rawPath === '/') {
    return null
  }

  const cleanedPath = rawPath.replace(/^\/+/, '')
  const resolvedFile = path.join(publicDir, cleanedPath)

  if (!resolvedFile.startsWith(publicDir)) {
    return null
  }

  if (fs.existsSync(resolvedFile) && fs.statSync(resolvedFile).isFile()) {
    return resolvedFile
  }

  return null
}

function resolveStaticFile(rawPath) {
  if (!hasBuiltSite()) {
    return null
  }

  const requestPath = rawPath === '/' ? '/index.html' : rawPath
  const cleanedPath = requestPath.replace(/^\/+/, '')
  const resolvedFile = path.join(distDir, cleanedPath)

  if (!resolvedFile.startsWith(distDir)) {
    return null
  }

  if (fs.existsSync(resolvedFile) && fs.statSync(resolvedFile).isFile()) {
    return resolvedFile
  }

  return path.join(distDir, 'index.html')
}

function serveFile(filePath, response) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404)
      response.end('Not found')
      return
    }

    response.writeHead(200, {
      'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    })
    response.end(data)
  })
}

async function handleLegacyFrameSave(request, response) {
  const payload = await parseJsonBody(request, response)

  if (!payload) {
    return
  }

  try {
    const fileName = path.basename(payload.fileName || '')
    const dataUrl = String(payload.dataUrl || '')
    const match = dataUrl.match(/^data:image\/png;base64,(.+)$/)

    if (!fileName || !match) {
      sendJson(response, 400, { ok: false })
      return
    }

    const targetDir = path.join(base, 'site', 'public', 'extracted')

    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(path.join(targetDir, fileName), match[1], 'base64')
    sendJson(response, 200, { ok: true, fileName })
  } catch {
    sendJson(response, 500, { ok: false })
  }
}

http
  .createServer(async (request, response) => {
    const rawPath = decodeURIComponent((request.url || '/').split('?')[0])

    if (request.method === 'GET' && rawPath === '/api/site-data') {
      const record = loadSavedRecord()

      sendJson(
        response,
        200,
        { ok: true, ...record },
        { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      )
      return
    }

    if (request.method === 'POST' && rawPath === '/api/track-visit') {
      const record = recordVisit()
      sendJson(
        response,
        200,
        { ok: true, ...record },
        { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      )
      return
    }

    if (request.method === 'POST' && rawPath === '/api/admin/verify') {
      if (!requireAdmin(request, response)) {
        return
      }

      sendJson(response, 200, { ok: true })
      return
    }

    if (request.method === 'POST' && rawPath === '/api/admin/site-data') {
      if (!requireAdmin(request, response)) {
        return
      }

      const payload = await parseJsonBody(request, response)

      if (!payload) {
        return
      }

      const record = writeSavedRecord(payload)
      sendJson(response, 200, { ok: true, ...record })
      return
    }

    if (request.method === 'POST' && rawPath === '/api/admin/upload-image') {
      if (!requireAdmin(request, response)) {
        return
      }

      const payload = await parseJsonBody(request, response)

      if (!payload) {
        return
      }

      const src = saveDataUrlImage(payload.fileName, payload.dataUrl)

      if (!src) {
        sendJson(response, 400, { ok: false, error: 'invalid_image_payload' })
        return
      }

      sendJson(response, 200, { ok: true, src })
      return
    }

    if (request.method === 'POST' && rawPath === '/api/admin/delete-image') {
      if (!requireAdmin(request, response)) {
        return
      }

      const payload = await parseJsonBody(request, response)

      if (!payload) {
        return
      }

      if (!String(payload.src || '').startsWith('/uploads/')) {
        sendJson(response, 400, { ok: false, error: 'only_uploaded_images_can_be_deleted' })
        return
      }

      const deleted = deleteUploadedImage(payload.src)
      sendJson(response, 200, { ok: true, deleted })
      return
    }

    if (request.method === 'POST' && rawPath === '/api/register-event') {
      const payload = await parseJsonBody(request, response)

      if (!payload) {
        return
      }

      const name = normalizeText(payload.name, 100)
      if (!name) {
        sendJson(response, 400, { ok: false, error: 'name_required' })
        return
      }

      const registration = {
        id: `reg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        age: normalizeText(payload.age, 10),
        gender: normalizeText(payload.gender, 20),
        interests: normalizeText(payload.interests, 200),
        personality: normalizeText(payload.personality, 40),
        lookingFor: normalizeText(payload.lookingFor, 200),
        rating: Math.min(5, Math.max(1, normalizeInteger(payload.rating) || 3)),
        registeredAt: new Date().toISOString(),
      }

      const current = readStoredRecord()
      const record = {
        updatedAt: current.updatedAt,
        siteData: current.siteData,
        metrics: current.metrics,
        eventRegistrations: [...(current.eventRegistrations || []), registration],
      }

      writeStoredRecord(record)
      sendJson(response, 200, { ok: true, id: registration.id })
      return
    }

    if (request.method === 'GET' && rawPath === '/api/admin/event-registrations') {
      if (!requireAdmin(request, response)) {
        return
      }

      const current = readStoredRecord()
      sendJson(response, 200, { ok: true, registrations: current.eventRegistrations || [] })
      return
    }

    if (request.method === 'POST' && rawPath === '/__save_frame') {
      await handleLegacyFrameSave(request, response)
      return
    }

    const publicFilePath = resolvePublicFile(rawPath)

    if (publicFilePath) {
      serveFile(publicFilePath, response)
      return
    }

    const filePath = resolveStaticFile(rawPath)

    if (!filePath) {
      sendText(
        response,
        503,
        'Build the site with "npm run build" inside site/ or use the Vite dev server for the frontend. The admin API is still available on this port.',
      )
      return
    }

    serveFile(filePath, response)
  })
  .listen(4173, '127.0.0.1', () => {
    console.log('server-ready http://127.0.0.1:4173')
  })
