import {
  cloudDmaOffer,
  CLOUD_DMA_CHECKOUT,
  hwidSpooferOffer,
  HWID_SPOOFER_CHECKOUT,
  MAIN_PRODUCT_CHECKOUT,
  mainProductOffers,
} from '../data/productCatalog';
export type CheckoutProductKind = 'main-product' | 'cloud-dma' | 'hwid-spoofer';
import { PRODUCT_ID, SITE_URL } from '../data/site';
import { SHOWCASE_BASE } from '../data/showcaseImages';
import { productSchema } from './schema';

const ROUTE_PRODUCT_IMAGE: Record<string, string> = {
  '/cloud-dma/': `${SHOWCASE_BASE}/bo7-esp-rooftop.webp`,
  '/hwid-spoofer/': `${SHOWCASE_BASE}/bo7-esp-warehouse.webp`,
};

export function productJsonLdForRoute(
  route: string,
  name: string,
  description: string,
  checkout: CheckoutProductKind,
): Record<string, unknown> | null {
  const image = ROUTE_PRODUCT_IMAGE[route];
  if (!image) return null;

  if (checkout === 'cloud-dma') {
    return productSchema({
      name: 'Cloud DMA for Black Ops 7',
      description,
      url: route,
      offerUrl: CLOUD_DMA_CHECKOUT,
      sku: 'cloud-dma-license',
      image,
      productId: `${SITE_URL}${route}#product`,
      offers: [
        {
          name: cloudDmaOffer.name,
          priceUsd: cloudDmaOffer.priceUsd,
          url: CLOUD_DMA_CHECKOUT,
        },
      ],
    });
  }

  if (checkout === 'hwid-spoofer') {
    return productSchema({
      name: 'Black Ops 7 HWID Spoofer',
      description,
      url: route,
      offerUrl: HWID_SPOOFER_CHECKOUT,
      sku: 'hwid-spoofer',
      image,
      productId: `${SITE_URL}${route}#product`,
      offers: [
        { name: 'HWID Spoofer — Monthly', priceUsd: 50, url: HWID_SPOOFER_CHECKOUT },
        { name: 'HWID Spoofer — Lifetime', priceUsd: 150, url: HWID_SPOOFER_CHECKOUT },
      ],
    });
  }

  return productSchema({
    name,
    description,
    url: route,
    offerUrl: MAIN_PRODUCT_CHECKOUT,
    sku: 'main-product',
    image,
    productId: PRODUCT_ID,
    offers: mainProductOffers.map((offer) => ({
      name: offer.name,
      priceUsd: offer.priceUsd,
      url: offer.url,
    })),
  });
}