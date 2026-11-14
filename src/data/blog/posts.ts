import type { BlogPostFull } from './types';
import { PLACEHOLDER_COPY, PLACEHOLDER_IMAGE } from '../placeholders';

export const blogPosts: BlogPostFull[] = [
  {
    tag: 'Guides',
    title: 'Placeholder blog article',
    slug: 'placeholder-post',
    image: '/images/showcase/bo7-esp-red-dot.webp',
    desc: PLACEHOLDER_COPY.subtitle,
    date: 'Jan 1, 2026',
    readTime: '3 min read',
    featured: true,
    body: [
      { type: 'p', text: PLACEHOLDER_COPY.subtitle },
      { type: 'h2', text: 'Section placeholder' },
      { type: 'p', text: PLACEHOLDER_COPY.feature },
    ],
  },
];