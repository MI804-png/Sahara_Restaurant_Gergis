import { type Locale, type LocaleContent } from './content'
import { extractedMenuSections, menuEvidenceFrames } from './menuData'

export type EditableMenuItem = {
  id: string
  name: string
  priceHuf: number
  details: string
}

export type EditableMenuSection = {
  id: string
  title: string
  subtitle: string
  items: EditableMenuItem[]
}

export type EditableMenuEvidenceImage = {
  id: string
  src: string
  timestamp: string
}

export type EditableGalleryImage = {
  id: string
  src: string
}

export type DayHours = {
  open: string
  close: string
  closed: boolean
}

export const DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
] as const

export type DayKey = (typeof DAYS)[number]

export type SiteHours = Record<DayKey, DayHours>

export type SiteBusinessDetails = {
  locationLabel: string
  phoneNumber: string
  deliveryAvailable: boolean
}

export type SiteOffer = {
  id: string
  itemId: string
  title: string
  discountPercent: number
  startsAt: string
  endsAt: string
  dailyStartTime: string
  dailyEndTime: string
  maxClients: number
  redeemedClients: number
  enabled: boolean
}

export type ProductSales = {
  itemId: string
  quantitySold: number
}

export type PricingSettings = {
  taxEnabled: boolean
  taxPercent: number
}

export type Announcement = {
  text: string
  enabled: boolean
}

export type EventRegistration = {
  id: string
  name: string
  age: string
  gender: string
  interests: string
  personality: string
  lookingFor: string
  rating: number
  registeredAt: string
}

export type SiteMetrics = {
  totalVisits: number
  lastVisitedAt: string | null
}

export type SiteData = {
  hours: SiteHours
  business: SiteBusinessDetails
  pricing: PricingSettings
  announcement: Announcement
  menuSections: EditableMenuSection[]
  menuEvidenceImages: EditableMenuEvidenceImage[]
  galleryImages: EditableGalleryImage[]
  offers: SiteOffer[]
  productSales: ProductSales[]
}

export type SiteDataResponse = {
  ok: boolean
  hasSavedData: boolean
  updatedAt: string | null
  siteData: SiteData | null
  metrics: SiteMetrics
}

export type MenuProductOption = {
  itemId: string
  itemName: string
  sectionId: string
  sectionTitle: string
  priceHuf: number
  details: string
}

export type OfferStatus = 'live' | 'scheduled' | 'expired' | 'sold-out' | 'disabled'

export type SalesSummary = {
  totalProductsSold: number
  grossRevenueHuf: number
  grossRevenueWithTaxHuf: number
  discountedRevenueHuf: number
  discountedRevenueWithTaxHuf: number
}

export const defaultSiteMetrics: SiteMetrics = {
  totalVisits: 0,
  lastVisitedAt: null,
}

function slugify(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || fallback
}

export function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function buildDefaultMenuSections(): EditableMenuSection[] {
  return extractedMenuSections.map((section, sectionIndex) => ({
    id: slugify(section.title, `section-${sectionIndex + 1}`),
    title: section.title,
    subtitle: section.subtitle ?? '',
    items: section.items.map((item, itemIndex) => ({
      id: slugify(item.name, `item-${sectionIndex + 1}-${itemIndex + 1}`),
      name: item.name,
      priceHuf: item.priceHuf,
      details: item.details ?? '',
    })),
  }))
}

function buildDefaultMenuEvidenceImages(): EditableMenuEvidenceImage[] {
  return menuEvidenceFrames.map((frame, index) => ({
    id: slugify(frame.timestamp, `evidence-${index + 1}`),
    src: frame.src,
    timestamp: frame.timestamp,
  }))
}

function buildDefaultGalleryImages(): EditableGalleryImage[] {
  const photoSources = [
    '/photos/photo-01.jpg',
    '/photos/photo-02.jpg',
    '/photos/photo-03.jpg',
    '/photos/photo-04.jpg',
    '/photos/photo-05.jpg',
    '/photos/photo-06.jpg',
    '/photos/photo-07.jpg',
    '/photos/photo-08.jpg',
    '/photos/photo-09.jpg',
  ]

  return photoSources.map((src, index) => ({
    id: `gallery-${index + 1}`,
    src,
  }))
}

const defaultDay: DayHours = { open: '08:00', close: '15:00', closed: false }

export const defaultSiteData: SiteData = {
  hours: {
    monday:    { ...defaultDay },
    tuesday:   { ...defaultDay },
    wednesday: { ...defaultDay },
    thursday:  { ...defaultDay },
    friday:    { ...defaultDay },
    saturday:  { ...defaultDay },
    sunday:    { ...defaultDay },
  },
  business: {
    locationLabel: '47.4881859, 19.0975971',
    phoneNumber: '',
    deliveryAvailable: false,
  },
  pricing: {
    taxEnabled: false,
    taxPercent: 0,
  },
  menuSections: buildDefaultMenuSections(),
  menuEvidenceImages: buildDefaultMenuEvidenceImages(),
  galleryImages: buildDefaultGalleryImages(),
  announcement: { text: '', enabled: false },
  offers: [],
  productSales: [],
}

function cloneDayHours(d: DayHours | undefined): DayHours {
  return {
    open: d?.open ?? '08:00',
    close: d?.close ?? '15:00',
    closed: d?.closed ?? false,
  }
}

export function cloneSiteData(siteData: SiteData): SiteData {
  return {
    hours: Object.fromEntries(
      DAYS.map((day) => [day, cloneDayHours(siteData.hours[day])]),
    ) as SiteHours,
    business: {
      locationLabel: siteData.business.locationLabel,
      phoneNumber: siteData.business.phoneNumber,
      deliveryAvailable: siteData.business.deliveryAvailable,
    },
    pricing: {
      taxEnabled: siteData.pricing?.taxEnabled ?? false,
      taxPercent: Math.max(0, Math.min(100, Math.round(siteData.pricing?.taxPercent ?? 0))),
    },
    menuSections: siteData.menuSections.map((section) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle ?? '',
      items: section.items.map((item) => ({
        id: item.id,
        name: item.name,
        priceHuf: item.priceHuf,
        details: item.details ?? '',
      })),
    })),
    menuEvidenceImages: siteData.menuEvidenceImages.map((image) => ({
      id: image.id,
      src: image.src,
      timestamp: image.timestamp,
    })),
    galleryImages: siteData.galleryImages.map((image) => ({
      id: image.id,
      src: image.src,
    })),
    offers: siteData.offers.map((offer) => ({
      id: offer.id,
      itemId: offer.itemId,
      title: offer.title,
      discountPercent: offer.discountPercent,
      startsAt: offer.startsAt,
      endsAt: offer.endsAt,
      dailyStartTime: offer.dailyStartTime,
      dailyEndTime: offer.dailyEndTime,
      maxClients: offer.maxClients,
      redeemedClients: offer.redeemedClients,
      enabled: offer.enabled,
    })),
    announcement: {
      text: siteData.announcement?.text ?? '',
      enabled: siteData.announcement?.enabled ?? false,
    },
    productSales: siteData.productSales.map((entry) => ({
      itemId: entry.itemId,
      quantitySold: entry.quantitySold,
    })),
  }
}

export function createMenuSection(): EditableMenuSection {
  return {
    id: createId('section'),
    title: 'New section',
    subtitle: '',
    items: [],
  }
}

export function createMenuItem(): EditableMenuItem {
  return {
    id: createId('item'),
    name: 'New product',
    priceHuf: 0,
    details: '',
  }
}

export function createMenuEvidenceImage(): EditableMenuEvidenceImage {
  return {
    id: createId('evidence'),
    src: '',
    timestamp: 'New image',
  }
}

export function createGalleryImage(): EditableGalleryImage {
  return {
    id: createId('gallery'),
    src: '',
  }
}

export function createOffer(itemId = ''): SiteOffer {
  return {
    id: createId('offer'),
    itemId,
    title: '',
    discountPercent: 10,
    startsAt: '',
    endsAt: '',
    dailyStartTime: '',
    dailyEndTime: '',
    maxClients: 0,
    redeemedClients: 0,
    enabled: true,
  }
}

export function parseTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/)

  if (!match) {
    return null
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (hours > 23 || minutes > 59) {
    return null
  }

  return { hours, minutes }
}

function parseLocalDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function timeToMinutes(value: string) {
  const parsed = parseTime(value)

  if (!parsed) {
    return null
  }

  return parsed.hours * 60 + parsed.minutes
}

function isDailyWindowActive(now: Date, start: string, end: string) {
  const startMinutes = timeToMinutes(start)
  const endMinutes = timeToMinutes(end)

  if (startMinutes === null && endMinutes === null) {
    return true
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  if (startMinutes !== null && endMinutes !== null) {
    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes
    }

    return currentMinutes >= startMinutes || currentMinutes <= endMinutes
  }

  if (startMinutes !== null) {
    return currentMinutes >= startMinutes
  }

  return endMinutes !== null ? currentMinutes <= endMinutes : true
}

function formatTime(locale: Locale, value: string) {
  const parsed = parseTime(value)

  if (!parsed) {
    return value
  }

  const localeTag = locale === 'hu' ? 'hu-HU' : locale === 'ar' ? 'ar-EG' : 'en-US'
  const date = new Date(Date.UTC(2026, 0, 1, parsed.hours, parsed.minutes))

  return new Intl.DateTimeFormat(localeTag, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale !== 'hu',
    timeZone: 'UTC',
  }).format(date)
}

function getTodayDayKey(): DayKey {
  const idx = new Date().getDay() // 0 = Sunday
  return (['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as DayKey[])[idx]
}

function getHoursLabel(locale: Locale, hours: SiteHours) {
  const allOpenSame =
    DAYS.every((d) => !hours[d].closed) &&
    DAYS.every((d) => hours[d].open === hours.monday.open && hours[d].close === hours.monday.close)

  if (allOpenSame) {
    const openLabel = formatTime(locale, hours.monday.open)
    const closeLabel = formatTime(locale, hours.monday.close)
    return locale === 'hu'
      ? `Minden nap ${openLabel}\u2013${closeLabel}`
      : locale === 'ar'
        ? `\u064a\u0648\u0645\u064a\u0627 ${openLabel} \u2013 ${closeLabel}`
        : `Daily ${openLabel}\u2013${closeLabel}`
  }

  const today = getTodayDayKey()
  const dh = hours[today]

  if (dh.closed) {
    return locale === 'hu' ? 'Ma: Z\u00e1rva' : locale === 'ar' ? '\u0627\u0644\u064a\u0648\u0645: \u0645\u063a\u0644\u0642' : 'Today: Closed'
  }

  const openLabel = formatTime(locale, dh.open)
  const closeLabel = formatTime(locale, dh.close)

  return locale === 'hu'
    ? `Ma: ${openLabel}\u2013${closeLabel}`
    : locale === 'ar'
      ? `\u0627\u0644\u064a\u0648\u0645: ${openLabel} \u2013 ${closeLabel}`
      : `Today: ${openLabel}\u2013${closeLabel}`
}

function getDeliveryLabel(locale: Locale, deliveryAvailable: boolean) {
  if (locale === 'hu') {
    return deliveryAvailable ? 'Elérhető' : 'Jelenleg nincs'
  }

  if (locale === 'ar') {
    return deliveryAvailable ? 'متاح' : 'غير متاح حاليا'
  }

  return deliveryAvailable ? 'Available' : 'Not available'
}

function getPhoneLabel(locale: Locale) {
  if (locale === 'hu') {
    return 'Telefonszám'
  }

  if (locale === 'ar') {
    return 'رقم الهاتف'
  }

  return 'Phone number'
}

function getStoryNote(locale: Locale, hours: SiteHours, deliveryAvailable: boolean) {
  const hoursLabel = getHoursLabel(locale, hours)
  const deliveryLabel = getDeliveryLabel(locale, deliveryAvailable)

  if (locale === 'hu') {
    return `A helysz\u00edn pontos koordin\u00e1t\u00e1val van bek\u00f6tve a t\u00e9rk\u00e9phez, nyitvatart\u00e1s: ${hoursLabel}, kisz\u00e1ll\u00edt\u00e1s: ${deliveryLabel.toLowerCase()}.`
  }

  if (locale === 'ar') {
    return `\u062a\u0645 \u0631\u0628\u0637 \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0627\u062d\u062f\u0627\u062b\u064a\u0627\u062a \u062f\u0642\u064a\u0642\u0629\u060c \u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644: ${hoursLabel}\u060c \u0627\u0644\u062a\u0648\u0635\u064a\u0644: ${deliveryLabel}.`
  }

  return `Location pinned to exact Google Maps coordinates. Hours: ${hoursLabel}. Delivery: ${deliveryLabel.toLowerCase()}.`
}

export function getLocalizedContent(
  baseCopy: LocaleContent,
  locale: Locale,
  siteData: SiteData,
): LocaleContent {
  const hoursLabel = getHoursLabel(locale, siteData.hours)
  const locationLabel = siteData.business.locationLabel || baseCopy.contactCards[0]?.value || ''
  const deliveryLabel = getDeliveryLabel(locale, siteData.business.deliveryAvailable)
  const phoneNumber = siteData.business.phoneNumber.trim()
  const contactCards = baseCopy.contactCards.map((item, index) => {
    if (index === 0) {
      return { ...item, value: locationLabel }
    }

    if (index === 1) {
      return { ...item, value: hoursLabel }
    }

    if (index === 2) {
      return { ...item, value: deliveryLabel }
    }

    return item
  })

  if (phoneNumber) {
    contactCards.push({
      label: getPhoneLabel(locale),
      value: phoneNumber,
    })
  }

  return {
    ...baseCopy,
    storyPoints: baseCopy.storyPoints.map((item, index) =>
      index === 0
        ? { ...item, value: locationLabel }
        : index === 2
          ? { ...item, value: hoursLabel }
          : item,
    ),
    storyNote: getStoryNote(locale, siteData.hours, siteData.business.deliveryAvailable),
    contactCards,
  }
}

export function getMenuProductOptions(siteData: SiteData): MenuProductOption[] {
  return siteData.menuSections.flatMap((section) =>
    section.items.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      sectionId: section.id,
      sectionTitle: section.title,
      priceHuf: item.priceHuf,
      details: item.details,
    })),
  )
}

export function calculateDiscountedPrice(priceHuf: number, discountPercent: number) {
  return Math.max(0, Math.round(priceHuf * (1 - discountPercent / 100)))
}

export function getOfferStatus(offer: SiteOffer, now: Date): OfferStatus {
  if (!offer.enabled || !offer.itemId || offer.discountPercent <= 0) {
    return 'disabled'
  }

  if (offer.maxClients > 0 && offer.redeemedClients >= offer.maxClients) {
    return 'sold-out'
  }

  const startsAt = parseLocalDateTime(offer.startsAt)

  if (startsAt && now < startsAt) {
    return 'scheduled'
  }

  const endsAt = parseLocalDateTime(offer.endsAt)

  if (endsAt && now > endsAt) {
    return 'expired'
  }

  if (!isDailyWindowActive(now, offer.dailyStartTime, offer.dailyEndTime)) {
    return 'scheduled'
  }

  return 'live'
}

export function findBestLiveOfferForItem(itemId: string, offers: SiteOffer[], now: Date) {
  return offers
    .filter((offer) => offer.itemId === itemId && getOfferStatus(offer, now) === 'live')
    .sort((left, right) => right.discountPercent - left.discountPercent)[0] ?? null
}

export function getSalesQuantity(siteData: SiteData, itemId: string) {
  return siteData.productSales.find((entry) => entry.itemId === itemId)?.quantitySold ?? 0
}

export function getSalesSummary(siteData: SiteData, now: Date): SalesSummary {
  const products = getMenuProductOptions(siteData)
  const productMap = new Map(products.map((product) => [product.itemId, product]))
  const taxPercent = siteData.pricing?.taxEnabled
    ? Math.max(0, Math.min(100, siteData.pricing.taxPercent))
    : 0
  const taxMultiplier = 1 + taxPercent / 100

  return siteData.productSales.reduce<SalesSummary>(
    (summary, entry) => {
      const product = productMap.get(entry.itemId)

      if (!product) {
        return summary
      }

      const quantitySold = Math.max(0, entry.quantitySold)
      const liveOffer = findBestLiveOfferForItem(entry.itemId, siteData.offers, now)
      const effectivePrice = liveOffer
        ? calculateDiscountedPrice(product.priceHuf, liveOffer.discountPercent)
        : product.priceHuf

      return {
        totalProductsSold: summary.totalProductsSold + quantitySold,
        grossRevenueHuf: summary.grossRevenueHuf + product.priceHuf * quantitySold,
        grossRevenueWithTaxHuf:
          summary.grossRevenueWithTaxHuf + Math.round(product.priceHuf * quantitySold * taxMultiplier),
        discountedRevenueHuf: summary.discountedRevenueHuf + effectivePrice * quantitySold,
        discountedRevenueWithTaxHuf:
          summary.discountedRevenueWithTaxHuf +
          Math.round(effectivePrice * quantitySold * taxMultiplier),
      }
    },
    {
      totalProductsSold: 0,
      grossRevenueHuf: 0,
      grossRevenueWithTaxHuf: 0,
      discountedRevenueHuf: 0,
      discountedRevenueWithTaxHuf: 0,
    },
  )
}

export function collectUploadedSources(siteData: SiteData) {
  return Array.from(
    new Set(
      [...siteData.menuEvidenceImages, ...siteData.galleryImages]
        .map((image) => image.src)
        .filter((src) => src.startsWith('/uploads/')),
    ),
  )
}
