/**
 * Product name translation mapping
 * Maps product names from products.ts to translation keys
 */

export const productNameToTranslationKey: Record<string, string> = {
  'Flan': 'product.flan',
  'Choco-flan': 'product.chocoFlan',
  'Cinnamon Rolls': 'product.cinnamonRolls',
  'Brownies': 'product.brownies',
  'Chocolate Matilda Cake': 'product.chocolateMatildaCake',
  'Chocolate Cheesecake': 'product.chocolateCheesecake',
  'Lemon Charlotte': 'product.lemonCharlotte',
  'Conchas': 'product.conchas',
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
  'Concha Shells': 'variant.conchaShells',
  // Product names that appear as variant names
  'Chocolate Matilda Cake': 'product.chocolateMatildaCake',
  'Chocolate Cheesecake': 'product.chocolateCheesecake',
  'Lemon Charlotte': 'product.lemonCharlotte',
}

export function getProductTranslationKey(productName: string): string {
  return productNameToTranslationKey[productName] || productName
}

export function getVariantTranslationKey(variantName: string): string {
  return variantNameToTranslationKey[variantName] || variantName
}
