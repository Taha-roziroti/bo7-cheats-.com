import { visit } from 'unist-util-visit';

function affiliateHrefForContentSlug(slug) {
  const normalized = slug.endsWith('/') ? slug : `${slug}/`;
  if (normalized === '/cloud-dma/' || normalized.includes('cloud-dma-for-arena-breakout-infinite')) {
    return '/go/cloud-dma/';
  }
  if (normalized === '/hwid-spoofer/' || normalized.includes('arena-breakout-infinite-hwid-spoofer')) {
    return '/go/hwid-spoofer/';
  }
  return '/go/main-product/';
}

const FILE_SLUG = [
  ['index.md', '/'],
  ['cloud-dma.md', '/cloud-dma/'],
  ['hwid-spoofer.md', '/hwid-spoofer/'],
  ['bo7-cheat-requirements.md', '/guides/bo7-cheat-requirements/'],
];

function slugFromFile(file) {
  const path = file.path ?? file.history?.[0] ?? '';
  const base = path.split(/[/\\]/).pop() ?? '';
  for (const [name, slug] of FILE_SLUG) {
    if (base === name || path.includes(name)) return slug;
  }
  return '/';
}

export function remarkAffiliate() {
  return (tree, file) => {
    const href = affiliateHrefForContentSlug(slugFromFile(file));
    visit(tree, 'link', (node) => {
      if (node.url === 'AFFILIATE_LINK_PLACEHOLDER') {
        node.url = href;
      }
    });
  };
}