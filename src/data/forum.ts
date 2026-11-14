export interface ForumComment {
  author: string;
  age: string;
  score: number;
  body: string;
  replies?: ForumComment[];
}

export interface ForumPost {
  slug: string;
  category: string;
  categoryTone: 'purple' | 'blue' | 'green' | 'orange';
  title: string;
  excerpt: string;
  author: string;
  age: string;
  commentsCount: number;
  upvotes: number;
  flair?: string;
  body: string[];
  comments: ForumComment[];
  sourceTitle?: string;
  sourcePath?: string;
}

export const forumCategories = [
  { name: 'General', tone: 'purple', icon: 'users' },
  { name: 'Guides', tone: 'blue', icon: 'navBlog' },
  { name: 'Updates', tone: 'orange', icon: 'refresh' },
  { name: 'Community', tone: 'green', icon: 'messageCircle' },
] as const;

export const forumPosts: ForumPost[] = [
  {
    slug: 'placeholder-discussion',
    category: 'General',
    categoryTone: 'purple',
    title: 'Forum thread placeholder',
    excerpt: 'Replace with community discussion copy or disable the forum section before launch.',
    author: 'moderator',
    age: '1 day ago',
    commentsCount: 1,
    upvotes: 1,
    flair: 'Placeholder',
    body: ['This thread is a layout placeholder. No game-specific content is loaded.'],
    comments: [
      { author: 'member', age: '12 hours ago', score: 1, body: 'Reply placeholder — add real moderation guidelines.' },
    ],
  },
];

export function getForumPost(slug: string): ForumPost | undefined {
  return forumPosts.find((post) => post.slug === slug);
}