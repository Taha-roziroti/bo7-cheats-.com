import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { sitemapSerialize } from './src/config/sitemap.ts';
import { SITE_URL } from './config/site.mjs';
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  redirects: {
    '/pricing/': '/',
    '/arena-breakout-infinite-esp/': '/',
    '/arena-breakout-infinite-aimbot/': '/',
    '/arena-breakout-infinite-cheats-pricing/': '/',
    '/cloud-dma-for-arena-breakout-infinite/': '/cloud-dma/',
    '/arena-breakout-infinite-hwid-spoofer/': '/hwid-spoofer/',
    '/guides/system-requirements/': '/guides/bo7-cheat-requirements/',
    '/guides/borderlands-3-cheat-system-requirements/': '/guides/bo7-cheat-requirements/',
    '/guides/cloud-dma-setup/': '/cloud-dma/',
    '/cloud-dma-setup/': '/cloud-dma/',
    '/cheats/': '/',
    '/products/dota-2-cheats/': '/',
    '/products/dota-2-cheats/elite/': '/',
    '/products/dota-2-cheats/utilities/': '/',
    '/cheats/lite/': '/',
    '/cheats/pro/': '/',
    '/cheats/elite/': '/',
    '/cheats/compare/': '/blog/dota-2-lite-vs-pro/',
    '/contact/': '/support/',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/go/'),
      serialize: sitemapSerialize,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/unslop/**'],
      },
    },
    build: {
      cssMinify: true,
      minify: 'esbuild',
      target: 'es2022',
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/gsap')) return 'vendor-gsap';
            if (id.includes('node_modules/lenis')) return 'vendor-lenis';
          },
        },
      },
    },
  },
  build: {
    /** External CSS when large — better cache reuse than inlining on every HTML file. */
    inlineStylesheets: 'auto',
  },
});