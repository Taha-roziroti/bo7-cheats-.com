import type { Translations } from './types';
import { PRIMARY_CHECKOUT_PATH } from '../config/checkout';
import { SITE_DOMAIN, SUPPORT_EMAIL } from '../config/site';
import { PLACEHOLDER_COPY, PLACEHOLDER_IMAGE } from '../data/placeholders';

const featureBlock = (n: number, bento: string) => ({
  title: `Feature ${n} (placeholder)`,
  subtitle: 'Module subtitle placeholder',
  desc: PLACEHOLDER_COPY.feature,
  bullets: ['Bullet placeholder one', 'Bullet placeholder two', 'Bullet placeholder three'],
  tags: ['tag-a', 'tag-b'],
  bento,
});

export const en: Translations = {
  site: {
    name: PLACEHOLDER_COPY.siteName,
    domain: SITE_DOMAIN,
    title: PLACEHOLDER_COPY.title,
    description: PLACEHOLDER_COPY.subtitle,
    discord: PRIMARY_CHECKOUT_PATH,
  },
  nav: [
    { href: '/#features', label: 'Features' },
    { href: '/#products', label: 'Plans' },
    { href: '/cloud-dma/', label: 'Cloud DMA' },
    { href: '/hwid-spoofer/', label: 'HWID Spoofer' },
    { href: '/guides/bo7-cheat-requirements/', label: 'Requirements' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/support/', label: 'Support' },
  ],
  navMobile: [
    { href: '/#features', label: 'Module features' },
    { href: '/#products', label: 'Pricing plans' },
    { href: '/cloud-dma/', label: 'Hyper-V Cloud DMA' },
    { href: '/hwid-spoofer/', label: 'HWID utility' },
    { href: '/guides/bo7-cheat-requirements/', label: 'PC compatibility' },
    { href: '/faq/', label: 'Pre-purchase FAQ' },
    { href: '/support/', label: 'Help desk' },
  ],
  hero: {
    status: 'Windows 10/11 · Ricochet environments',
    eyebrow: PLACEHOLDER_COPY.eyebrow,
    titleLine1: 'Black Ops 7 cheats for PC',
    titleLine2: 'Aimbot, ESP & radar',
    subtitle: PLACEHOLDER_COPY.subtitle,
    ctaPrimary: PLACEHOLDER_COPY.cta,
    ctaDiscord: 'Compare plans',
    modesLabel: 'Supported platforms (placeholder)',
    modes: ['Platform one', 'Platform two', 'Platform three'],
    metrics: [
      { label: 'Metric A', strong: 'Value' },
      { label: 'Metric B', strong: 'Value' },
      { label: 'Metric C', strong: 'Value' },
      { label: 'Metric D', strong: 'Value' },
    ],
  },
  features: {
    eyebrow: 'Black Ops 7 modules',
    title: 'Black Ops 7 Cheat Features: Aimbot, ESP & Radar',
    subtitle:
      'Screenshots below are from live Black Ops 7 sessions. Pair them with each module description before you pick a plan.',
    items: [
      {
        title: 'Player ESP',
        subtitle: 'Boxes, skeletons & distance',
        desc: 'Highlight enemies with boxes, skeleton lines, name tags, and distance readouts—readable through optics and open sights.',
        bullets: [
          'Skeleton and box pairs for CQB',
          'Nameplates and meter readouts',
          'Works with red-dot and magnified optics',
        ],
        tags: ['player esp', 'skeleton', 'distance'],
        bento: 'sm:col-span-2 lg:col-span-12 lg:col-start-1 lg:row-start-1',
      },
      {
        title: 'Aimbot',
        subtitle: 'Smooth aim assist',
        desc: 'Configurable FOV and smoothing with visible target highlights in and out of scope.',
        bullets: ['Scoped and hip-fire profiles', 'Visible target emphasis', 'Tunable FOV curves'],
        tags: ['aimbot', 'fov', 'scope'],
        bento: 'sm:col-span-2 lg:col-span-6 lg:col-start-1 lg:row-start-2',
      },
      {
        title: 'Skeleton ESP',
        subtitle: 'Through walls',
        desc: 'Bone overlays show stance and lean through cover so you can pre-aim corners.',
        bullets: ['Indoor and facility maps', 'Pairs with snaplines', 'Distance-filtered clutter control'],
        tags: ['skeleton', 'wallhack', 'esp'],
        bento: 'sm:col-span-2 lg:col-span-6 lg:col-start-7 lg:row-start-2',
      },
      {
        title: '2D radar',
        subtitle: 'Tactical awareness',
        desc: 'Grid radar with pings, sectors, and teammate markers without covering the whole HUD.',
        bullets: ['Zoom and drag controls', 'Enemy blips on grid', 'Center-on-player shortcut'],
        tags: ['radar', 'minimap', 'awareness'],
        bento: 'sm:col-span-2 lg:col-span-4 lg:col-start-1 lg:row-start-3',
      },
      {
        title: 'Loot & items',
        subtitle: 'Warehouse lanes',
        desc: 'Named ESP in cluttered lanes—useful for storage, prison, and industrial playlists.',
        bullets: ['Named bounding boxes', 'Indoor lane clarity', 'Pairs with team color filters'],
        tags: ['labels', 'indoor', 'esp'],
        bento: 'sm:col-span-2 lg:col-span-4 lg:col-start-5 lg:row-start-3',
      },
      {
        title: 'Stream overlay',
        subtitle: 'Readable in firefights',
        desc: 'Overlays stay legible during streaks and multi-kills without washing out the screen.',
        bullets: ['Double-kill feed friendly', 'Low HUD obstruction', 'Color sets for night maps'],
        tags: ['overlay', 'combat', 'hud'],
        bento: 'sm:col-span-2 lg:col-span-4 lg:col-start-9 lg:row-start-3',
      },
    ],
  },
  whyUs: {
    eyebrow: 'Compatibility',
    title: 'PC Compatibility and Setup Requirements',
    subtitle: PLACEHOLDER_COPY.subtitle,
    usLabel: PLACEHOLDER_COPY.siteName,
    otherLabel: 'Generic alternative',
    rows: [
      { title: 'Row one', desc: PLACEHOLDER_COPY.feature },
      { title: 'Row two', desc: PLACEHOLDER_COPY.feature },
      { title: 'Row three', desc: PLACEHOLDER_COPY.feature },
    ],
    metrics: [
      { value: '$--', title: 'Metric card one', desc: PLACEHOLDER_COPY.feature },
      { value: '$--', title: 'Metric card two', desc: PLACEHOLDER_COPY.feature },
      { value: '$--', title: 'Metric card three', desc: PLACEHOLDER_COPY.feature },
    ],
  },
  setup: {
    eyebrow: 'Setup',
    titleLead: 'Placeholder setup flow in',
    titleHighlight: 'three steps',
    intro: PLACEHOLDER_COPY.subtitle,
    ctaPrimary: 'Pricing placeholder',
    ctaSecondary: 'FAQ placeholder',
    ctaPrimaryHref: '/#products',
    ctaSecondaryHref: '/faq/',
    steps: [
      { step: 'Step 1', title: 'Check requirements', desc: PLACEHOLDER_COPY.feature },
      { step: 'Step 2', title: 'Choose a plan', desc: PLACEHOLDER_COPY.feature },
      { step: 'Step 3', title: 'Configure product', desc: PLACEHOLDER_COPY.feature },
    ],
  },
  compatibility: {
    eyebrow: 'Compatibility',
    title: 'Platform list placeholder',
    subtitle: PLACEHOLDER_COPY.subtitle,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
  },
  cheats: {
    eyebrow: 'Tier',
    title: 'Tier card placeholder',
    subtitle: PLACEHOLDER_COPY.subtitle,
    viewAll: 'View details placeholder',
    explore: 'Explore',
    items: [],
  },
  products: {
    eyebrow: 'Products',
    title: 'What the BO7 Cheat Software Includes',
    subtitle:
      'Main BO7 license, optional Cloud DMA, and standalone HWID utility—each with listed pricing and checkout.',
    viewAll: 'View all',
    get: 'Get',
    explore: 'Explore',
    items: [],
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Articles placeholder',
    subtitle: PLACEHOLDER_COPY.subtitle,
    latestTitle: 'Latest articles',
    latestSubtitle: PLACEHOLDER_COPY.subtitle,
    filterAll: 'All articles',
    sortLabel: 'Sort by',
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortShortRead: 'Shortest read',
    sortLongRead: 'Longest read',
    emptyFilter: 'No articles match this filter.',
    viewAll: 'View all articles',
    read: 'Read',
    items: [
      {
        tag: 'Guides',
        title: 'Placeholder blog post',
        slug: 'placeholder-post',
        image: '/images/showcase/bo7-esp-red-dot.webp',
        desc: 'Replace with a real article summary before launch.',
        date: 'Jan 1, 2026',
        readTime: '3 min read',
      },
    ],
  },
  toolkit: {
    eyebrow: 'Toolkit',
    title: 'Toolkit placeholder',
    subtitle: PLACEHOLDER_COPY.subtitle,
    items: [
      { num: '01', label: 'One', title: 'Toolkit item', desc: PLACEHOLDER_COPY.feature },
      { num: '02', label: 'Two', title: 'Toolkit item', desc: PLACEHOLDER_COPY.feature },
    ],
  },
  workflow: {
    eyebrow: 'Workflow',
    badge: '4 steps',
    titleBefore: 'Workflow placeholder until',
    titleHighlight: 'launch.',
    titleAfter: '',
    subtitle: PLACEHOLDER_COPY.subtitle,
    ctaLabel: 'Pricing',
    ctaHref: '/#products',
    ctaSecondary: 'FAQ',
    ctaSecondaryHref: '/faq/',
    items: [
      { num: '01', phase: 'Phase 1', title: 'Step title', desc: PLACEHOLDER_COPY.feature },
      { num: '02', phase: 'Phase 2', title: 'Step title', desc: PLACEHOLDER_COPY.feature },
      { num: '03', phase: 'Phase 3', title: 'Step title', desc: PLACEHOLDER_COPY.feature },
      { num: '04', phase: 'Phase 4', title: 'Step title', desc: PLACEHOLDER_COPY.feature },
    ],
  },
  fieldNotes: {
    eyebrow: 'Notes',
    title: 'Field notes placeholder',
    items: [
      { num: '01', title: 'Note one', desc: PLACEHOLDER_COPY.feature },
      { num: '02', title: 'Note two', desc: PLACEHOLDER_COPY.feature },
    ],
  },
  support: {
    eyebrow: 'Support',
    title: 'Contact BO7 Cheats support',
    subtitle:
      'Send your order email, Windows build, virtualization status, and any loader or Hyper-V error text. The more specific your ticket, the faster we can point you to the right checklist or operator escalation path.',
    channels: [
      {
        icon: 'users',
        title: 'Order help',
        desc: 'Questions about checkout links, delivery timing, monthly versus lifetime plans, or whether your PC matches the module list on the main product page.',
        linkLabel: 'Open support',
        href: PRIMARY_CHECKOUT_PATH,
      },
      {
        icon: 'headphones',
        title: 'Email',
        desc: 'Direct mail for billing references, portal access issues, Cloud DMA activation blocks, and compatibility follow-ups after Windows updates.',
        linkLabel: SUPPORT_EMAIL,
        href: `mailto:${SUPPORT_EMAIL}`,
      },
      {
        icon: 'navFaq',
        title: 'FAQ',
        desc: 'Pre-purchase answers on plans, Cloud DMA third-party costs, HWID utilities, ban risk framing, and supported Windows builds.',
        linkLabel: 'View FAQ',
        href: '/faq/',
      },
      {
        icon: 'clock',
        title: 'Guides',
        desc: 'Step-by-step BO7 PC checklist covering TPM, Secure Boot, HVCI, and RAM before you buy Cloud DMA or the main package.',
        linkLabel: 'Open guide',
        href: '/guides/bo7-cheat-requirements/',
      },
    ],
    ticketTitle: 'Include when contacting support',
    ticketItems: [
      {
        title: 'Order reference',
        desc: 'Checkout email, approximate purchase time, and whether the receipt says main BO7, Cloud DMA, or HWID utility.',
      },
      {
        title: 'System snapshot',
        desc: 'Windows edition, build number, virtualization status, and the exact error text from loader, portal, or Hyper-V dialogs.',
      },
      {
        title: 'Recent changes',
        desc: 'Note if you enabled Core Isolation, changed antivirus, or edited BIOS virtualization since the last successful load.',
      },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'FAQ placeholder',
    subtitle: PLACEHOLDER_COPY.subtitle,
    items: [
      { num: '01', q: 'Placeholder question one?', a: PLACEHOLDER_COPY.feature },
      { num: '02', q: 'Placeholder question two?', a: PLACEHOLDER_COPY.feature },
      { num: '03', q: 'Placeholder question three?', a: PLACEHOLDER_COPY.feature },
    ],
  },
  footer: {
    explore: 'Explore',
    tagline: PLACEHOLDER_COPY.subtitle,
    exploreLinks: [
      { href: '/#features', label: 'Features', ariaLabel: 'Features' },
      { href: '/cloud-dma/', label: 'Cloud DMA', ariaLabel: 'Cloud DMA' },
      { href: '/hwid-spoofer/', label: 'HWID Spoofer', ariaLabel: 'HWID Spoofer' },
      { href: '/guides/bo7-cheat-requirements/', label: 'Requirements', ariaLabel: 'Requirements' },
      { href: '/faq/', label: 'FAQ', ariaLabel: 'FAQ' },
    ],
    support: 'Support',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    about: 'About',
  },
  legalPages: {
    about: {
      title: 'What we publish on this domain',
      description: `How ${PLACEHOLDER_COPY.siteName} documents Black Ops 7 PC software, compatibility, and checkout.`,
      sections: [
        {
          heading: 'Editorial scope',
          paragraphs: [
            `${PLACEHOLDER_COPY.siteName} is an independent information site for Black Ops 7 on PC. We explain aimbot, ESP, radar, Cloud DMA, and HWID utilities with real in-game screenshots—not generic marketing claims copied from other games.`,
            'Product checkout happens through affiliate bridges under /go/. We do not host game clients, deliver license keys directly, or run anti-cheat software on your machine.',
            'Screenshots and feature callouts on the homepage and product pages are chosen to show actual module layouts so you can compare visuals before you reach an external operator checkout.',
          ],
        },
        {
          heading: 'How we research compatibility',
          paragraphs: [
            'Windows build numbers, Hyper-V requirements, TPM, Secure Boot, and HVCI settings are checked against operator documentation and updated in the system-requirements guide when Microsoft or the publisher changes baselines.',
            'Cloud DMA content explains the difference between the infrastructure license sold here and mandatory third-party services such as GREENWARD, static server hosting, and AWS billing so buyers can budget accurately.',
            'HWID utility copy focuses on when the standalone product is appropriate versus relying on the main BO7 package alone, including notes about Ricochet environments on PC.',
          ],
        },
        {
          heading: 'Affiliate relationships and transparency',
          paragraphs: [
            'Purchases complete on third-party operator sites. We may earn a referral fee when you use our checkout links, which is disclosed in the terms and does not change the price shown on the operator portal.',
            'We do not store payment card numbers or portal passwords. After checkout, delivery, updates, and refunds are handled entirely by the operator whose link you used.',
            'If an offer changes, we aim to update listing prices and FAQ answers on the same business day we receive confirmation from the operator feed.',
          ],
        },
        {
          heading: 'Updates and accuracy',
          paragraphs: [
            'Requirements, pricing, and feature lists mirror the operator portal when possible. When Activision or Windows changes compatibility, we update the money pages and system-requirements guide first.',
            'Use the FAQ and support channels if you spot a mismatch between this site and your portal—include a screenshot and we will reconcile the copy.',
          ],
        },
        {
          heading: 'Who should use this site',
          paragraphs: [
            'Players evaluating BO7 PC software who need plain-language setup context, visual proof of modules, and checklists before spending money on the wrong product variant.',
            'We are not the game publisher, anti-cheat vendor, or operator support desk. For billing disputes after purchase, contact the operator listed on your receipt.',
            'Journalists or community moderators may cite our requirements guide when explaining Hyper-V or HWID terminology, provided they link back to the canonical URL on bo7-cheats.com.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      description: `How ${PLACEHOLDER_COPY.siteName} handles analytics, cookies, and affiliate checkout referrals on ${SITE_DOMAIN}.`,
      sections: [
        {
          heading: 'Information we collect',
          paragraphs: [
            'We collect standard web analytics (pages viewed, referrer, device class, approximate region) to keep content accurate and measure traffic. Checkout happens on third-party operator sites—we do not store payment card numbers or bank details on bo7-cheats.com.',
            'Support email may include system diagnostics you voluntarily send. Treat those messages as sensitive and avoid attaching unrelated personal files.',
          ],
        },
        {
          heading: 'Cookies and analytics',
          paragraphs: [
            'We may use privacy-preserving analytics or tag managers to understand which guides and product pages help buyers make decisions. You can block cookies in your browser; core informational pages will still load.',
            'We do not use cookies to resell browsing history to ad networks unrelated to measuring our own content performance.',
            'Measurement scripts are limited to aggregate counts— we do not build individual advertising profiles from FAQ or requirements page views.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'We apply TLS encryption for pages served on bo7-cheats.com and monitor access logs for unusual spikes that might indicate scraping or credential stuffing against support mail forms.',
            'We do not sell mailing lists built from support correspondence.',
          ],
        },
        {
          heading: 'Affiliate checkout',
          paragraphs: [
            'Links marked as sponsored route to external checkout. Those providers apply their own privacy policies once you leave bo7-cheats.com, including how they store account credentials and hardware identifiers.',
            'Affiliate bridges under /go/ exist only to hand off traffic—we do not index them for search and they should not collect additional data beyond the operator redirect.',
          ],
        },
        {
          heading: 'Data retention',
          paragraphs: [
            'Server logs rotate on a short schedule and are used for security monitoring. Support mail is kept only as long as needed to resolve your ticket unless law requires a longer period.',
          ],
        },
        {
          heading: 'Your choices',
          paragraphs: [
            'You may request deletion of support correspondence that includes personal data by emailing from the same address you used to contact us.',
            'You may opt out of non-essential analytics by using browser privacy settings or extensions that block measurement scripts on bo7-cheats.com.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            `Privacy questions can be sent to ${SUPPORT_EMAIL}. Include enough detail for us to locate your message without sharing unnecessary identifiers.`,
          ],
        },
        {
          heading: 'Children’s privacy',
          paragraphs: [
            'This site is intended for adults evaluating PC software purchases. We do not knowingly collect personal information from children under 13.',
            'If you believe a minor submitted data through our support form, contact us promptly and we will delete the correspondence where legally permitted.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      description: `Rules for using ${SITE_DOMAIN} content and third-party checkout links for Black Ops 7 PC products.`,
      sections: [
        {
          heading: 'Use of this site',
          paragraphs: [
            `${PLACEHOLDER_COPY.siteName} publishes informational copy, screenshots, and compatibility notes. We do not host game clients, operate anti-cheat systems, or guarantee any in-game outcome.`,
            'You may link to our public pages with accurate anchor text. Scraping or mirroring entire articles without permission is not allowed.',
          ],
        },
        {
          heading: 'Third-party products',
          paragraphs: [
            'Purchases are completed through external operators linked from this domain. Their terms, refund policies, delivery windows, and support channels govern the software you buy.',
            'Listing prices and feature names are provided for convenience. The operator checkout page is authoritative if numbers differ.',
          ],
        },
        {
          heading: 'Prohibited uses',
          paragraphs: [
            'Do not use this site to harass other players, publish stolen account data, or attempt to probe our infrastructure.',
            'Do not misrepresent affiliation with the game publisher or anti-cheat vendors when discussing products referenced here.',
            'Automated scraping that degrades site performance may result in access restrictions at the network edge.',
          ],
        },
        {
          heading: 'Dispute resolution',
          paragraphs: [
            'Content disputes should first be emailed to support with the URL in question. We will correct factual errors about pricing or requirements when verified with the operator.',
            'Legal disputes unrelated to factual corrections should identify your jurisdiction so we can respond appropriately.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'Game names and logos belong to their respective owners. Our editorial text, layout, and original screenshots are protected as site content.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'You are responsible for how you use any third-party software and for complying with the game publisher’s rules and local law.',
            'We provide information “as is” without warranties. Service interruptions, outdated requirements, or operator downtime may occur.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may update these terms when checkout flows or analytics practices change. Continued use after an update constitutes acceptance of the revised rules.',
          ],
        },
        {
          heading: 'Governing context',
          paragraphs: [
            'These terms apply to your use of bo7-cheats.com only. They do not modify operator contracts, game end-user license agreements, or anti-cheat policies.',
            'If any clause is unenforceable in your jurisdiction, the remaining sections still apply to the extent permitted by law.',
          ],
        },
        {
          heading: 'Feedback',
          paragraphs: [
            'Suggestions about clarity or missing compatibility notes are welcome through support mail. We may incorporate feedback into guides without owing compensation.',
            'We do not guarantee implementation timelines for editorial requests.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            `Questions about these terms can be emailed to ${SUPPORT_EMAIL} with the subject line “Terms inquiry” and the page URL you were reading.`,
          ],
        },
      ],
    },
    support: {
      title: `${PLACEHOLDER_COPY.siteName} support`,
      description: `Support placeholder for ${SITE_DOMAIN}.`,
    },
  },
  ui: {
    skipLink: 'Skip to main content',
    browseCheats: 'View plans',
    browseCheatsMobile: 'View plans',
    homeAria: `${PLACEHOLDER_COPY.siteName} home`,
    checkoutAria: 'Start checkout',
    discordAria: 'Community placeholder',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },
};