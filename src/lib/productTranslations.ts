/**
 * Product name translation mapping
 * Maps product names from products.ts to translation keys
 */

export const productNameToTranslationKey: Record<string, string> = {
  'Flan': 'product.flan',
  'Choco-flan': 'product.chocoFlan',
  'Conchas': 'product.conchas',
  'Cinnamon Rolls': 'product.cinnamonRolls',
  'Brownies': 'product.brownies',
  'Apple Cheesecake': 'product.appleCheesecake',
  'Lemon Charlotte Cake': 'product.lemonCharlotteCake',
}

/**
 * Variant name translation mapping
 * Maps variant names from products.ts to translation keys
 */
export const variantNameToTranslationKey: Record<string, string> = {
  'Small (6") - Plain': 'variant.smallPlain',
  'Small (6") - With Fresh Berry Garnish': 'variant.smallBerries',
  'Large (10") - Plain': 'variant.largePlain',
  'Large (10") - With Fresh Berry Garnish': 'variant.largeBerries',
  '6 rolls/pan': 'variant.rolls6Pan',
  '10" pan': 'variant.pan10',
  // Product names that appear as variant names
  'Conchas': 'product.conchas',
  'Apple Cheesecake': 'product.appleCheesecake',
  'Lemon Charlotte Cake': 'product.lemonCharlotteCake',
}

export function getProductTranslationKey(productName: string): string {
  return productNameToTranslationKey[productName] || productName
}

export function getVariantTranslationKey(variantName: string): string {
  return variantNameToTranslationKey[variantName] || variantName
}
