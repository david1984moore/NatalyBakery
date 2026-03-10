'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { productNameToTranslationKey } from '@/lib/productTranslations';

export function MenuHeaderTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const currentProduct = searchParams.get('product');

  const handleProductChange = (productName: string) => {
    router.replace(`/menu?product=${encodeURIComponent(productName)}`);
  };

  return (
    <nav
      className="flex-1 min-w-0 flex items-center justify-center overflow-x-auto scrollbar-hide"
      aria-label="Menu categories"
    >
      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
        {products.map((product) => {
          const isSelected =
            currentProduct === product.name ||
            (!currentProduct && product.name === products[0].name);
          const translationKey =
            productNameToTranslationKey[product.name] || product.name;
          const translatedName =
            translationKey.startsWith('product.')
              ? t(translationKey as never)
              : product.name;
          return (
            <button
              key={product.name}
              onClick={() => handleProductChange(product.name)}
              className={`flex-shrink-0 min-h-[36px] px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap border border-transparent ${
                isSelected
                  ? 'bg-gradient-to-r from-[#8a7160] to-[#75604f] text-white'
                  : 'bg-transparent text-warmgray-700 hover:bg-warmbrown-500 hover:text-white'
              }`}
            >
              {translatedName}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
