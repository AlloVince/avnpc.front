export const dynamic = 'force-static';
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/search'] },
    sitemap: 'https://avnpc.com/sitemap.xml',
  };
}
