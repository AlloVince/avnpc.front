import { getListedPosts } from '../lib/content';

export const dynamic = 'force-static';
const siteUrl = 'https://avnpc.com';

export default function sitemap() {
  const pages = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/thinking/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/about/`, changeFrequency: 'monthly', priority: 0.4 },
  ];
  const articles = getListedPosts().map(post => ({
    url: `${siteUrl}/pages/${encodeURIComponent(post.slug)}/`,
    lastModified: new Date((post.updatedAt || post.createdAt) * 1000),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));
  return [...pages, ...articles];
}
