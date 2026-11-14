import { checkoutPath, type CheckoutProduct } from '../config/checkout';

const AFFILIATE_PLACEHOLDER = 'AFFILIATE_LINK_PLACEHOLDER';

export function affiliateHrefForContentSlug(slug: string): string {
  const normalized = slug.endsWith('/') ? slug : `${slug}/`;
  if (normalized === '/cloud-dma/' || normalized.includes('cloud-dma-for-arena-breakout-infinite')) {
    return checkoutPath('cloudDma');
  }
  if (normalized === '/hwid-spoofer/' || normalized.includes('arena-breakout-infinite-hwid-spoofer')) {
    return checkoutPath('hwidSpoofer');
  }
  return checkoutPath('mainProduct');
}

export function injectAffiliateLinks(markdownBody: string, slug: string): string {
  const href = affiliateHrefForContentSlug(slug);
  return markdownBody.split(AFFILIATE_PLACEHOLDER).join(href);
}

export function checkoutProductForSlug(slug: string): CheckoutProduct {
  const normalized = slug.endsWith('/') ? slug : `${slug}/`;
  if (normalized === '/cloud-dma/' || normalized.includes('cloud-dma-for-arena-breakout-infinite')) {
    return 'cloudDma';
  }
  if (normalized === '/hwid-spoofer/' || normalized.includes('arena-breakout-infinite-hwid-spoofer')) {
    return 'hwidSpoofer';
  }
  return 'mainProduct';
}