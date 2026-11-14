import { checkoutPath } from '../config/checkout';
import {
  cloudDmaOffer,
  CLOUD_DMA_CHECKOUT,
  hwidSpooferOffer,
  HWID_SPOOFER_CHECKOUT,
  MAIN_PRODUCT_CHECKOUT,
  mainProductOffers,
} from '../data/productCatalog';
import { PLACEHOLDER_COPY, PLACEHOLDER_IMAGE } from '../data/placeholders';
import { PRODUCT_ID, SITE_URL } from '../data/site';
import {
  breadcrumbSchema,
  guideArticleSchema,
  productSchema,
  webPageSchema,
  type BreadcrumbItem,
} from './schema';

export function breadcrumbsForRoute(route: string): BreadcrumbItem[] {
  if (route === '/') return [{ name: 'Home', path: '/' }];
  if (route === '/pricing/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Pricing', path: '/pricing/' },
    ];
  }
  if (route === '/cloud-dma/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Cloud DMA', path: '/cloud-dma/' },
    ];
  }
  if (route === '/hwid-spoofer/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'HWID Spoofer', path: '/hwid-spoofer/' },
    ];
  }
  if (route === '/guides/cloud-dma-setup/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Cloud DMA', path: '/cloud-dma-for-arena-breakout-infinite/' },
      { name: 'Setup guide', path: '/guides/cloud-dma-setup/' },
    ];
  }
  if (route === '/guides/bo7-cheat-requirements/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Guides', path: '/guides/bo7-cheat-requirements/' },
      { name: 'System requirements', path: '/guides/bo7-cheat-requirements/' },
    ];
  }
  if (route === '/guides/system-requirements/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'System requirements', path: '/guides/bo7-cheat-requirements/' },
    ];
  }
  if (route === '/arena-breakout-infinite-esp/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'ESP', path: '/arena-breakout-infinite-esp/' },
    ];
  }
  if (route === '/arena-breakout-infinite-aimbot/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Aimbot', path: '/arena-breakout-infinite-aimbot/' },
    ];
  }
  if (route === '/arena-breakout-infinite-cheats-pricing/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Pricing', path: '/arena-breakout-infinite-cheats-pricing/' },
    ];
  }
  if (route === '/cloud-dma-for-arena-breakout-infinite/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'Cloud DMA', path: '/cloud-dma-for-arena-breakout-infinite/' },
    ];
  }
  if (route === '/arena-breakout-infinite-hwid-spoofer/') {
    return [
      { name: 'Home', path: '/' },
      { name: 'HWID Spoofer', path: '/arena-breakout-infinite-hwid-spoofer/' },
    ];
  }
  return [{ name: 'Home', path: '/' }];
}

export function jsonLdForContentPage(input: {
  route: string;
  seoTitle: string;
  metaDescription: string;
  schemaTypes: string[];
  articlePublished?: string;
}): Record<string, unknown>[] {
  const breadcrumbs = breadcrumbsForRoute(input.route);
  const blocks: Record<string, unknown>[] = [];

  if (input.schemaTypes.includes('Product')) {
    if (input.route === '/') {
      blocks.push(
        productSchema({
          name: PLACEHOLDER_COPY.productName,
          description: input.metaDescription,
          url: '/',
          offerUrl: MAIN_PRODUCT_CHECKOUT,
          sku: 'main-product',
          image: PLACEHOLDER_IMAGE,
          productId: PRODUCT_ID,
          offers: [...mainProductOffers],
        }),
      );
    } else if (input.route === '/cloud-dma/') {
      blocks.push(
        productSchema({
          name: 'Cloud DMA',
          description: input.metaDescription,
          url: '/cloud-dma/',
          offerUrl: CLOUD_DMA_CHECKOUT,
          sku: 'cloud-dma-license',
          productId: `${SITE_URL}/cloud-dma/#product`,
          offers: [
            {
              name: cloudDmaOffer.name,
              priceUsd: cloudDmaOffer.priceUsd,
              url: CLOUD_DMA_CHECKOUT,
            },
          ],
        }),
      );
    } else if (input.route === '/hwid-spoofer/') {
      blocks.push(
        productSchema({
          name: 'HWID Spoofer',
          description: input.metaDescription,
          url: '/hwid-spoofer/',
          offerUrl: HWID_SPOOFER_CHECKOUT,
          sku: 'hwid-spoofer',
          productId: `${SITE_URL}/hwid-spoofer/#product`,
          offers: [
            {
              name: hwidSpooferOffer.name,
              priceUsd: hwidSpooferOffer.priceUsd,
              url: HWID_SPOOFER_CHECKOUT,
            },
          ],
        }),
      );
    }
  }

  if (input.schemaTypes.includes('WebPage')) {
    blocks.push(
      webPageSchema({
        name: input.seoTitle,
        description: input.metaDescription,
        url: input.route,
      }),
    );
  }

  if (
    (input.schemaTypes.includes('Article') || input.schemaTypes.includes('TechArticle')) &&
    input.articlePublished
  ) {
    blocks.push(
      guideArticleSchema({
        name: input.seoTitle,
        description: input.metaDescription,
        url: input.route,
        datePublished: input.articlePublished,
        articleType: input.schemaTypes.includes('TechArticle') ? 'TechArticle' : 'Article',
      }),
    );
  }

  if (input.schemaTypes.includes('BreadcrumbList')) {
    blocks.push(breadcrumbSchema(breadcrumbs));
  }

  return blocks;
}

export function defaultEndCtaHref(
  route: string,
  checkout?: 'main-product' | 'cloud-dma' | 'hwid-spoofer',
): string {
  if (checkout === 'cloud-dma') return checkoutPath('cloudDma');
  if (checkout === 'hwid-spoofer') return checkoutPath('hwidSpoofer');
  if (checkout === 'main-product') return checkoutPath('mainProduct');
  if (route === '/pricing/') return checkoutPath('mainProduct');
  if (route === '/cloud-dma/') return checkoutPath('cloudDma');
  if (route === '/hwid-spoofer/') return checkoutPath('hwidSpoofer');
  return checkoutPath('mainProduct');
}
