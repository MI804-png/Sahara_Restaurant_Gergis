import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import './App.css'
import { content, localeOrder, type Locale } from './content'
import {
  calculateDiscountedPrice,
  cloneSiteData,
  collectUploadedSources,
  createGalleryImage,
  createId,
  createMenuEvidenceImage,
  createMenuItem,
  createMenuSection,
  createOffer,
  defaultSiteData,
  defaultSiteMetrics,
  findBestLiveOfferForItem,
  getLocalizedContent,
  getMenuProductOptions,
  getOfferStatus,
  getSalesQuantity,
  getSalesSummary,
  type DayKey,
  type EventRegistration,
  type OfferStatus,
  type SiteData,
  type SiteDataResponse,
  type SiteEvent,
  type SiteMetrics,
  type SiteOffer,
  DAYS,
} from './siteData'

const showcaseImageSrc = '/photos/photo-01.jpg'
const facebookProfileUrl = 'https://www.facebook.com/gorgoo.noshy'
const tiktokProfileUrl = 'https://www.tiktok.com/search/user?q=gorgoo%20noshy'
const whatsappContactUrl = 'https://wa.me/36309000866'
const facebookVideoUrl = 'https://www.facebook.com/share/v/1BR5FjpWim/'
const restaurantName = 'Sahara Restaurant'
const defaultMapsSearchUrl =
  'https://www.google.com/maps?q=47.48818588256836,19.097597122192383&z=17&hl=en'
const visitSessionKey = 'sahara-visit-tracked-v1'
const cookieConsentKey = 'sahara-cookie-consent-v1'
const DAY_LABELS: Record<DayKey, Record<'hu' | 'en' | 'ar', string>> = {
  monday:    { hu: 'Hétfő',     en: 'Monday',    ar: 'الاثنين'  },
  tuesday:   { hu: 'Kedd',      en: 'Tuesday',   ar: 'الثلاثاء' },
  wednesday: { hu: 'Szerda',    en: 'Wednesday', ar: 'الأربعاء' },
  thursday:  { hu: 'Csütörtök', en: 'Thursday',  ar: 'الخميس'   },
  friday:    { hu: 'Péntek',    en: 'Friday',    ar: 'الجمعة'   },
  saturday:  { hu: 'Szombat',   en: 'Saturday',  ar: 'السبت'    },
  sunday:    { hu: 'Vasárnap',  en: 'Sunday',    ar: 'الأحد'    },
}

const EVENT_CONTENT = {
  hu: {
    eyebrow: 'Különleges este',
    title: 'Vak Randevú Est',
    subtitle: 'Találd meg a párod egy varázslatos esti vacsoraest keretein belül a Sahara Étteremben',
    step1: 'Töltsd ki a kérdőívünket',
    step2: 'Elemezzük a kompatibilitást',
    step3: 'Ismerkedj meg vacsorán',
    date: 'Minden szombat este',
    time: '19:00 – 23:00',
    location: 'Sahara Restaurant, Budapest',
    registerBtn: 'Regisztrálok az estre',
    modalTitle: 'Regisztráció – Vak Randevú Est',
    sectionBasic: 'Alapadatok',
    sectionGoal: 'Kapcsolat célja',
    sectionAbout: 'Rólad',
    sectionStory: 'Kivel keresed a találkozót?',
    fieldName: 'Teljes neved',
    fieldAge: 'Korod',
    fieldGender: 'Nemed',
    fieldGoal: 'Mit keresel?',
    fieldAgeRange: 'Partner preferált kora',
    fieldAgeMin: 'Min. kor',
    fieldAgeMax: 'Max. kor',
    fieldInterests: 'Érdeklődési körök (pl. zene, sport, főzés, utazás)',
    fieldPersonality: 'Személyiség típusod',
    fieldCommunication: 'Kommunikációs stílusod',
    fieldLifestyle: 'Életstílusod',
    fieldValues: 'Legfontosabb értéked',
    fieldLookingFor: 'Mit keresel egy partnerben?',
    fieldRating: 'Önbizalom szintje (1 = szerény, 5 = magabiztos)',
    fieldTerms: 'Elfogadom az adatvédelmi irányelveket',
    submitBtn: 'Küldés',
    submitting: 'Küldés...',
    successTitle: 'Köszönjük a regisztrációdat! 🎉',
    successText: 'Hamarosan felvesszük veled a kapcsolatot a WhatsAppon vagy e-mailben.',
    genders: { female: 'Nő', male: 'Férfi', other: 'Egyéb' },
    goals: { casual: 'Laza ismerkedés', dating: 'Randevúzás', serious: 'Komoly kapcsolat', marriage: 'Házasság' },
    personalities: { romantic: 'Romantikus', adventurous: 'Kalandvágyó', intellectual: 'Intellektuális', creative: 'Kreatív', spontaneous: 'Spontán' },
    communications: { expressive: 'Nyílt / kifejező', reserved: 'Visszafogott / megfontolt', analytical: 'Elemző / logikus', empathetic: 'Empatikus / érzékeny' },
    lifestyles: { active: 'Aktív / sportos', moderate: 'Kiegyensúlyozott', homebody: 'Otthonszerető' },
    valuesList: { family: 'Család', career: 'Karrier', adventure: 'Kaland', creativity: 'Kreativitás', spirituality: 'Spiritualitás', security: 'Biztonság' },
  },
  en: {
    eyebrow: 'Special Evening',
    title: 'Blind Date Night',
    subtitle: 'Find your perfect match over a magical dinner evening at Sahara Restaurant',
    step1: 'Fill out our questionnaire',
    step2: 'We analyse compatibility',
    step3: 'Meet your match at dinner',
    date: 'Every Saturday evening',
    time: '7:00 PM – 11:00 PM',
    location: 'Sahara Restaurant, Budapest',
    registerBtn: 'Register for the event',
    modalTitle: 'Register – Blind Date Night',
    sectionBasic: 'Basic info',
    sectionGoal: 'Relationship goal',
    sectionAbout: 'About you',
    sectionStory: 'Who are you looking for?',
    fieldName: 'Full name',
    fieldAge: 'Your age',
    fieldGender: 'Gender',
    fieldGoal: 'What are you looking for?',
    fieldAgeRange: 'Preferred partner age',
    fieldAgeMin: 'Min. age',
    fieldAgeMax: 'Max. age',
    fieldInterests: 'Interests (e.g. music, sport, cooking, travel)',
    fieldPersonality: 'Personality type',
    fieldCommunication: 'Communication style',
    fieldLifestyle: 'Lifestyle',
    fieldValues: 'Most important value',
    fieldLookingFor: 'What do you look for in a partner?',
    fieldRating: 'Self-confidence level (1 = modest, 5 = confident)',
    fieldTerms: 'I accept the privacy policy',
    submitBtn: 'Submit',
    submitting: 'Submitting...',
    successTitle: 'Thank you for registering! 🎉',
    successText: "We'll contact you shortly via WhatsApp or email.",
    genders: { female: 'Female', male: 'Male', other: 'Other' },
    goals: { casual: 'Casual meeting', dating: 'Dating', serious: 'Serious relationship', marriage: 'Marriage' },
    personalities: { romantic: 'Romantic', adventurous: 'Adventurous', intellectual: 'Intellectual', creative: 'Creative', spontaneous: 'Spontaneous' },
    communications: { expressive: 'Open / expressive', reserved: 'Reserved / thoughtful', analytical: 'Analytical / logical', empathetic: 'Empathetic / sensitive' },
    lifestyles: { active: 'Active / sporty', moderate: 'Balanced', homebody: 'Homebody' },
    valuesList: { family: 'Family', career: 'Career', adventure: 'Adventure', creativity: 'Creativity', spirituality: 'Spirituality', security: 'Security' },
  },
  ar: {
    eyebrow: 'سهرة مميزة',
    title: 'ليلة المواعدة العمياء',
    subtitle: 'ابحث عن نصفك الآخر في سهرة عشاء رومانسية بمطعم الصحراء',
    step1: 'أجب على استبياننا',
    step2: 'نحلل مدى التوافق',
    step3: 'التقِ بشريكك على العشاء',
    date: 'كل سبت مساءً',
    time: '٧:٠٠ م – ١١:٠٠ م',
    location: 'مطعم الصحراء، بودابست',
    registerBtn: 'سجّل في الفعالية',
    modalTitle: 'التسجيل – ليلة المواعدة العمياء',
    sectionBasic: 'المعلومات الأساسية',
    sectionGoal: 'هدف العلاقة',
    sectionAbout: 'عن نفسك',
    sectionStory: 'من تبحث عنه؟',
    fieldName: 'الاسم الكامل',
    fieldAge: 'عمرك',
    fieldGender: 'الجنس',
    fieldGoal: 'ماذا تبحث عنه؟',
    fieldAgeRange: 'العمر المفضل للشريك',
    fieldAgeMin: 'الحد الأدنى',
    fieldAgeMax: 'الحد الأقصى',
    fieldInterests: 'الاهتمامات (مثل الموسيقى والرياضة والطبخ والسفر)',
    fieldPersonality: 'نوع شخصيتك',
    fieldCommunication: 'أسلوب التواصل',
    fieldLifestyle: 'نمط حياتك',
    fieldValues: 'أهم قيمة لديك',
    fieldLookingFor: 'ما الذي تبحث عنه في الشريك؟',
    fieldRating: 'مستوى الثقة بالنفس (١ = متواضع، ٥ = واثق)',
    fieldTerms: 'أوافق على سياسة الخصوصية',
    submitBtn: 'إرسال',
    submitting: '...إرسال',
    successTitle: '!شكراً لتسجيلك 🎉',
    successText: 'سنتواصل معك قريباً عبر واتساب أو البريد الإلكتروني.',
    genders: { female: 'أنثى', male: 'ذكر', other: 'غير ذلك' },
    goals: { casual: 'تعارف خفيف', dating: 'مواعدة', serious: 'علاقة جادة', marriage: 'زواج' },
    personalities: { romantic: 'رومانسي', adventurous: 'مغامر', intellectual: 'مثقف', creative: 'مبدع', spontaneous: 'تلقائي' },
    communications: { expressive: 'منفتح / معبّر', reserved: 'هادئ / متأمل', analytical: 'تحليلي / منطقي', empathetic: 'عاطفي / متعاطف' },
    lifestyles: { active: 'نشيط / رياضي', moderate: 'متوازن', homebody: 'يفضل المنزل' },
    valuesList: { family: 'الأسرة', career: 'المهنة', adventure: 'المغامرة', creativity: 'الإبداع', spirituality: 'الروحانيات', security: 'الأمان' },
  },
} as const
const apiPaths = {
  siteData: '/api/site-data',
  trackVisit: '/api/track-visit',
  verifyAdmin: '/api/admin/verify',
  saveSiteData: '/api/admin/site-data',
  uploadImage: '/api/admin/upload-image',
  deleteImage: '/api/admin/delete-image',
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

type OfferCard = {
  offer: SiteOffer
  productName: string
  sectionTitle: string
  priceHuf: number
  discountedPriceHuf: number
  status: OfferStatus
  remainingClients: number | null
}

function getHeroFrames(frames: string[]) {
  if (frames.length === 0) {
    return []
  }

  const indexes = [
    0,
    frames.length > 1 ? Math.min(5, frames.length - 1) : 0,
    frames.length > 2 ? Math.min(9, frames.length - 1) : frames.length - 1,
  ]

  return Array.from(
    new Set(indexes.map((index) => frames[index]).filter((frame): frame is string => Boolean(frame))),
  )
}

function formatSavedAt(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(
    locale === 'hu' ? 'hu-HU' : locale === 'ar' ? 'ar-EG' : 'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(value))
}

function formatLocalDateTime(locale: Locale, value: string) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(
    locale === 'hu' ? 'hu-HU' : locale === 'ar' ? 'ar-EG' : 'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(parsed)
}

function formatTimeWindow(locale: Locale, start: string, end: string) {
  const formatter = new Intl.DateTimeFormat(
    locale === 'hu' ? 'hu-HU' : locale === 'ar' ? 'ar-EG' : 'en-US',
    {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC',
    },
  )

  const toLabel = (value: string) => {
    const parts = value.split(':').map(Number)

    if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
      return value
    }

    return formatter.format(new Date(Date.UTC(2026, 0, 1, parts[0], parts[1])))
  }

  if (start && end) {
    return `${toLabel(start)} - ${toLabel(end)}`
  }

  if (start) {
    return `After ${toLabel(start)}`
  }

  if (end) {
    return `Until ${toLabel(end)}`
  }

  return null
}

function getOfferStatusLabel(locale: Locale, copy: LocaleContent, status: OfferStatus) {
  if (status === 'live') {
    return copy.offerStatusLive
  }

  if (status === 'scheduled') {
    return copy.offerStatusScheduled
  }

  if (status === 'sold-out') {
    return copy.offerStatusSoldOut
  }

  if (status === 'expired') {
    return copy.offerStatusExpired
  }

  return copy.offerStatusDisabled
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('file_read_failed'))
    }

    reader.onerror = () => reject(new Error('file_read_failed'))
    reader.readAsDataURL(file)
  })
}

async function readJsonResponse(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function deleteImageOnServer(adminUsername: string, adminKey: string, src: string) {
  await fetch(apiPaths.deleteImage, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-username': adminUsername,
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({ src }),
  })
}

function getOfferWindowLines(locale: Locale, offer: SiteOffer) {
  const lines: string[] = []
  const startsAt = formatLocalDateTime(locale, offer.startsAt)
  const endsAt = formatLocalDateTime(locale, offer.endsAt)
  const dailyWindow = formatTimeWindow(locale, offer.dailyStartTime, offer.dailyEndTime)

  if (startsAt || endsAt) {
    if (startsAt && endsAt) {
      lines.push(`${startsAt} -> ${endsAt}`)
    } else if (startsAt) {
      lines.push(`Starts ${startsAt}`)
    } else if (endsAt) {
      lines.push(`Ends ${endsAt}`)
    }
  }

  if (dailyWindow) {
    lines.push(`Hours: ${dailyWindow}`)
  }

  return lines
}

function getRevealDelay(index: number) {
  return `${Math.min(index * 24, 144)}ms`
}

function buildMapsSearchUrl(locationLabel: string) {
  const value = locationLabel.trim()

  if (!value) {
    return defaultMapsSearchUrl
  }

  // When value looks like coordinates (lat, lon), use the direct pin URL
  const coordMatch = value.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (coordMatch) {
    return `https://maps.google.com/?q=${coordMatch[1]},${coordMatch[2]}&z=17`
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurantName} ${value}`)}`
}

function buildQrCodeUrl(targetUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(targetUrl)}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getCompatibilityScore(a: EventRegistration, b: EventRegistration): number {
  let score = 0

  // ── 1. Relationship goal match (0–30) ──────────────────────────────
  // This is the most critical factor — mismatched goals = poor match
  const GOAL_SCORE: Record<string, Record<string, number>> = {
    marriage: { marriage: 30, serious: 22, dating: 10, casual: 0 },
    serious:  { marriage: 22, serious: 28, dating: 16, casual: 4 },
    dating:   { marriage: 10, serious: 16, dating: 24, casual: 10 },
    casual:   { marriage: 0,  serious: 4,  dating: 10, casual: 20 },
  }
  score += GOAL_SCORE[a.goal]?.[b.goal] ?? 12

  // ── 2. Personality complement (0–20) ───────────────────────────────
  // Complementary types score highest; identical score lower (less spark)
  const PERS_SCORE: Record<string, Record<string, number>> = {
    romantic:     { romantic: 8,  adventurous: 20, intellectual: 18, creative: 14, spontaneous: 14 },
    adventurous:  { romantic: 20, adventurous: 8,  intellectual: 12, creative: 15, spontaneous: 20 },
    intellectual: { romantic: 18, adventurous: 12, intellectual: 8,  creative: 20, spontaneous: 10 },
    creative:     { romantic: 14, adventurous: 15, intellectual: 20, creative: 8,  spontaneous: 16 },
    spontaneous:  { romantic: 14, adventurous: 20, intellectual: 10, creative: 16, spontaneous: 8  },
  }
  score += PERS_SCORE[a.personality]?.[b.personality] ?? 10

  // ── 3. Communication style complement (0–15) ───────────────────────
  // Balanced opposites work best; identical can create echo chambers
  const COMM_SCORE: Record<string, Record<string, number>> = {
    expressive: { expressive: 8,  reserved: 15, analytical: 8,  empathetic: 12 },
    reserved:   { expressive: 15, reserved: 8,  analytical: 12, empathetic: 10 },
    analytical: { expressive: 8,  reserved: 12, analytical: 8,  empathetic: 15 },
    empathetic: { expressive: 12, reserved: 10, analytical: 15, empathetic: 8  },
  }
  score += COMM_SCORE[a.communication]?.[b.communication] ?? 8

  // ── 4. Shared interests (0–15) ─────────────────────────────────────
  const ai = a.interests.toLowerCase().split(/[,;\s]+/).filter((w) => w.length > 2)
  const bi = b.interests.toLowerCase().split(/[,;\s]+/).filter((w) => w.length > 2)
  score += Math.min(ai.filter((w) => bi.includes(w)).length * 3, 15)

  // ── 5. Lifestyle compatibility (0–10) ──────────────────────────────
  const LIFE_LEVELS: Record<string, number> = { active: 2, moderate: 1, homebody: 0 }
  const lifeDiff = Math.abs((LIFE_LEVELS[a.lifestyle] ?? 1) - (LIFE_LEVELS[b.lifestyle] ?? 1))
  score += [10, 7, 2][lifeDiff] ?? 0

  // ── 6. Age preference reciprocity (0–7) ────────────────────────────
  const aAge = Number(a.age), bAge = Number(b.age)
  const aMin = Number(a.ageMin || 18), aMax = Number(a.ageMax || 99)
  const bMin = Number(b.ageMin || 18), bMax = Number(b.ageMax || 99)
  const aLikesB = bAge >= aMin && bAge <= aMax
  const bLikesA = aAge >= bMin && aAge <= bMax
  if (aLikesB && bLikesA) score += 7
  else if (aLikesB || bLikesA) score += 3

  // ── 7. Core values alignment (0–3) ─────────────────────────────────
  if (a.values && b.values && a.values === b.values) score += 3

  return Math.min(Math.round(score), 100)
}

function getCompatibilityLabel(score: number): string {
  if (score >= 85) return '💫 Perfect Match'
  if (score >= 70) return '❤️ Great Match'
  if (score >= 55) return '👍 Good Match'
  if (score >= 40) return '🤝 Possible Match'
  return '🔍 Exploring'
}

function App() {
  const [locale, setLocale] = useState<Locale>('hu')
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [siteData, setSiteData] = useState<SiteData>(() => cloneSiteData(defaultSiteData))
  const [savedSiteData, setSavedSiteData] = useState<SiteData>(() => cloneSiteData(defaultSiteData))
  const [metrics, setMetrics] = useState<SiteMetrics>(defaultSiteMetrics)
  const [hasSavedData, setHasSavedData] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [isLoadingSiteData, setIsLoadingSiteData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false)
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false)
  const [isAdminVerified, setIsAdminVerified] = useState(false)
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false)
  const [adminAccessError, setAdminAccessError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingTarget, setIsUploadingTarget] = useState<'menu' | 'gallery' | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [restorableSiteData, setRestorableSiteData] = useState<SiteData | null>(null)
  const [undoToast, setUndoToast] = useState<{ message: string } | null>(null)
  const [selectedEditorItemId, setSelectedEditorItemId] = useState('')
  const [now, setNow] = useState(() => new Date())
  // Announcement
  const [announcementDismissed, setAnnouncementDismissed] = useState(false)
  // Cookie consent
  const [cookieConsentShown, setCookieConsentShown] = useState(false)
  const [cookieConsentAccepted, setCookieConsentAccepted] = useState<boolean | null>(null)
  // Blind Date Night event
  const [showEventModal, setShowEventModal] = useState(false)
  const [eventForm, setEventForm] = useState({
    name: '', age: '', gender: 'female',
    goal: 'serious', ageMin: '', ageMax: '',
    interests: '', personality: 'romantic',
    communication: 'expressive', lifestyle: 'moderate',
    values: 'family', lookingFor: '',
    rating: 5, terms: false,
  })
  const [eventSubmitting, setEventSubmitting] = useState(false)
  const [eventSubmitted, setEventSubmitted] = useState(false)
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false)
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
  const isAdminRoute = normalizedPath === '/admin'

  const copy = getLocalizedContent(content[locale], locale, siteData)
  const galleryFrames = siteData.galleryImages
    .map((image) => image.src)
    .filter((frame): frame is string => Boolean(frame))
  const heroFrames = getHeroFrames(galleryFrames)
  const hufFormatter = new Intl.NumberFormat(
    locale === 'hu' ? 'hu-HU' : locale === 'ar' ? 'ar-EG' : 'en-US',
  )
  const isDirty = JSON.stringify(siteData) !== JSON.stringify(savedSiteData)
  const savedAtLabel = updatedAt ? formatSavedAt(locale, updatedAt) : null
  const productOptions = getMenuProductOptions(siteData)
  const normalizedSelectedItemId = useMemo(() => {
    if (selectedEditorItemId && productOptions.some((p) => p.itemId === selectedEditorItemId)) {
      return selectedEditorItemId
    }
    return productOptions[0]?.itemId ?? ''
  }, [productOptions, selectedEditorItemId])
  const selectedEditorProduct = productOptions.find(
    (product) => product.itemId === normalizedSelectedItemId,
  )
  const taxEnabled = siteData.pricing.taxEnabled
  const taxPercent = siteData.pricing.taxPercent
  const activeMapUrl = buildMapsSearchUrl(siteData.business.locationLabel)
  const qrCodeUrl = buildQrCodeUrl(activeMapUrl)
  const productMap = new Map(productOptions.map((product) => [product.itemId, product] as const))
  const offerCards = siteData.offers
    .map((offer) => {
      const product = productMap.get(offer.itemId)

      if (!product) {
        return null
      }

      return {
        offer,
        productName: product.itemName,
        sectionTitle: product.sectionTitle,
        priceHuf: product.priceHuf,
        discountedPriceHuf: calculateDiscountedPrice(product.priceHuf, offer.discountPercent),
        status: getOfferStatus(offer, now),
        remainingClients:
          offer.maxClients > 0 ? Math.max(offer.maxClients - offer.redeemedClients, 0) : null,
      } satisfies OfferCard
    })
    .filter((card): card is OfferCard => Boolean(card))
    .sort((left, right) => {
      const order: Record<OfferStatus, number> = {
        live: 0,
        scheduled: 1,
        'sold-out': 2,
        expired: 3,
        disabled: 4,
      }

      return order[left.status] - order[right.status]
    })
  const salesSummary = getSalesSummary(siteData, now)
  const liveOfferCount = offerCards.filter((card) => card.status === 'live').length
  const lastVisitLabel = metrics.lastVisitedAt ? formatSavedAt(locale, metrics.lastVisitedAt) : null

  // Event: compute schedule-aware visibility and registration status
  const isEventVisible = (() => {
    const ev = siteData.event
    if (!ev?.enabled) return false
    const n = now.getTime()
    if (ev.showFrom) {
      const from = new Date(ev.showFrom)
      if (!Number.isNaN(from.getTime()) && n < from.getTime()) return false
    }
    if (ev.showUntil) {
      const until = new Date(ev.showUntil)
      if (!Number.isNaN(until.getTime()) && n > until.getTime()) return false
    }
    return true
  })()

  const eventRegStatus: 'open' | 'not_started' | 'closed' = (() => {
    const ev = siteData.event
    const n = now.getTime()
    if (ev?.registrationOpen) {
      const from = new Date(ev.registrationOpen)
      if (!Number.isNaN(from.getTime()) && n < from.getTime()) return 'not_started'
    }
    if (ev?.registrationClose) {
      const until = new Date(ev.registrationClose)
      if (!Number.isNaN(until.getTime()) && n > until.getTime()) return 'closed'
    }
    return 'open'
  })()
  const heroBadges =
    liveOfferCount > 0
      ? [...copy.heroBadges, `${liveOfferCount} live offer${liveOfferCount === 1 ? '' : 's'}`]
      : copy.heroBadges

  const updateSiteData = (updater: (current: SiteData) => SiteData) => {
    setSiteData((current) => updater(current))
    setSaveError(null)
    setSaveMessage(null)
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = copy.dir
    document.title = isAdminRoute ? 'Sahara Restaurant Admin' : copy.browserTitle
  }, [copy.browserTitle, copy.dir, isAdminRoute, locale])

  useEffect(() => {
    // Check cookie consent on load
    const consent = localStorage.getItem(cookieConsentKey)
    if (consent === 'accepted') {
      setCookieConsentAccepted(true)
      setCookieConsentShown(false)
    } else if (consent === 'declined') {
      setCookieConsentAccepted(false)
      setCookieConsentShown(false)
    } else {
      // Show banner after 2 seconds if no consent stored
      const timer = setTimeout(() => {
        setCookieConsentShown(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCookieConsent = (accepted: boolean) => {
    setCookieConsentAccepted(accepted)
    setCookieConsentShown(false)
    localStorage.setItem(cookieConsentKey, accepted ? 'accepted' : 'declined')
    
    if (accepted) {
      // Set a cookie to track consent
      document.cookie = `sahara_consent=accepted; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`
      // Store user preferences
      document.cookie = `sahara_locale=${locale}; max-age=${60 * 60 * 24 * 365}; path=/; SameSite=Lax`
    }
  }

  useEffect(() => {
    const handlePageShow = () => {
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'

      if (currentPath === '/admin') {
        setIsAdminVerified(false)
        setAdminAccessError(null)
      }
    }

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setInstallPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadSiteData = async () => {
      try {
        setIsLoadingSiteData(true)
        const response = await fetch(apiPaths.siteData, {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('load_failed')
        }

        const payload = (await response.json()) as SiteDataResponse

        if (payload.siteData) {
          const nextSiteData = cloneSiteData(payload.siteData)
          setSiteData(nextSiteData)
          setSavedSiteData(cloneSiteData(nextSiteData))
          setHasSavedData(payload.hasSavedData)
          setUpdatedAt(payload.updatedAt)
        } else {
          const fallback = cloneSiteData(defaultSiteData)
          setSiteData(fallback)
          setSavedSiteData(cloneSiteData(fallback))
          setHasSavedData(false)
          setUpdatedAt(null)
        }

        setMetrics(payload.metrics ?? defaultSiteMetrics)
        setLoadError(null)
      } catch {
        if (controller.signal.aborted) {
          return
        }

        const fallback = cloneSiteData(defaultSiteData)
        setSiteData(fallback)
        setSavedSiteData(cloneSiteData(fallback))
        setHasSavedData(false)
        setUpdatedAt(null)
        setMetrics(defaultSiteMetrics)
        setLoadError(
          'Saved admin content could not be loaded. The page is showing the bundled default content.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSiteData(false)
        }
      }
    }

    void loadSiteData()

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!undoToast) {
      return
    }

    const timer = window.setTimeout(() => {
      setUndoToast(null)
    }, 8000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [undoToast])

  useEffect(() => {
    if (isAdminRoute) {
      return
    }

    if (window.sessionStorage.getItem(visitSessionKey)) {
      return
    }

    window.sessionStorage.setItem(visitSessionKey, '1')
    const controller = new AbortController()

    void fetch(apiPaths.trackVisit, {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await readJsonResponse(response)

        if (!controller.signal.aborted && response.ok && payload?.metrics) {
          setMetrics(payload.metrics as SiteMetrics)
        }
      })
      .catch(() => undefined)

    return () => {
      controller.abort()
    }
  }, [isAdminRoute])

  // Initialize Google AdSense ads
  useEffect(() => {
    if (!isAdminRoute && typeof window !== 'undefined') {
      const loadAds = () => {
        try {
          const adsbygoogle = (window as any).adsbygoogle || []
          const ads = document.querySelectorAll('.adsbygoogle')
          ads.forEach(() => {
            adsbygoogle.push({})
          })
        } catch (error) {
          console.error('AdSense initialization error:', error)
        }
      }

      // Delay ad initialization to ensure page is loaded
      const timer = setTimeout(loadAds, 1500)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isAdminRoute, locale])

  const handleInstall = async () => {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const handleAdminUsernameChange = (value: string) => {
    setAdminUsername(value)
    setAdminAccessError(null)
  }

  const handleAdminKeyChange = (value: string) => {
    setAdminKey(value)
    setAdminAccessError(null)
  }

  const handleVerifyAdminAccess = async () => {
    if (!isAdminRoute || isAdminVerified) {
      return
    }

    if (!adminUsername.trim() || !adminKey.trim()) {
      setAdminAccessError('Enter admin username and password to open the dashboard.')
      return
    }

    setIsVerifyingAdmin(true)
    setAdminAccessError(null)

    try {
      const response = await fetch(apiPaths.verifyAdmin, {
        method: 'POST',
        headers: {
          'x-admin-username': adminUsername.trim(),
          'x-admin-key': adminKey.trim(),
        },
      })

      if (!response.ok) {
        throw new Error('Wrong admin username or password.')
      }

      setIsAdminVerified(true)
    } catch (error) {
      setAdminAccessError(error instanceof Error ? error.message : 'Admin verification failed.')
    } finally {
      setIsVerifyingAdmin(false)
    }
  }

  const handleResetDraft = () => {
    setSiteData(cloneSiteData(savedSiteData))
    setSaveError(null)
    setSaveMessage('Draft reset to the last saved version.')
  }

  const handleRestoreDefaults = () => {
    setRestorableSiteData(cloneSiteData(siteData))
    setSiteData(cloneSiteData(defaultSiteData))
    setSaveError(null)
    setSaveMessage('Default template restored. Save permanently to keep it.')
  }

  const handleRestoreLastDelete = () => {
    if (!restorableSiteData) {
      return
    }

    setSiteData(cloneSiteData(restorableSiteData))
    setRestorableSiteData(null)
    setSaveError(null)
    setSaveMessage('Last deleted content has been restored. Save permanently to keep it.')
  }

  const handlePrintLocationQr = async () => {
    // Must open popup synchronously (in direct response to click) to avoid popup blockers
    const printWindow = window.open('', '_blank', 'width=660,height=780')

    if (!printWindow) {
      return
    }

    const locationLabel = escapeHtml(siteData.business.locationLabel || 'Sahara Restaurant')
    const mapUrl = escapeHtml(activeMapUrl)

    // Write placeholder immediately — popup must not stay on about:blank during the fetch
    printWindow.document.write(
      '<html><body style="font-family:Arial;text-align:center;padding:48px;color:#4b3323">' +
      '<p style="font-size:1.1rem">Generating QR code\u2026</p></body></html>'
    )

    // Pre-fetch QR image as a data URL so it prints without needing the network
    let imgSrc = escapeHtml(qrCodeUrl)
    try {
      const resp = await fetch(qrCodeUrl)
      const blob = await resp.blob()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
      imgSrc = escapeHtml(dataUrl)
    } catch {
      // fall back to original URL
    }

    // Overwrite with final content, then trigger print directly
    printWindow.document.open()
    printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Sahara Restaurant Location QR</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, sans-serif; margin: 0; padding: 32px 24px; color: #1f140d; background: #fff; }
      main { max-width: 460px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
      img { width: 320px; height: 320px; border: 1px solid #d7c3ac; border-radius: 18px; display: block; }
      h1 { margin: 0; font-size: 1.6rem; }
      p { margin: 0; color: #4b3323; }
      a { color: #7b3d1b; word-break: break-word; font-size: 0.85rem; }
      @media print { @page { margin: 20mm; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Sahara Restaurant</h1>
      <p>${locationLabel}</p>
      <img src="${imgSrc}" alt="Restaurant location QR code" />
      <a href="${mapUrl}">${mapUrl}</a>
    </main>
  </body>
</html>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleHoursChange = (day: DayKey, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    updateSiteData((current) => ({
      ...current,
      hours: {
        ...current.hours,
        [day]: {
          ...current.hours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleAnnouncementChange = (field: 'text' | 'enabled', value: string | boolean) => {
    updateSiteData((current) => ({
      ...current,
      announcement: { ...current.announcement, [field]: value },
    }))
  }

  const handleEventChange = (field: keyof SiteEvent, value: string | boolean) => {
    updateSiteData((current) => ({
      ...current,
      event: { ...current.event, [field]: value },
    }))
  }

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventForm.terms) return
    setEventSubmitting(true)
    try {
      await fetch('/api/register-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eventForm.name,
          age: eventForm.age,
          gender: eventForm.gender,
          goal: eventForm.goal,
          ageMin: eventForm.ageMin,
          ageMax: eventForm.ageMax,
          interests: eventForm.interests,
          personality: eventForm.personality,
          communication: eventForm.communication,
          lifestyle: eventForm.lifestyle,
          values: eventForm.values,
          lookingFor: eventForm.lookingFor,
          rating: eventForm.rating,
        }),
      })
      setEventSubmitted(true)
    } catch {
      setEventSubmitted(true)
    } finally {
      setEventSubmitting(false)
    }
  }

  const loadEventRegistrations = async () => {
    if (isLoadingRegistrations) return
    setIsLoadingRegistrations(true)
    try {
      const response = await fetch('/api/admin/event-registrations', {
        headers: {
          'x-admin-username': adminUsername.trim(),
          'x-admin-key': adminKey.trim(),
        },
      })
      if (response.ok) {
        const data = (await response.json()) as { ok: boolean; registrations: EventRegistration[] }
        setEventRegistrations(data.registrations ?? [])
      }
    } catch {
      // silently fail
    } finally {
      setIsLoadingRegistrations(false)
    }
  }

  const handleBusinessChange = (
    field: 'locationLabel' | 'phoneNumber' | 'deliveryAvailable',
    value: string | boolean,
  ) => {
    updateSiteData((current) => ({
      ...current,
      business: {
        ...current.business,
        [field]: value,
      },
    }))
  }

  const handlePricingChange = (field: 'taxEnabled' | 'taxPercent', value: string | boolean) => {
    updateSiteData((current) => ({
      ...current,
      pricing: {
        ...current.pricing,
        [field]:
          field === 'taxPercent'
            ? Math.min(100, Math.max(0, Number(value) || 0))
            : Boolean(value),
      },
    }))
  }

  const handleSectionChange = (
    sectionId: string,
    field: 'title' | 'subtitle',
    value: string,
  ) => {
    updateSiteData((current) => ({
      ...current,
      menuSections: current.menuSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    }))
  }

  const handleAddSection = () => {
    updateSiteData((current) => ({
      ...current,
      menuSections: [...current.menuSections, createMenuSection()],
    }))
  }

  const handleDeleteSection = (sectionId: string) => {
    const section = siteData.menuSections.find((entry) => entry.id === sectionId)

    if (!section) {
      return
    }

    setRestorableSiteData(cloneSiteData(siteData))
    setUndoToast({ message: `Section "${section.title || 'Untitled'}" deleted` })
    updateSiteData((current) => {
      const deletedSection = current.menuSections.find((section) => section.id === sectionId)
      const deletedItemIds = deletedSection ? deletedSection.items.map((item) => item.id) : []

      return {
        ...current,
        menuSections: current.menuSections.filter((section) => section.id !== sectionId),
        offers: current.offers.filter((offer) => !deletedItemIds.includes(offer.itemId)),
        productSales: current.productSales.filter(
          (entry) => !deletedItemIds.includes(entry.itemId),
        ),
      }
    })
    setSaveMessage('Section deleted.')
  }

  const handleAddItem = (sectionId: string) => {
    updateSiteData((current) => ({
      ...current,
      menuSections: current.menuSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [...section.items, createMenuItem()],
            }
          : section,
      ),
    }))
  }

  const handleItemChange = (
    sectionId: string,
    itemId: string,
    field: 'name' | 'details' | 'priceHuf',
    value: string,
  ) => {
    updateSiteData((current) => ({
      ...current,
      menuSections: current.menuSections.map((section) => {
        if (section.id !== sectionId) {
          return section
        }

        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  [field]: field === 'priceHuf' ? Math.max(0, Number(value) || 0) : value,
                }
              : item,
          ),
        }
      }),
    }))
  }

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    const section = siteData.menuSections.find((entry) => entry.id === sectionId)
    const item = section?.items.find((entry) => entry.id === itemId)

    if (!item) {
      return
    }

    setRestorableSiteData(cloneSiteData(siteData))
    setUndoToast({ message: `"${item.name}" deleted` })
    updateSiteData((current) => ({
      ...current,
      menuSections: current.menuSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section,
      ),
      offers: current.offers.filter((offer) => offer.itemId !== itemId),
      productSales: current.productSales.filter((entry) => entry.itemId !== itemId),
    }))
    setSaveMessage('Product deleted.')
  }

  const handleMenuImageChange = (
    imageId: string,
    field: 'src' | 'timestamp',
    value: string,
  ) => {
    updateSiteData((current) => ({
      ...current,
      menuEvidenceImages: current.menuEvidenceImages.map((image) =>
        image.id === imageId
          ? {
              ...image,
              [field]: value,
            }
          : image,
      ),
    }))
  }

  const handleGalleryImageChange = (imageId: string, value: string) => {
    updateSiteData((current) => ({
      ...current,
      galleryImages: current.galleryImages.map((image) =>
        image.id === imageId
          ? {
              ...image,
              src: value,
            }
          : image,
      ),
    }))
  }

  const handleAddMenuImage = () => {
    updateSiteData((current) => ({
      ...current,
      menuEvidenceImages: [...current.menuEvidenceImages, createMenuEvidenceImage()],
    }))
  }

  const handleDeleteMenuImage = (imageId: string) => {
    const image = siteData.menuEvidenceImages.find((entry) => entry.id === imageId)

    if (!image) {
      return
    }

    setRestorableSiteData(cloneSiteData(siteData))
    setUndoToast({ message: `"${image.timestamp || 'Image'}" deleted` })
    updateSiteData((current) => ({
      ...current,
      menuEvidenceImages: current.menuEvidenceImages.filter((image) => image.id !== imageId),
    }))
    setSaveMessage('Image deleted.')
  }

  const handleAddGalleryImage = () => {
    updateSiteData((current) => ({
      ...current,
      galleryImages: [...current.galleryImages, createGalleryImage()],
    }))
  }

  const handleDeleteGalleryImage = (imageId: string) => {
    setRestorableSiteData(cloneSiteData(siteData))
    setUndoToast({ message: 'Gallery image deleted' })
    updateSiteData((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((image) => image.id !== imageId),
    }))
    setSaveMessage('Gallery image deleted.')
  }

  const handleAddOffer = () => {
    updateSiteData((current) => ({
      ...current,
      offers: [...current.offers, createOffer(productOptions[0]?.itemId ?? '')],
    }))
  }

  const updateOffer = (offerId: string, updater: (offer: SiteOffer) => SiteOffer) => {
    updateSiteData((current) => ({
      ...current,
      offers: current.offers.map((offer) => (offer.id === offerId ? updater(offer) : offer)),
    }))
  }

  const handleDeleteOffer = (offerId: string) => {
    const offer = siteData.offers.find((entry) => entry.id === offerId)

    if (!offer) {
      return
    }

    setRestorableSiteData(cloneSiteData(siteData))
    setUndoToast({ message: `"${offer.title || 'Offer'}" deleted` })
    updateSiteData((current) => ({
      ...current,
      offers: current.offers.filter((offer) => offer.id !== offerId),
    }))
    setSaveMessage('Offer deleted.')
  }

  const handleSalesQuantityChange = (itemId: string, value: string) => {
    const quantitySold = Math.max(0, Number(value) || 0)

    updateSiteData((current) => {
      const nextEntries = current.productSales.filter((entry) => entry.itemId !== itemId)

      return {
        ...current,
        productSales: quantitySold > 0 ? [...nextEntries, { itemId, quantitySold }] : nextEntries,
      }
    })
  }

  const uploadImages = async (
    event: ChangeEvent<HTMLInputElement>,
    target: 'menu' | 'gallery',
  ) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    event.target.value = ''

    if (files.length === 0) {
      return
    }

    if (!adminUsername.trim() || !adminKey.trim()) {
      setSaveError('Enter admin username and password before uploading images.')
      return
    }

    setIsUploadingTarget(target)
    setSaveError(null)
    setSaveMessage(null)

    try {
      if (target === 'menu') {
        const uploadedImages: SiteData['menuEvidenceImages'] = []

        for (const file of files) {
          const dataUrl = await readFileAsDataUrl(file)
          const response = await fetch(apiPaths.uploadImage, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-username': adminUsername.trim(),
              'x-admin-key': adminKey.trim(),
            },
            body: JSON.stringify({ fileName: file.name, dataUrl }),
          })
          const payload = await readJsonResponse(response)

          if (!response.ok || !payload || !payload.ok || !payload.src) {
            throw new Error(
              response.status === 401
                ? 'Wrong admin username or password for image upload.'
                : 'One or more images could not be uploaded.',
            )
          }

          uploadedImages.push({
            id: createId('evidence'),
            src: String(payload.src),
            timestamp: file.name.replace(/\.[^.]+$/, ''),
          })
        }

        updateSiteData((current) => ({
          ...current,
          menuEvidenceImages: [...current.menuEvidenceImages, ...uploadedImages],
        }))
      }

      if (target === 'gallery') {
        const uploadedImages: SiteData['galleryImages'] = []

        for (const file of files) {
          const dataUrl = await readFileAsDataUrl(file)
          const response = await fetch(apiPaths.uploadImage, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-username': adminUsername.trim(),
              'x-admin-key': adminKey.trim(),
            },
            body: JSON.stringify({ fileName: file.name, dataUrl }),
          })
          const payload = await readJsonResponse(response)

          if (!response.ok || !payload || !payload.ok || !payload.src) {
            throw new Error(
              response.status === 401
                ? 'Wrong admin username or password for image upload.'
                : 'One or more images could not be uploaded.',
            )
          }

          uploadedImages.push({
            id: createId('gallery'),
            src: String(payload.src),
          })
        }

        updateSiteData((current) => ({
          ...current,
          galleryImages: [...current.galleryImages, ...uploadedImages],
        }))
      }

      setSaveMessage(
        `${files.length} image${files.length === 1 ? '' : 's'} uploaded. Save to make the current list permanent.`,
      )
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : 'One or more images could not be uploaded.',
      )
    } finally {
      setIsUploadingTarget(null)
    }
  }

  const persistSiteData = useCallback(
    async (isAutoSave = false) => {
      if (!adminUsername.trim() || !adminKey.trim()) {
        if (!isAutoSave) {
          setSaveError('Enter admin username and password before saving.')
        }
        return
      }

      setIsSaving(true)
      setSaveError(null)
      if (!isAutoSave) {
        setSaveMessage(null)
      }

      const previousUploads = collectUploadedSources(savedSiteData)
      const nextUploads = new Set(collectUploadedSources(siteData))
      const removedUploads = previousUploads.filter((src) => !nextUploads.has(src))

      try {
        const response = await fetch(apiPaths.saveSiteData, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-username': adminUsername.trim(),
            'x-admin-key': adminKey.trim(),
          },
          body: JSON.stringify({ siteData }),
        })
        const payload = await readJsonResponse(response)

        if (!response.ok || !payload || !payload.ok || !payload.siteData) {
          throw new Error(
            response.status === 401 ? 'Wrong admin username or password.' : 'Save failed.',
          )
        }

        const nextSiteData = cloneSiteData(payload.siteData as SiteData)
        setSiteData(nextSiteData)
        setSavedSiteData(cloneSiteData(nextSiteData))
        setHasSavedData(true)
        setUpdatedAt(typeof payload.updatedAt === 'string' ? payload.updatedAt : null)
        if (payload.metrics) {
          setMetrics(payload.metrics as SiteMetrics)
        }
        setSaveMessage(
          isAutoSave
            ? 'Changes auto-saved.'
            : 'Changes saved. The latest version will be loaded after refresh.',
        )

        if (removedUploads.length > 0) {
          await Promise.allSettled(
            removedUploads.map((src) =>
              deleteImageOnServer(adminUsername.trim(), adminKey.trim(), src),
            ),
          )
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Save failed.'
        setSaveError(isAutoSave ? `Auto-save failed: ${message}` : message)
      } finally {
        setIsSaving(false)
      }
    },
    [adminKey, adminUsername, savedSiteData, siteData],
  )

  const handleSave = async () => {
    await persistSiteData(false)
  }

  useEffect(() => {
    if (!isAdminRoute || !isAdminVerified || isLoadingSiteData || isSaving || !isDirty) {
      return
    }

    if (isUploadingTarget) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void persistSiteData(true)
    }, 1500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    isAdminRoute,
    isAdminVerified,
    isLoadingSiteData,
    isSaving,
    isDirty,
    isUploadingTarget,
    persistSiteData,
    siteData,
  ])

  return (
    <div className="app-shell" data-dir={copy.dir}>
      <header className="topbar" data-reveal>
        <a className="brand" href={isAdminRoute ? '/' : '#top'} aria-label="Sahara Restaurant home">
          <span className="brand-mark">S</span>
          <span>
            <strong>Sahara Restaurant</strong>
            <small>{copy.eyebrow}</small>
          </span>
        </a>

        <div className="topbar-controls">
          <nav className="language-switch" aria-label={copy.languageSwitcherLabel}>
            {localeOrder.map((item) => (
              <button
                key={item}
                type="button"
                className={item === locale ? 'language-button active' : 'language-button'}
                onClick={() => setLocale(item)}
                aria-pressed={item === locale}
              >
                {content[item].languageCode}
              </button>
            ))}
          </nav>

          <a className="button secondary topbar-route-link" href={isAdminRoute ? '/' : '/admin'}>
            {isAdminRoute ? 'View website' : 'Admin page'}
          </a>
        </div>
      </header>

      <main className={isAdminRoute ? 'page-layout admin-page-layout' : 'page-layout'}>
        {!isAdminRoute ? (
          <>
        {/* ── Announcement banner ─────────────────────────────────────── */}
        {!announcementDismissed && siteData.announcement?.enabled && siteData.announcement.text ? (
          <div className="announcement-banner" role="status">
            <p className="announcement-text">{siteData.announcement.text}</p>
            <button
              type="button"
              className="announcement-close"
              aria-label="Close announcement"
              onClick={() => setAnnouncementDismissed(true)}
            >
              ✕
            </button>
          </div>
        ) : null}
        <section className="hero-section" id="top" data-reveal>
          <div className="hero-copy">
            <p className="eyebrow-text">{copy.eyebrow}</p>
            <h1>{copy.headline}</h1>
            <p className="hero-lead">{copy.intro}</p>

            <div className="hero-actions">
              <a className="button primary" href="#offers">
                Live offers
              </a>
              <a className="button secondary" href="#menu">
                {copy.ctaGallery}
              </a>
              <a className="button secondary" href="#video">
                {copy.ctaVideo}
              </a>
              <a
                className="button secondary"
                href={facebookProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                {copy.ctaFacebook}
              </a>
              <a
                className="button secondary"
                href={tiktokProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                {copy.ctaTiktok}
              </a>
            </div>

            <div className="fact-grid">
              {copy.storyPoints.map((item, index) => (
                <article
                  key={item.label}
                  className="fact-card"
                  data-reveal
                  style={{ transitionDelay: getRevealDelay(index) }}
                >
                  <span>{item.label}</span>
                  <strong>
                    {index === 0 ? (
                      <a
                        className="location-map-link"
                        href={activeMapUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </strong>
                </article>
              ))}
            </div>

            {offerCards.length > 0 ? (
              <div className="hero-offer-ribbon" data-reveal>
                {offerCards.slice(0, 2).map((card) => (
                  <article key={card.offer.id} className={`hero-offer-chip status-${card.status}`}>
                    <span>{getOfferStatusLabel(card.status)}</span>
                    <strong>{card.productName}</strong>
                    <small>-{card.offer.discountPercent}%</small>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hero-visual" data-reveal>
            <div className="hero-frame hero-main-frame">
              {heroFrames[0] ? (
                <img src={heroFrames[0]} alt={copy.heroImageAlt} />
              ) : (
                <div className="frame-placeholder">
                  <p>{copy.galleryLoading}</p>
                </div>
              )}

              <div className="hero-badges">
                {heroBadges.map((badge) => (
                  <span key={badge} className="badge-pill">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-stack">
              {heroFrames.slice(1).map((frame, index) => (
                <div key={`${index}-${frame.slice(0, 16)}`} className="hero-frame hero-mini-frame">
                  <img src={frame} alt={`${copy.galleryImageAlt} ${index + 2}`} />
                </div>
              ))}

              {heroFrames.length < 3 ? (
                <div className="hero-frame hero-mini-frame placeholder-card">
                  <p>{copy.heroAside}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="panel-section feature-panel" id="about" data-reveal>
          <div className="section-header">
            <p className="eyebrow-text">{copy.featureEyebrow}</p>
            <h2>{copy.featureTitle}</h2>
            <p>{copy.featureIntro}</p>
          </div>

          <div className="feature-grid">
            {copy.features.map((feature, index) => (
              <article
                key={feature.title}
                className="feature-card"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>

          <div className="info-grid">
            {copy.storyPoints.map((item, index) => (
              <article
                key={item.label}
                className="info-card"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <span>{item.label}</span>
                <strong>
                  {index === 0 ? (
                    <a
                      className="location-map-link"
                      href={activeMapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </strong>
              </article>
            ))}
          </div>

          <p className="section-note">{copy.storyNote}</p>
        </section>

        <section className="panel-section showcase-panel" id="video" data-reveal>
          <div className="showcase-layout">
            <div className="showcase-media">
              <img className="showcase-video" src={showcaseImageSrc} alt={copy.heroImageAlt} />
            </div>

            <div className="showcase-copy">
              <p className="eyebrow-text">{copy.showcaseEyebrow}</p>
              <h2>{copy.showcaseTitle}</h2>
              <p>{copy.showcaseIntro}</p>

              <div className="tag-list">
                {copy.showcaseHighlights.map((item) => (
                  <span key={item} className="tag-pill">
                    {item}
                  </span>
                ))}
              </div>

              <div className="showcase-actions">
                <a
                  className="button primary"
                  href={facebookVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.ctaOriginalVideo}
                </a>
                <a
                  className="button secondary"
                  href={activeMapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.ctaMaps}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-section offers-panel" id="offers" data-reveal>
          <div className="section-header compact">
            <p className="eyebrow-text">{copy.offersEyebrow}</p>
            <h2>{copy.offersTitle}</h2>
            <p>{copy.offersIntro}</p>
          </div>

          <div className="offer-showcase-grid">
            {offerCards.length > 0 ? (
              offerCards.map((card, index) => {
                const lines = getOfferWindowLines(locale, card.offer)

                return (
                  <article
                    key={card.offer.id}
                    className={`offer-card status-${card.status}`}
                    data-reveal
                    style={{ transitionDelay: getRevealDelay(index) }}
                  >
                    <div className="offer-card-head">
                      <span className={`offer-status-pill status-${card.status}`}>
                        {getOfferStatusLabel(locale, copy, card.status)}
                      </span>
                      <strong>{card.offer.title || `${card.productName} ${copy.offerSpecialSuffix}`}</strong>
                      <small>{card.sectionTitle}</small>
                    </div>

                    <div className="offer-price-stack">
                      <span className="offer-price-old">{hufFormatter.format(card.priceHuf)} HUF</span>
                      <strong>{hufFormatter.format(card.discountedPriceHuf)} HUF</strong>
                      <small>-{card.offer.discountPercent}%</small>
                      {taxEnabled ? (
                        <small>
                          {copy.offerInclTax} {hufFormatter.format(Math.round(card.discountedPriceHuf * (1 + taxPercent / 100)))} HUF
                        </small>
                      ) : null}
                    </div>

                    <div className="offer-meta-grid">
                      <div>
                        <span>{copy.offerProduct}</span>
                        <strong>{card.productName}</strong>
                      </div>
                      <div>
                        <span>{copy.offerClients}</span>
                        <strong>
                          {card.remainingClients === null
                            ? copy.offerUnlimited
                            : `${card.remainingClients} ${copy.offerLeft}`}
                        </strong>
                      </div>
                    </div>

                    {lines.length > 0 ? (
                      <div className="offer-window-list">
                        {lines.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                )
              })
            ) : (
              <article className="offer-empty-card" data-reveal>
                <strong>{copy.offersEmpty}</strong>
                <p>{copy.offersEmptyDesc}</p>
              </article>
            )}
          </div>
        </section>

        <section className="panel-section menu-panel" id="menu" data-reveal>
          <div className="section-header compact">
            <p className="eyebrow-text">{copy.menuEyebrow}</p>
            <h2>{copy.menuTitle}</h2>
            <p>{copy.menuIntro}</p>
          </div>

          <div className="menu-evidence-grid">
            {siteData.menuEvidenceImages.map((frame, index) => (
              <a
                key={frame.id}
                className="menu-evidence-card"
                href={frame.src}
                target="_blank"
                rel="noreferrer"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <img src={frame.src} alt={`${copy.galleryImageAlt} ${frame.timestamp}`} loading="lazy" />
                <span>{frame.timestamp}</span>
              </a>
            ))}
          </div>

          <div className="menu-section-grid">
            {siteData.menuSections.map((section, index) => (
              <article
                key={section.id}
                className="menu-section-card"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <div className="menu-section-head">
                  <h3>{section.title}</h3>
                  {section.subtitle ? <span>{section.subtitle}</span> : null}
                </div>

                <div className="menu-item-list">
                  {section.items.map((item) => {
                    const liveOffer = findBestLiveOfferForItem(item.id, siteData.offers, now)
                    const discountedPrice = liveOffer
                      ? calculateDiscountedPrice(item.priceHuf, liveOffer.discountPercent)
                      : item.priceHuf

                    return (
                      <div key={`${section.id}-${item.id}`} className="menu-item-row">
                        <div className="menu-item-copy">
                          <span className="menu-item-name">{item.name}</span>
                          {item.details ? <small className="menu-item-details">{item.details}</small> : null}
                          {liveOffer ? (
                            <span className="menu-item-offer-tag">
                              {liveOffer.title || `-${liveOffer.discountPercent}% live offer`}
                            </span>
                          ) : null}
                        </div>

                        <div className="menu-item-price-stack">
                          {liveOffer ? (
                            <span className="menu-item-price-original">
                              {hufFormatter.format(item.priceHuf)} HUF
                            </span>
                          ) : null}
                          <strong className={`menu-item-price ${liveOffer ? 'offer-price-live' : ''}`}>
                            {hufFormatter.format(discountedPrice)} HUF
                          </strong>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="menu-warning-card" data-reveal>
            <strong>{copy.menuVerificationTitle}</strong>
            <p>{copy.menuDisclaimer}</p>
            <div className="menu-missing-tags">
              {copy.menuMissingSections.map((item) => (
                <span key={item} className="menu-missing-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="panel-section gallery-panel" id="gallery" data-reveal>
          <div className="section-header compact">
            <p className="eyebrow-text">{copy.galleryEyebrow}</p>
            <h2>{copy.galleryTitle}</h2>
            <p>{copy.galleryIntro}</p>
          </div>

          <p className="gallery-source-note">{copy.gallerySourceNote}</p>

          <div className="policy-grid">
            {copy.menuPolicyCards.map((item, index) => (
              <article
                key={item.label}
                className="policy-card"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <p className="policy-note">{copy.menuPolicyNote}</p>

          <div className="gallery-grid">
            {galleryFrames.map((frame, index) => (
              <figure
                key={`${frame}-${index}`}
                className="gallery-card"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <img src={frame} alt={`${copy.galleryImageAlt} ${index + 1}`} loading="lazy" />
                <figcaption>
                  <span>{copy.galleryFrameLabel}</span>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── Blind Date Night event section ────────────────────────── */}
        {isEventVisible ? (() => {
          const ec = EVENT_CONTENT[locale]
          const displayDate = siteData.event.eventDate || ec.date
          const displayTime = siteData.event.eventTime || ec.time
          return (
          <section className="panel-section event-panel" id="events" data-reveal>
            <div className="section-header">
              <p className="eyebrow-text">{ec.eyebrow}</p>
              <h2>{ec.title}</h2>
              <p>{ec.subtitle}</p>
            </div>

            <div className="event-card" data-reveal>
              <div className="event-card-glow" aria-hidden="true" />
              <div className="event-card-inner">
                <div className="event-steps">
                  <div className="event-step">
                    <span className="event-step-num">01</span>
                    <span>{ec.step1}</span>
                  </div>
                  <div className="event-step-arrow" aria-hidden="true">→</div>
                  <div className="event-step">
                    <span className="event-step-num">02</span>
                    <span>{ec.step2}</span>
                  </div>
                  <div className="event-step-arrow" aria-hidden="true">→</div>
                  <div className="event-step">
                    <span className="event-step-num">03</span>
                    <span>{ec.step3}</span>
                  </div>
                </div>

                <div className="event-meta">
                  <span className="event-meta-item">📅 {displayDate}</span>
                  <span className="event-meta-item">🕖 {displayTime}</span>
                  <span className="event-meta-item">📍 {ec.location}</span>
                </div>

                {eventRegStatus === 'open' ? (
                  <button
                    type="button"
                    className="button primary event-register-btn"
                    onClick={() => { setShowEventModal(true); setEventSubmitted(false) }}
                  >
                    {ec.registerBtn}
                  </button>
                ) : eventRegStatus === 'not_started' ? (
                  <div className="event-reg-status event-reg-soon">
                    <span>
                      {locale === 'hu' ? 'Regisztráció hamarosan nyílik' :
                       locale === 'ar' ? 'يفتح التسجيل قريباً' :
                       'Registration opens soon'}
                    </span>
                    {siteData.event.registrationOpen ? (
                      <small>{new Intl.DateTimeFormat(
                        locale === 'hu' ? 'hu-HU' : locale === 'ar' ? 'ar-EG' : 'en-US',
                        { dateStyle: 'medium', timeStyle: 'short' }
                      ).format(new Date(siteData.event.registrationOpen))}</small>
                    ) : null}
                  </div>
                ) : (
                  <div className="event-reg-status event-reg-closed">
                    <span>
                      {locale === 'hu' ? 'A regisztráció lezárult' :
                       locale === 'ar' ? 'انتهى التسجيل' :
                       'Registration closed'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Google AdSense placeholder – replace with real ad tag once account is activated */}
            <div className="ad-slot" aria-label="Advertisement" role="complementary">
              <span className="ad-slot-label">Ad</span>
              <ins className="adsbygoogle" style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto" data-full-width-responsive="true" />
            </div>
          </section>
          )
        })() : null}

        {/* ── Donation / Support section ────────────────────────── */}
        {!isAdminRoute ? (
          <section className="panel-section donation-panel" id="support" data-reveal>
            <div className="section-header">
              <p className="eyebrow-text">{copy.donationEyebrow}</p>
              <h2>{copy.donationTitle}</h2>
              <p>{copy.donationIntro}</p>
            </div>

            <div className="donation-card" data-reveal>
              <div className="donation-qr-container">
                <img 
                  src="/media/revolut-payment-qr.png" 
                  alt={copy.donationQrAlt} 
                  className="donation-qr-image"
                  loading="lazy"
                />
                <div className="donation-copy">
                  <strong>{copy.donationQrTitle}</strong>
                  <p>{copy.donationQrText}</p>
                  <span className="donation-username">{copy.donationUsername}</span>
                </div>
              </div>
            </div>

            {/* Google Ad after donation section */}
            <div className="ad-slot" aria-label="Advertisement" role="complementary">
              <span className="ad-slot-label">Ad</span>
              <ins className="adsbygoogle" style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto" data-full-width-responsive="true" />
            </div>
          </section>
        ) : null}

        {/* ── OTP Bank Payment section ────────────────────────── */}
        {!isAdminRoute ? (
          <section className="panel-section donation-panel" id="otp-payment" data-reveal>
            <div className="section-header">
              <p className="eyebrow-text">{copy.otpPaymentEyebrow}</p>
              <h2>{copy.otpPaymentTitle}</h2>
              <p>{copy.otpPaymentIntro}</p>
            </div>

            <div className="donation-card" data-reveal>
              <div className="donation-qr-container">
                <img 
                  src="/media/otp-payment-qr.jpg" 
                  alt={copy.otpPaymentQrAlt} 
                  className="donation-qr-image"
                  loading="lazy"
                />
                <div className="donation-copy">
                  <strong>{copy.otpPaymentQrTitle}</strong>
                  <p>{copy.otpPaymentQrText}</p>
                  <span className="donation-username">{copy.otpPaymentBankDetails}</span>
                </div>
              </div>
            </div>

            {/* Google Ad after OTP payment section */}
            <div className="ad-slot" aria-label="Advertisement" role="complementary">
              <span className="ad-slot-label">Ad</span>
              <ins className="adsbygoogle" style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="auto" data-full-width-responsive="true" />
            </div>
          </section>
        ) : null}

          </>
        ) : null}

        {isAdminRoute ? (
        isAdminVerified ? (
        <section className="panel-section admin-panel admin-page-panel" id="admin">
          <div className="section-header compact">
            <p className="eyebrow-text">Admin dashboard</p>
            <h2>Visitors, offers, sales totals, products, prices, and media in one place</h2>
            <p>
              This dashboard edits one permanent JSON record, counts website visits, manages timed
              product offers, and calculates total sold products from the quantities you enter.
            </p>
          </div>

          <div className="admin-toolbar">
            <label className="admin-field admin-key-field">
              <span>Admin username</span>
              <input
                type="text"
                value={adminUsername}
                onChange={(event) => handleAdminUsernameChange(event.target.value)}
                placeholder="Required for uploads and save"
                autoComplete="username"
              />
            </label>

            <label className="admin-field admin-key-field">
              <span>Admin password</span>
              <div className="admin-password-input">
                <input
                  type={isAdminPasswordVisible ? 'text' : 'password'}
                  value={adminKey}
                  onChange={(event) => handleAdminKeyChange(event.target.value)}
                  placeholder="Required for uploads and save"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setIsAdminPasswordVisible((current) => !current)}
                  aria-label={isAdminPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isAdminPasswordVisible ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </label>

            <div className="admin-status-card">
              <strong>
                {isLoadingSiteData
                  ? 'Loading saved data...'
                  : isDirty
                    ? 'Unsaved changes are in the editor.'
                    : hasSavedData
                      ? 'The saved version is currently loaded.'
                      : 'The bundled default content is currently loaded.'}
              </strong>
              {savedAtLabel ? <span>Last saved: {savedAtLabel}</span> : null}
              {loadError ? <span className="admin-error">{loadError}</span> : null}
              {saveError ? <span className="admin-error">{saveError}</span> : null}
              {saveMessage ? <span className="admin-success">{saveMessage}</span> : null}
            </div>

            <div className="admin-toolbar-actions">
              <button
                type="button"
                className="button secondary"
                onClick={handleRestoreLastDelete}
                disabled={isSaving || isLoadingSiteData || !restorableSiteData}
              >
                Restore last delete
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={handleRestoreDefaults}
                disabled={isSaving || isLoadingSiteData}
              >
                Restore bundled defaults
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={handleResetDraft}
                disabled={isSaving || isLoadingSiteData || (!isDirty && !saveMessage)}
              >
                Reset to last saved
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleSave}
                disabled={isSaving || isLoadingSiteData}
              >
                {isSaving ? 'Saving...' : 'Save permanently'}
              </button>
            </div>
          </div>

          <div className="admin-summary-grid">
            <article className="admin-summary-card" data-reveal>
              <span>Website visits</span>
              <strong>{metrics.totalVisits}</strong>
              <small>{lastVisitLabel ? `Last visit: ${lastVisitLabel}` : 'No visits tracked yet'}</small>
            </article>
            <article className="admin-summary-card" data-reveal>
              <span>Live offers</span>
              <strong>{liveOfferCount}</strong>
              <small>{offerCards.length} total configured offers</small>
            </article>
            <article className="admin-summary-card" data-reveal>
              <span>Total sold products</span>
              <strong>{salesSummary.totalProductsSold}</strong>
              <small>Calculated from the product quantities below</small>
            </article>
            <article className="admin-summary-card" data-reveal>
              <span>Offer-adjusted revenue</span>
              <strong>{hufFormatter.format(salesSummary.discountedRevenueHuf)} HUF</strong>
              <small>
                Gross: {hufFormatter.format(salesSummary.grossRevenueHuf)} HUF
                {taxEnabled
                  ? ` | With tax: ${hufFormatter.format(salesSummary.discountedRevenueWithTaxHuf)} HUF`
                  : ''}
              </small>
            </article>
          </div>

          <div className="admin-grid">
            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Opening hours</h3>
                <span>Shown everywhere the site displays operating time.</span>
              </div>

              <div className="admin-hours-grid">
                {DAYS.map((day) => {
                  const dh = siteData.hours[day]
                  return (
                    <div key={day} className={`admin-hours-row${dh.closed ? ' is-closed' : ''}`}>
                      <span className="admin-hours-day">{DAY_LABELS[day][locale]}</span>
                      <label className="admin-field admin-hours-time-field">
                        <span>Open</span>
                        <input
                          type="time"
                          value={dh.open}
                          disabled={dh.closed}
                          onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                        />
                      </label>
                      <label className="admin-field admin-hours-time-field">
                        <span>Close</span>
                        <input
                          type="time"
                          value={dh.close}
                          disabled={dh.closed}
                          onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                        />
                      </label>
                      <label className="admin-toggle-field admin-hours-toggle">
                        <input
                          type="checkbox"
                          checked={dh.closed}
                          onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                        />
                        <span>Closed</span>
                      </label>
                    </div>
                  )
                })}
              </div>
            </article>

            {/* ── Announcement banner admin ─────────────────────────────── */}
            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Announcement banner</h3>
                <span>Show a dismissible banner at the top of the public website (e.g. event notice, special hours).</span>
              </div>

              <label className="admin-field">
                <span>Announcement text</span>
                <input
                  type="text"
                  maxLength={300}
                  value={siteData.announcement?.text ?? ''}
                  onChange={(e) => handleAnnouncementChange('text', e.target.value)}
                  placeholder="e.g. Blind Date Night this Saturday – seats filling up!"
                />
              </label>

              <label className="admin-toggle-field">
                <input
                  type="checkbox"
                  checked={siteData.announcement?.enabled ?? false}
                  onChange={(e) => handleAnnouncementChange('enabled', e.target.checked)}
                />
                <span>Show banner on website</span>
              </label>
            </article>

            {/* ── Blind Date Night event registrations admin ────────────── */}
            <article className="admin-card admin-card-full" data-reveal>
              <div className="admin-card-head">
                <h3>Blind Date Night – Schedule &amp; Registrations</h3>
                <span>Set when the event appears on the website and control the registration window.</span>
              </div>

              {/* Status indicators */}
              <div className="event-admin-status-row">
                <span className={`event-admin-badge ${isEventVisible ? 'badge-live' : 'badge-off'}`}>
                  {isEventVisible ? '🟢 Event visible on site' : '⚫ Event hidden from site'}
                </span>
                <span className={`event-admin-badge ${eventRegStatus === 'open' ? 'badge-live' : eventRegStatus === 'not_started' ? 'badge-soon' : 'badge-off'}`}>
                  {eventRegStatus === 'open' ? '🟢 Registration open' :
                   eventRegStatus === 'not_started' ? '🟡 Registration not started' :
                   '🔴 Registration closed'}
                </span>
              </div>

              {/* Enable toggle */}
              <label className="admin-toggle-field">
                <input
                  type="checkbox"
                  checked={siteData.event?.enabled ?? false}
                  onChange={(e) => handleEventChange('enabled', e.target.checked)}
                />
                <span>Enable Blind Date Night section</span>
              </label>

              {/* Schedule window */}
              <p className="admin-section-label">Visibility schedule (optional – leave empty to show/hide manually)</p>
              <div className="admin-field-row">
                <label className="admin-field">
                  <span>Show from</span>
                  <input
                    type="datetime-local"
                    value={siteData.event?.showFrom ?? ''}
                    onChange={(e) => handleEventChange('showFrom', e.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Hide after</span>
                  <input
                    type="datetime-local"
                    value={siteData.event?.showUntil ?? ''}
                    onChange={(e) => handleEventChange('showUntil', e.target.value)}
                  />
                </label>
              </div>

              {/* Registration window */}
              <p className="admin-section-label">Registration period (optional)</p>
              <div className="admin-field-row">
                <label className="admin-field">
                  <span>Registration opens</span>
                  <input
                    type="datetime-local"
                    value={siteData.event?.registrationOpen ?? ''}
                    onChange={(e) => handleEventChange('registrationOpen', e.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Registration closes</span>
                  <input
                    type="datetime-local"
                    value={siteData.event?.registrationClose ?? ''}
                    onChange={(e) => handleEventChange('registrationClose', e.target.value)}
                  />
                </label>
              </div>

              {/* Display text shown to visitors */}
              <p className="admin-section-label">Event date &amp; time text shown to visitors</p>
              <div className="admin-field-row">
                <label className="admin-field">
                  <span>Event date (display text)</span>
                  <input
                    type="text"
                    maxLength={100}
                    value={siteData.event?.eventDate ?? ''}
                    onChange={(e) => handleEventChange('eventDate', e.target.value)}
                    placeholder="e.g. Saturday, 2 Aug 2026"
                  />
                </label>
                <label className="admin-field">
                  <span>Event time (display text)</span>
                  <input
                    type="text"
                    maxLength={60}
                    value={siteData.event?.eventTime ?? ''}
                    onChange={(e) => handleEventChange('eventTime', e.target.value)}
                    placeholder="e.g. 19:00 – 23:00"
                  />
                </label>
              </div>

              <button
                type="button"
                className="button secondary"
                style={{ marginTop: '8px' }}
                onClick={() => void loadEventRegistrations()}
                disabled={isLoadingRegistrations}
              >
                {isLoadingRegistrations ? 'Loading...' : 'Load registrations'}
              </button>

              {eventRegistrations.length > 0 ? (
                <>
                  <p className="admin-section-note">{eventRegistrations.length} registration{eventRegistrations.length !== 1 ? 's' : ''} found</p>

                  {/* Top compatible pairs */}
                  {(() => {
                    const pairs: { a: EventRegistration; b: EventRegistration; score: number }[] = []
                    for (let i = 0; i < eventRegistrations.length; i++) {
                      for (let j = i + 1; j < eventRegistrations.length; j++) {
                        pairs.push({
                          a: eventRegistrations[i],
                          b: eventRegistrations[j],
                          score: getCompatibilityScore(eventRegistrations[i], eventRegistrations[j]),
                        })
                      }
                    }
                    pairs.sort((x, y) => y.score - x.score)
                    const topPairs = pairs.slice(0, 5)
                    if (topPairs.length === 0) return null
                    return (
                      <div className="event-pairs-panel">
                        <h4>Top Compatible Pairs</h4>
                        <div className="event-pairs-list">
                          {topPairs.map((pair, idx) => (
                            <div key={idx} className="event-pair-card">
                              <div className="event-pair-names">{pair.a.name} &amp; {pair.b.name}</div>
                              <div className="event-pair-score">
                                <span className="event-pair-bar" style={{ width: `${pair.score}%` }} />
                                <span className="event-pair-label">{getCompatibilityLabel(pair.score)}</span>
                                <strong>{pair.score}%</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* All registrations table */}
                  <div className="event-reg-table-wrap">
                    <table className="event-reg-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Personality</th>
                          <th>Interests</th>
                          <th>Rating</th>
                          <th>Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventRegistrations.map((reg, idx) => (
                          <tr key={reg.id}>
                            <td>{idx + 1}</td>
                            <td>{reg.name}</td>
                            <td>{reg.age}</td>
                            <td>{reg.gender}</td>
                            <td>{reg.personality}</td>
                            <td className="event-reg-interests">{reg.interests}</td>
                            <td>{'★'.repeat(reg.rating)}</td>
                            <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </article>

            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Business details</h3>
                <span>Control the displayed location label, phone number, and delivery status.</span>
              </div>

              <div className="admin-field-row compact-row">
                <label className="admin-field">
                  <span>Location label</span>
                  <input
                    type="text"
                    value={siteData.business.locationLabel}
                    onChange={(event) =>
                      handleBusinessChange('locationLabel', event.target.value)
                    }
                  />
                </label>
                <label className="admin-field">
                  <span>Phone number</span>
                  <input
                    type="text"
                    value={siteData.business.phoneNumber}
                    onChange={(event) => handleBusinessChange('phoneNumber', event.target.value)}
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Delivery availability</span>
                <select
                  value={siteData.business.deliveryAvailable ? 'available' : 'unavailable'}
                  onChange={(event) =>
                    handleBusinessChange(
                      'deliveryAvailable',
                      event.target.value === 'available',
                    )
                  }
                >
                  <option value="unavailable">Not available</option>
                  <option value="available">Available</option>
                </select>
              </label>

              <div className="admin-quick-actions">
                <a className="button secondary" href={activeMapUrl} target="_blank" rel="noreferrer">
                  Show location on map
                </a>
                <button type="button" className="button secondary" onClick={() => void handlePrintLocationQr()}>
                  Print QR code
                </button>
              </div>
            </article>

            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Pricing and tax</h3>
                <span>Add optional tax percentage to revenue totals and offer calculations.</span>
              </div>

              <div className="admin-field-row compact-row">
                <label className="admin-field">
                  <span>Tax percent</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={siteData.pricing.taxPercent}
                    onChange={(event) => handlePricingChange('taxPercent', event.target.value)}
                  />
                </label>
                <label className="admin-toggle-field">
                  <input
                    type="checkbox"
                    checked={siteData.pricing.taxEnabled}
                    onChange={(event) => handlePricingChange('taxEnabled', event.target.checked)}
                  />
                  <span>Tax enabled in totals</span>
                </label>
              </div>

              <p className="admin-tax-note">
                {taxEnabled ? `Tax active: ${taxPercent}%` : 'Tax is currently disabled.'}
              </p>
            </article>

            <article className="admin-card admin-card-full" data-reveal>
              <div className="admin-card-head">
                <h3>Products and prices</h3>
                <span>Add, edit, and delete section names, products, prices, and descriptions.</span>
              </div>

              <div className="admin-field-row compact-row">
                <label className="admin-field">
                  <span>Select product before edit/delete</span>
                  <select
                    value={normalizedSelectedItemId}
                    onChange={(event) => setSelectedEditorItemId(event.target.value)}
                  >
                    {productOptions.map((product) => (
                      <option key={product.itemId} value={product.itemId}>
                        {product.sectionTitle} - {product.itemName}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="admin-selection-note">
                  <strong>
                    {selectedEditorProduct
                      ? `Editing: ${selectedEditorProduct.sectionTitle} - ${selectedEditorProduct.itemName}`
                      : 'No product selected'}
                  </strong>
                  <span>
                    Pick any pizza or menu item first, then edit or delete with full control.
                  </span>
                </div>
              </div>

              <div className="admin-section-list">
                {siteData.menuSections.map((section) => (
                  <article key={section.id} className="admin-section-card">
                    <div className="admin-inline-head">
                      <h4>{section.title || 'Untitled section'}</h4>
                      <button
                        type="button"
                        className="button secondary admin-small-button"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        Delete section
                      </button>
                    </div>

                    <div className="admin-field-row compact-row">
                      <label className="admin-field">
                        <span>Section title</span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(event) =>
                            handleSectionChange(section.id, 'title', event.target.value)
                          }
                        />
                      </label>
                      <label className="admin-field">
                        <span>Section subtitle</span>
                        <input
                          type="text"
                          value={section.subtitle}
                          onChange={(event) =>
                            handleSectionChange(section.id, 'subtitle', event.target.value)
                          }
                        />
                      </label>
                    </div>

                    <div className="admin-item-editor-list">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className={`admin-item-editor${normalizedSelectedItemId === item.id ? ' is-focused' : ''}`}
                        >
                          <div className="admin-item-editor-header">
                            <span>{item.name || 'New product'}</span>
                            <small>{hufFormatter.format(item.priceHuf)} HUF</small>
                          </div>
                          <div className="admin-field-row compact-row admin-item-top-row">
                            <label className="admin-field admin-field-grow">
                              <span>Product name</span>
                              <input
                                type="text"
                                value={item.name}
                                onFocus={() => setSelectedEditorItemId(item.id)}
                                onChange={(event) =>
                                  handleItemChange(section.id, item.id, 'name', event.target.value)
                                }
                              />
                            </label>
                            <label className="admin-field admin-field-price">
                              <span>Price (HUF)</span>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={item.priceHuf}
                                onFocus={() => setSelectedEditorItemId(item.id)}
                                onChange={(event) =>
                                  handleItemChange(
                                    section.id,
                                    item.id,
                                    'priceHuf',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                          </div>

                          <label className="admin-field">
                            <span>Description</span>
                            <textarea
                              rows={2}
                              value={item.details}
                              onFocus={() => setSelectedEditorItemId(item.id)}
                              onChange={(event) =>
                                handleItemChange(
                                  section.id,
                                  item.id,
                                  'details',
                                  event.target.value,
                                )
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className="button secondary admin-small-button admin-delete-under-description"
                            onClick={() => handleDeleteItem(section.id, item.id)}
                          >
                            Delete product
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="button secondary admin-small-button"
                      onClick={() => handleAddItem(section.id)}
                    >
                      Add product
                    </button>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="button primary admin-add-button"
                onClick={handleAddSection}
              >
                Add section
              </button>
            </article>

            <article className="admin-card admin-card-full" data-reveal>
              <div className="admin-card-head">
                <h3>Offers</h3>
                <span>
                  Choose any product, set a discount percentage, limit clients, and control the
                  active date and time window.
                </span>
              </div>

              <div className="admin-offer-list">
                {siteData.offers.map((offer) => {
                  const lines = getOfferWindowLines(locale, offer)

                  return (
                    <article key={offer.id} className="admin-offer-card">
                      <div className="admin-inline-head offer-editor-head">
                        <div>
                          <h4>{offer.title || productMap.get(offer.itemId)?.itemName || 'New offer'}</h4>
                          <span>{getOfferStatusLabel(locale, copy, getOfferStatus(offer, now))}</span>
                        </div>
                        <button
                          type="button"
                          className="button secondary admin-small-button"
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          Delete offer
                        </button>
                      </div>

                      <div className="admin-field-row three-column-row">
                        <label className="admin-field">
                          <span>Product</span>
                          <select
                            value={offer.itemId}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                itemId: event.target.value,
                              }))
                            }
                          >
                            <option value="">Select a product</option>
                            {productOptions.map((product) => (
                              <option key={product.itemId} value={product.itemId}>
                                {product.sectionTitle} - {product.itemName}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="admin-field">
                          <span>Offer title</span>
                          <input
                            type="text"
                            value={offer.title}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                title: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="admin-field">
                          <span>Discount percent</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={offer.discountPercent}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                discountPercent: Math.min(
                                  100,
                                  Math.max(0, Number(event.target.value) || 0),
                                ),
                              }))
                            }
                          />
                        </label>
                      </div>

                      <div className="admin-field-row four-column-row">
                        <label className="admin-field">
                          <span>Starts at</span>
                          <input
                            type="datetime-local"
                            value={offer.startsAt}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                startsAt: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="admin-field">
                          <span>Ends at</span>
                          <input
                            type="datetime-local"
                            value={offer.endsAt}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                endsAt: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="admin-field">
                          <span>Daily start time</span>
                          <input
                            type="time"
                            value={offer.dailyStartTime}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                dailyStartTime: event.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="admin-field">
                          <span>Daily end time</span>
                          <input
                            type="time"
                            value={offer.dailyEndTime}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                dailyEndTime: event.target.value,
                              }))
                            }
                          />
                        </label>
                      </div>

                      <div className="admin-field-row three-column-row">
                        <label className="admin-field">
                          <span>Client limit</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={offer.maxClients}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                maxClients: Math.max(0, Number(event.target.value) || 0),
                              }))
                            }
                          />
                        </label>
                        <label className="admin-field">
                          <span>Clients already used</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={offer.redeemedClients}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                redeemedClients: Math.max(0, Number(event.target.value) || 0),
                              }))
                            }
                          />
                        </label>
                        <label className="admin-toggle-field">
                          <input
                            type="checkbox"
                            checked={offer.enabled}
                            onChange={(event) =>
                              updateOffer(offer.id, (current) => ({
                                ...current,
                                enabled: event.target.checked,
                              }))
                            }
                          />
                          <span>Offer enabled</span>
                        </label>
                      </div>

                      {lines.length > 0 ? (
                        <div className="admin-offer-meta">
                          {lines.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>

              <button
                type="button"
                className="button primary admin-add-button"
                onClick={handleAddOffer}
              >
                Add offer
              </button>
            </article>

            <article className="admin-card admin-card-full" data-reveal>
              <div className="admin-card-head">
                <h3>Total sold products</h3>
                <span>
                  Enter sold quantities per product to calculate total units, gross revenue, and
                  offer-adjusted revenue.
                </span>
              </div>

              <div className="sales-summary-grid">
                <article className="sales-summary-card">
                  <span>Units sold</span>
                  <strong>{salesSummary.totalProductsSold}</strong>
                </article>
                <article className="sales-summary-card">
                  <span>Gross revenue</span>
                  <strong>
                    {hufFormatter.format(
                      taxEnabled ? salesSummary.grossRevenueWithTaxHuf : salesSummary.grossRevenueHuf,
                    )}{' '}
                    HUF
                  </strong>
                </article>
                <article className="sales-summary-card">
                  <span>Offer-adjusted revenue</span>
                  <strong>
                    {hufFormatter.format(
                      taxEnabled
                        ? salesSummary.discountedRevenueWithTaxHuf
                        : salesSummary.discountedRevenueHuf,
                    )}{' '}
                    HUF
                  </strong>
                </article>
              </div>

              <div className="sales-row-list">
                {productOptions.map((product) => {
                  const liveOffer = findBestLiveOfferForItem(product.itemId, siteData.offers, now)
                  const currentPrice = liveOffer
                    ? calculateDiscountedPrice(product.priceHuf, liveOffer.discountPercent)
                    : product.priceHuf
                  const quantitySold = getSalesQuantity(siteData, product.itemId)

                  return (
                    <div key={product.itemId} className="sales-row">
                      <div className="sales-product-copy">
                        <strong>{product.itemName}</strong>
                        <span>{product.sectionTitle}</span>
                        {liveOffer ? (
                          <small className="menu-item-offer-tag">-{liveOffer.discountPercent}% live</small>
                        ) : null}
                      </div>

                      <div className="sales-price-stack">
                        <span>{hufFormatter.format(product.priceHuf)} HUF</span>
                        <strong>{hufFormatter.format(currentPrice)} HUF</strong>
                      </div>

                      <label className="admin-field sales-quantity-field">
                        <span>Sold qty</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={quantitySold}
                          onChange={(event) =>
                            handleSalesQuantityChange(product.itemId, event.target.value)
                          }
                        />
                      </label>

                      <strong className="sales-subtotal">
                        {hufFormatter.format(currentPrice * quantitySold)} HUF
                      </strong>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Menu highlight images</h3>
                <span>These images appear above the menu sections.</span>
              </div>

              <div className="admin-upload-row">
                <label className="button secondary admin-upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => void uploadImages(event, 'menu')}
                    hidden
                  />
                  {isUploadingTarget === 'menu' ? 'Uploading...' : 'Upload image'}
                </label>
                <button type="button" className="button secondary" onClick={handleAddMenuImage}>
                  Add empty row
                </button>
              </div>

              <div className="admin-image-list">
                {siteData.menuEvidenceImages.map((image) => (
                  <div key={image.id} className="admin-image-editor">
                    <div className="admin-image-preview">
                      {image.src ? <img src={image.src} alt={image.timestamp || 'Menu image'} /> : null}
                    </div>
                    <div className="admin-image-fields">
                      <label className="admin-field">
                        <span>Image URL</span>
                        <input
                          type="text"
                          value={image.src}
                          onChange={(event) =>
                            handleMenuImageChange(image.id, 'src', event.target.value)
                          }
                          placeholder="/uploads/example.png or external URL"
                        />
                      </label>
                      <label className="admin-field">
                        <span>Label</span>
                        <input
                          type="text"
                          value={image.timestamp}
                          onChange={(event) =>
                            handleMenuImageChange(image.id, 'timestamp', event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="button secondary admin-small-button"
                      onClick={() => handleDeleteMenuImage(image.id)}
                    >
                      Delete image
                    </button>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Gallery images</h3>
                <span>These images feed the gallery and the hero collage.</span>
              </div>

              <div className="admin-upload-row">
                <label className="button secondary admin-upload-button">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => void uploadImages(event, 'gallery')}
                    hidden
                  />
                  {isUploadingTarget === 'gallery' ? 'Uploading...' : 'Upload image'}
                </label>
                <button type="button" className="button secondary" onClick={handleAddGalleryImage}>
                  Add empty row
                </button>
              </div>

              <div className="admin-image-list">
                {siteData.galleryImages.map((image) => (
                  <div key={image.id} className="admin-image-editor">
                    <div className="admin-image-preview">
                      {image.src ? <img src={image.src} alt="Gallery image" /> : null}
                    </div>
                    <div className="admin-image-fields">
                      <label className="admin-field">
                        <span>Image URL</span>
                        <input
                          type="text"
                          value={image.src}
                          onChange={(event) => handleGalleryImageChange(image.id, event.target.value)}
                          placeholder="/uploads/example.png or external URL"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="button secondary admin-small-button"
                      onClick={() => handleDeleteGalleryImage(image.id)}
                    >
                      Delete image
                    </button>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
        ) : (
        <section className="panel-section admin-panel admin-page-panel" id="admin">
          <div className="section-header compact">
            <p className="eyebrow-text">Admin access required</p>
            <h2>Enter admin username and password to open the dashboard</h2>
            <p>
              This admin area is locked for customers. Only restaurant staff with approved login
              credentials can access editing tools.
            </p>
          </div>

          <div className="admin-toolbar">
            <label className="admin-field admin-key-field">
              <span>Admin username</span>
              <input
                type="text"
                value={adminUsername}
                onChange={(event) => handleAdminUsernameChange(event.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
              />
            </label>

            <label className="admin-field admin-key-field">
              <span>Admin password</span>
              <div className="admin-password-input">
                <input
                  type={isLoginPasswordVisible ? 'text' : 'password'}
                  value={adminKey}
                  onChange={(event) => handleAdminKeyChange(event.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setIsLoginPasswordVisible((current) => !current)}
                  aria-label={isLoginPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isLoginPasswordVisible ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </label>

            <div className="admin-toolbar-actions">
              <button
                type="button"
                className="button primary"
                onClick={handleVerifyAdminAccess}
                disabled={isVerifyingAdmin}
              >
                {isVerifyingAdmin ? 'Checking...' : 'Unlock admin'}
              </button>
            </div>
          </div>

          {adminAccessError ? <p className="admin-error">{adminAccessError}</p> : null}
        </section>
        )
        ) : null}
      </main>

      {isAdminRoute ? (
      <footer className="footer-panel admin-footer-panel">
        <div className="footer-copy">
          <p className="eyebrow-text">Admin workspace</p>
          <h2>Editing stays separate from the public website for better speed and mobile layout.</h2>
          <p>
            Use this page to manage hours, products, prices, offers, visitor metrics, images, and
            sales totals, then save the latest version permanently.
          </p>
        </div>

        <div className="footer-side">
          <div className="footer-actions">
            <a className="button primary" href="/">
              Back to website
            </a>
          </div>
        </div>
      </footer>
      ) : (
      <footer className="footer-panel" id="contact" data-reveal>
        <div className="footer-copy">
          <p className="eyebrow-text">{copy.footerEyebrow}</p>
          <h2>{copy.footerTitle}</h2>
          <p>{copy.footerText}</p>
          <div className="contact-grid">
            {copy.contactCards.map((item, index) => (
              <article
                key={item.label}
                className="contact-card"
                data-reveal
                style={{ transitionDelay: getRevealDelay(index) }}
              >
                <span>{item.label}</span>
                <strong>
                  {index === 0 ? (
                    <a
                      className="location-map-link"
                      href={activeMapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </strong>
              </article>
            ))}
          </div>
          <small>{copy.footerNote}</small>
          <small className="footer-credit">Website created by <strong>Eng. Mikhael Rezk</strong></small>
        </div>

        <div className="footer-side">
          <div className="footer-actions">
            <a
              className="button primary"
              href={facebookProfileUrl}
              target="_blank"
              rel="noreferrer"
            >
              {copy.ctaFacebook}
            </a>
            <a
              className="button secondary"
              href={tiktokProfileUrl}
              target="_blank"
              rel="noreferrer"
            >
              {copy.ctaTiktok}
            </a>
            <a
              className="button secondary"
              href={whatsappContactUrl}
              target="_blank"
              rel="noreferrer"
            >
              {copy.ctaWhatsapp}
            </a>
            <a
              className="button secondary"
              href={activeMapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {copy.ctaMaps}
            </a>
            <button type="button" className="button secondary" onClick={() => void handlePrintLocationQr()}>
              Print location QR
            </button>
            <a className="button secondary" href="/admin">
              Admin page
            </a>
            {installPrompt ? (
              <button type="button" className="button secondary" onClick={handleInstall}>
                {copy.ctaInstall}
              </button>
            ) : null}
          </div>

          <div className="footer-qr-grid">
            <a
              className="qr-card"
              href={activeMapUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={copy.qrTitle}
            >
              <img src={qrCodeUrl} alt={copy.qrAlt} loading="lazy" />
              <div className="qr-copy">
                <strong>{copy.qrTitle}</strong>
                <span>{copy.qrText}</span>
              </div>
            </a>

            <div className="qr-card qr-card-revolut">
              <img src="/media/revolut-payment-qr.png" alt={copy.donationQrAlt} loading="lazy" />
              <div className="qr-copy">
                <strong>{copy.donationQrTitle}</strong>
                <span>{copy.donationUsername}</span>
              </div>
            </div>

            <div className="qr-card qr-card-otp">
              <img src="/media/otp-payment-qr.jpg" alt={copy.otpPaymentQrAlt} loading="lazy" />
              <div className="qr-copy">
                <strong>{copy.otpPaymentQrTitle}</strong>
                <span>{copy.otpPaymentBankDetails}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}

      {isAdminRoute && undoToast ? (
        <div className="undo-toast" role="status">
          <span className="undo-toast-message">{undoToast.message}</span>
          <button
            type="button"
            className="button primary undo-toast-btn"
            onClick={() => {
              handleRestoreLastDelete()
              setUndoToast(null)
            }}
          >
            Undo
          </button>
          <button
            type="button"
            className="undo-toast-close"
            onClick={() => setUndoToast(null)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ) : null}

      {/* ── Blind Date Night registration modal ─────────────────────── */}
      {showEventModal ? (() => {
        const ec = EVENT_CONTENT[locale]
        return (
        <div
          className="event-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={ec.modalTitle}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEventModal(false) }}
        >
          <div className="event-modal">
            <button
              type="button"
              className="event-modal-close"
              aria-label="Close"
              onClick={() => setShowEventModal(false)}
            >
              ✕
            </button>
            <h3 className="event-modal-title">{ec.modalTitle}</h3>

            {eventSubmitted ? (
              <div className="event-success">
                <div className="event-success-icon">🎉</div>
                <strong>{ec.successTitle}</strong>
                <p>{ec.successText}</p>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setShowEventModal(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="event-form" onSubmit={(e) => void handleEventSubmit(e)}>

                {/* Section 1: Basic info */}
                <p className="event-form-section">{ec.sectionBasic}</p>
                <label className="event-field">
                  <span>{ec.fieldName} *</span>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={eventForm.name}
                    onChange={(e) => setEventForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>

                <div className="event-field-row">
                  <label className="event-field">
                    <span>{ec.fieldAge} *</span>
                    <input
                      type="number"
                      min="18"
                      max="99"
                      required
                      value={eventForm.age}
                      onChange={(e) => setEventForm((f) => ({ ...f, age: e.target.value }))}
                    />
                  </label>
                  <label className="event-field">
                    <span>{ec.fieldGender}</span>
                    <select
                      value={eventForm.gender}
                      onChange={(e) => setEventForm((f) => ({ ...f, gender: e.target.value }))}
                    >
                      {(Object.entries(ec.genders) as [string, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Section 2: Relationship goal */}
                <p className="event-form-section">{ec.sectionGoal}</p>
                <label className="event-field">
                  <span>{ec.fieldGoal} *</span>
                  <div className="event-choice-group">
                    {(Object.entries(ec.goals) as [string, string][]).map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        className={`event-choice-btn${eventForm.goal === k ? ' selected' : ''}`}
                        onClick={() => setEventForm((f) => ({ ...f, goal: k }))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </label>

                <div className="event-field">
                  <span>{ec.fieldAgeRange}</span>
                  <div className="event-field-row">
                    <label className="event-field">
                      <span>{ec.fieldAgeMin}</span>
                      <input
                        type="number"
                        min="18"
                        max="99"
                        value={eventForm.ageMin}
                        onChange={(e) => setEventForm((f) => ({ ...f, ageMin: e.target.value }))}
                      />
                    </label>
                    <label className="event-field">
                      <span>{ec.fieldAgeMax}</span>
                      <input
                        type="number"
                        min="18"
                        max="99"
                        value={eventForm.ageMax}
                        onChange={(e) => setEventForm((f) => ({ ...f, ageMax: e.target.value }))}
                      />
                    </label>
                  </div>
                </div>

                {/* Section 3: About you */}
                <p className="event-form-section">{ec.sectionAbout}</p>
                <label className="event-field">
                  <span>{ec.fieldInterests}</span>
                  <input
                    type="text"
                    maxLength={200}
                    value={eventForm.interests}
                    onChange={(e) => setEventForm((f) => ({ ...f, interests: e.target.value }))}
                  />
                </label>

                <label className="event-field">
                  <span>{ec.fieldPersonality}</span>
                  <div className="event-choice-group">
                    {(Object.entries(ec.personalities) as [string, string][]).map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        className={`event-choice-btn${eventForm.personality === k ? ' selected' : ''}`}
                        onClick={() => setEventForm((f) => ({ ...f, personality: k }))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="event-field">
                  <span>{ec.fieldCommunication}</span>
                  <div className="event-choice-group">
                    {(Object.entries(ec.communications) as [string, string][]).map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        className={`event-choice-btn${eventForm.communication === k ? ' selected' : ''}`}
                        onClick={() => setEventForm((f) => ({ ...f, communication: k }))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </label>

                <div className="event-field-row">
                  <label className="event-field">
                    <span>{ec.fieldLifestyle}</span>
                    <select
                      value={eventForm.lifestyle}
                      onChange={(e) => setEventForm((f) => ({ ...f, lifestyle: e.target.value }))}
                    >
                      {(Object.entries(ec.lifestyles) as [string, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="event-field">
                    <span>{ec.fieldValues}</span>
                    <select
                      value={eventForm.values}
                      onChange={(e) => setEventForm((f) => ({ ...f, values: e.target.value }))}
                    >
                      {(Object.entries(ec.valuesList) as [string, string][]).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Section 4: Who you're looking for */}
                <p className="event-form-section">{ec.sectionStory}</p>
                <label className="event-field">
                  <span>{ec.fieldLookingFor}</span>
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={eventForm.lookingFor}
                    onChange={(e) => setEventForm((f) => ({ ...f, lookingFor: e.target.value }))}
                  />
                </label>

                <div className="event-field">
                  <span>{ec.fieldRating}</span>
                  <div className="event-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`event-star${eventForm.rating >= n ? ' active' : ''}`}
                        onClick={() => setEventForm((f) => ({ ...f, rating: n }))}
                        aria-label={`${n} star${n !== 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <label className="event-field event-terms">
                  <input
                    type="checkbox"
                    checked={eventForm.terms}
                    onChange={(e) => setEventForm((f) => ({ ...f, terms: e.target.checked }))}
                  />
                  <span>{ec.fieldTerms} *</span>
                </label>

                <button
                  type="submit"
                  className="button primary event-submit-btn"
                  disabled={eventSubmitting || !eventForm.terms}
                >
                  {eventSubmitting ? ec.submitting : ec.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
        )
      })() : null}

      {/* ── Cookie Consent Banner ─────────────────────── */}
      {cookieConsentShown && !isAdminRoute ? (
        <div className="cookie-consent-banner" role="dialog" aria-live="polite" aria-label={copy.cookieConsentTitle}>
          <div className="cookie-consent-content">
            <strong>{copy.cookieConsentTitle}</strong>
            <p>{copy.cookieConsentText}</p>
            <div className="cookie-consent-actions">
              <button
                type="button"
                className="button primary"
                onClick={() => handleCookieConsent(true)}
              >
                {copy.cookieConsentAccept}
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => handleCookieConsent(false)}
              >
                {copy.cookieConsentDecline}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
