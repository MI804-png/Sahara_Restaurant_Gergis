export type MenuEntry = {
  name: string
  priceHuf: number
  details?: string
}

export type MenuSection = {
  title: string
  subtitle?: string
  items: MenuEntry[]
}

export type MenuEvidenceFrame = {
  src: string
  timestamp: string
}

export const menuEvidenceFrames: MenuEvidenceFrame[] = [
  { src: '/photos/photo-01.jpg', timestamp: 'Photo 01' },
  { src: '/photos/photo-02.jpg', timestamp: 'Photo 02' },
  { src: '/photos/photo-03.jpg', timestamp: 'Photo 03' },
]

export const extractedMenuSections: MenuSection[] = [
  {
    title: 'Pizza',
    items: [
      { name: 'Margarita', priceHuf: 2500 },
      { name: 'Sonka', priceHuf: 3000 },
      { name: 'Szalami', priceHuf: 3000 },
      { name: 'Tonál', priceHuf: 3200 },
    ],
  },
  {
    title: 'Gyros',
    items: [
      { name: 'Pitta', priceHuf: 1500 },
      { name: 'Tortilla', priceHuf: 1800 },
      { name: 'Kis tál', priceHuf: 2500 },
      { name: 'Nagy tál', priceHuf: 3000 },
    ],
  },
  {
    title: 'Rántott hús',
    items: [
      { name: 'Kis menü', priceHuf: 2200 },
      { name: 'Nagy menü', priceHuf: 2800 },
    ],
  },
  {
    title: 'Rántott sajt',
    items: [
      { name: 'Kis menü', priceHuf: 2200 },
      { name: 'Nagy menü', priceHuf: 2800 },
    ],
  },
  {
    title: 'Italok',
    items: [
      { name: 'Coca-Cola Classic 33ml', priceHuf: 500 },
      { name: 'Coca-Cola Cherry 500ml', priceHuf: 600 },
      { name: 'Sprite', priceHuf: 350 },
      { name: 'Fanta', priceHuf: 350 },
      { name: 'Ice Tea Lemon', priceHuf: 600 },
      { name: 'Ice Tea Peach', priceHuf: 350 },
      { name: 'Water (víz) - normál', priceHuf: 350 },
      { name: 'Water (víz) - gázos', priceHuf: 350 },
      { name: 'Espresso', priceHuf: 500 },
    ],
  },
]