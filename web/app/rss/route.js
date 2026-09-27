import { createFeed } from '../../lib/feed';
import { getListedPosts } from '../../lib/content';
export const dynamic = 'force-static';
export async function GET() {
  const posts = getListedPosts().slice(0, 10);
  return new Response(createFeed(posts, process.env.FRONTEND_URL || 'https://avnpc.com'), { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
