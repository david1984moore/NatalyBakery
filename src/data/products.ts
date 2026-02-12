/**
 * Product catalog data
 * Pricing information documented in PRICING.md
 */

export interface ProductVariant {
  id: string
  name: string
  price: number
  description?: string
}

export interface Product {
  name: string
  image: string
  /** Optional gallery images - first is main/hero, rest in order. When set, enables gallery UI. */
  images?: string[]
  description?: string
  variants: ProductVariant[]
  hasVariants: boolean
  minQuantity?: number // For products like Concha Shells
}

export const products: Product[] = [
  {
    name: 'Flan',
    image: '/Images/IMG_7616.jpeg',
    hasVariants: true,
    variants: [
      {
        id: 'flan-small-plain',
        name: 'Small (6") - Plain',
        price: 30,
      },
      {
        id: 'flan-small-berries',
        name: 'Small (6") - With Fresh Berry Garnish',
        price: 36,
      },
      {
        id: 'flan-large-plain',
        name: 'Large (10") - Plain',
        price: 40,
      },
      {
        id: 'flan-large-berries',
        name: 'Large (10") - With Fresh Berry Garnish',
        price: 46,
      },
    ],
  },
  {
    name: 'Choco-flan',
    image: '/Images/choco_5.jpeg',
    images: ['/Images/choco_5.jpeg', '/Images/flan_1.jpeg', '/Images/hero_2.jpeg'],
    hasVariants: true,
    variants: [
      {
        id: 'choco-flan-small-plain',
        name: 'Small (6") - Plain',
        price: 30,
      },
      {
        id: 'choco-flan-small-berries',
        name: 'Small (6") - With Fresh Berry Garnish',
        price: 36,
      },
      {
        id: 'choco-flan-large-plain',
        name: 'Large (10") - Plain',
        price: 45,
      },
      {
        id: 'choco-flan-large-berries',
        name: 'Large (10") - With Fresh Berry Garnish',
        price: 50,
      },
    ],
  },
  {
    name: 'Cinnamon Rolls',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=1000&fit=crop&q=80',
    hasVariants: false,
    variants: [
      {
        id: 'cinnamon-rolls-6',
        name: '6 rolls/pan',
        price: 15,
      },
    ],
  },
  {
    name: 'Brownies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=1000&fit=crop&q=80',
    hasVariants: false,
    variants: [
      {
        id: 'brownies-10',
        name: '10" pan',
        price: 30,
      },
    ],
  },
  {
    name: 'Chocolate Matilda Cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=1000&fit=crop&q=80',
    hasVariants: false,
    variants: [
      {
        id: 'matilda-cake',
        name: 'Chocolate Matilda Cake',
        price: 45,
      },
    ],
  },
  {
    name: 'Chocolate Cheesecake',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=1000&fit=crop&q=80',
    hasVariants: false,
    variants: [
      {
        id: 'chocolate-cheesecake',
        name: 'Chocolate Cheesecake',
        price: 55,
      },
    ],
  },
  {
    name: 'Lemon Charlotte',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=1000&fit=crop&q=80',
    hasVariants: false,
    variants: [
      {
        id: 'lemon-charlotte',
        name: 'Lemon Charlotte',
        price: 45,
      },
    ],
  },
  {
    name: 'Conchas',
    image: '/Images/conchas_3.jpeg',
    images: ['/Images/conchas_3.jpeg', '/Images/conchas_1.jpeg', '/Images/conchas_2.jpeg', '/Images/conchas_4.jpeg'],
    hasVariants: false,
    variants: [
      {
        id: 'conchas',
        name: 'Concha Shells',
        price: 1, // Per shell
      },
    ],
    minQuantity: 10, // Minimum 10 shells per order
  },
]

/** Products that use Nataly's own photos; others show "Pics coming soon!" placeholder. */
export const PRODUCTS_WITH_REAL_PHOTOS = ['Flan', 'Choco-flan', 'Conchas']

export function getProductByName(name: string): Product | undefined {
  return products.find((p) => p.name === name)
}

export function getProductVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId)
}

/**
 * Get the default variant for a product (first variant)
 */
export function getDefaultVariant(product: Product): ProductVariant {
  return product.variants[0]
}

/**
 * Get the display price for a product
 * For products with variants, shows price range
 * For products without variants, shows single price
 */
export function getProductPriceRange(product: Product): string {
  if (product.variants.length === 1) {
    return `$${product.variants[0].price.toFixed(2)}`
  }
  const prices = product.variants.map((v) => v.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) {
    return `$${min.toFixed(2)}`
  }
  return `$${min.toFixed(2)} - $${max.toFixed(2)}`
}
