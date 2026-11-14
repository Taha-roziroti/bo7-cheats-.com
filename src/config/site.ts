import {
  SITE_HOST,
  SITE_URL,
  SITE_NAME,
  SITE_PURPOSE,
  PRODUCT_ID,
  ogImageForPath,
  INDEXABLE_MONEY_ROUTES,
} from '../data/site';
import { PLACEHOLDER_COPY } from '../data/placeholders';

export {
  SITE_HOST,
  SITE_URL,
  SITE_NAME,
  SITE_PURPOSE,
  PRODUCT_ID,
  ogImageForPath,
  INDEXABLE_MONEY_ROUTES,
};

export const SITE_DOMAIN = SITE_HOST;
export const SITE_BRAND = SITE_NAME;
/** Legacy product hub path (redirected to homepage). */
export const PRODUCT_BASE = '/';
export const TITLE_PREFIX = PLACEHOLDER_COPY.title;
export const SUPPORT_EMAIL = `support@${SITE_HOST}`;