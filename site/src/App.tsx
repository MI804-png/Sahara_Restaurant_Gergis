import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
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
  type OfferStatus,
  type SiteData,
  type SiteDataResponse,
  type SiteMetrics,
  type SiteOffer,
} from './siteData'

const showcaseImageSrc = '/photos/photo-01.jpg'
const facebookProfileUrl = 'https://www.facebook.com/gorgoo.noshy'
const tiktokProfileUrl = 'https://www.tiktok.com/search/user?q=gorgoo%20noshy'
const whatsappContactUrl = 'https://wa.me/36309000866'
const facebookVideoUrl = 'https://www.facebook.com/share/v/1BR5FjpWim/'
const mapsSearchUrl =
  'https://www.google.com/maps?q=47.48818588256836,19.097597122192383&z=17&hl=en'
const qrCodeUrl = '/location-qr.svg'
const visitSessionKey = 'sahara-visit-tracked-v1'
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

function getOfferStatusLabel(status: OfferStatus) {
  if (status === 'live') {
    return 'Live now'
  }

  if (status === 'scheduled') {
    return 'Scheduled'
  }

  if (status === 'sold-out') {
    return 'Client limit reached'
  }

  if (status === 'expired') {
    return 'Expired'
  }

  return 'Disabled'
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
  const [isAdminVerified, setIsAdminVerified] = useState(false)
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false)
  const [adminAccessError, setAdminAccessError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingTarget, setIsUploadingTarget] = useState<'menu' | 'gallery' | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
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
    if (!isAdminRoute && isAdminVerified) {
      setIsAdminVerified(false)
      setAdminAccessError(null)
    }
  }, [isAdminRoute, isAdminVerified])

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

  const handleHoursChange = (field: 'open' | 'close', value: string) => {
    updateSiteData((current) => ({
      ...current,
      hours: {
        ...current.hours,
        [field]: value,
      },
    }))
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
    updateSiteData((current) => ({
      ...current,
      menuEvidenceImages: current.menuEvidenceImages.filter((image) => image.id !== imageId),
    }))
  }

  const handleAddGalleryImage = () => {
    updateSiteData((current) => ({
      ...current,
      galleryImages: [...current.galleryImages, createGalleryImage()],
    }))
  }

  const handleDeleteGalleryImage = (imageId: string) => {
    updateSiteData((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((image) => image.id !== imageId),
    }))
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
    updateSiteData((current) => ({
      ...current,
      offers: current.offers.filter((offer) => offer.id !== offerId),
    }))
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
                  <strong>{item.value}</strong>
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
                <strong>{item.value}</strong>
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
                  href={mapsSearchUrl}
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
            <p className="eyebrow-text">Offer board</p>
            <h2>Timed discounts with client limits and clear schedule windows.</h2>
            <p>
              Every offer can target a specific product, apply a percentage discount, limit the
              number of clients, and run only during selected date or daily time windows.
            </p>
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
                        {getOfferStatusLabel(card.status)}
                      </span>
                      <strong>{card.offer.title || `${card.productName} special`}</strong>
                      <small>{card.sectionTitle}</small>
                    </div>

                    <div className="offer-price-stack">
                      <span className="offer-price-old">{hufFormatter.format(card.priceHuf)} HUF</span>
                      <strong>{hufFormatter.format(card.discountedPriceHuf)} HUF</strong>
                      <small>-{card.offer.discountPercent}%</small>
                    </div>

                    <div className="offer-meta-grid">
                      <div>
                        <span>Product</span>
                        <strong>{card.productName}</strong>
                      </div>
                      <div>
                        <span>Clients</span>
                        <strong>
                          {card.remainingClients === null
                            ? 'Unlimited'
                            : `${card.remainingClients} left`}
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
                <strong>No offers are configured yet.</strong>
                <p>
                  The admin can publish product discounts with start and end dates, daily hours,
                  and client limits from the admin page.
                </p>
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
              <input
                type="password"
                value={adminKey}
                onChange={(event) => handleAdminKeyChange(event.target.value)}
                placeholder="Required for uploads and save"
                autoComplete="current-password"
              />
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
              <small>Gross: {hufFormatter.format(salesSummary.grossRevenueHuf)} HUF</small>
            </article>
          </div>

          <div className="admin-grid">
            <article className="admin-card" data-reveal>
              <div className="admin-card-head">
                <h3>Opening hours</h3>
                <span>Shown everywhere the site displays operating time.</span>
              </div>

              <div className="admin-field-row compact-row">
                <label className="admin-field">
                  <span>Open</span>
                  <input
                    type="time"
                    value={siteData.hours.open}
                    onChange={(event) => handleHoursChange('open', event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Close</span>
                  <input
                    type="time"
                    value={siteData.hours.close}
                    onChange={(event) => handleHoursChange('close', event.target.value)}
                  />
                </label>
              </div>
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
            </article>

            <article className="admin-card admin-card-full" data-reveal>
              <div className="admin-card-head">
                <h3>Products and prices</h3>
                <span>Add, edit, and delete section names, products, prices, and descriptions.</span>
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
                        <div key={item.id} className="admin-item-editor">
                          <div className="admin-field-row compact-row admin-item-top-row">
                            <label className="admin-field admin-field-grow">
                              <span>Product name</span>
                              <input
                                type="text"
                                value={item.name}
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
                            <button
                              type="button"
                              className="button secondary admin-small-button"
                              onClick={() => handleDeleteItem(section.id, item.id)}
                            >
                              Delete product
                            </button>
                          </div>

                          <label className="admin-field">
                            <span>Description</span>
                            <textarea
                              rows={2}
                              value={item.details}
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
                          <span>{getOfferStatusLabel(getOfferStatus(offer, now))}</span>
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
                  <strong>{hufFormatter.format(salesSummary.grossRevenueHuf)} HUF</strong>
                </article>
                <article className="sales-summary-card">
                  <span>Offer-adjusted revenue</span>
                  <strong>{hufFormatter.format(salesSummary.discountedRevenueHuf)} HUF</strong>
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
              <input
                type="password"
                value={adminKey}
                onChange={(event) => handleAdminKeyChange(event.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
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
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
          <small>{copy.footerNote}</small>
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
              href={mapsSearchUrl}
              target="_blank"
              rel="noreferrer"
            >
              {copy.ctaMaps}
            </a>
            <a className="button secondary" href="/admin">
              Admin page
            </a>
            {installPrompt ? (
              <button type="button" className="button secondary" onClick={handleInstall}>
                {copy.ctaInstall}
              </button>
            ) : null}
          </div>

          <a
            className="qr-card"
            href={mapsSearchUrl}
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
        </div>
      </footer>
      )}
    </div>
  )
}

export default App
