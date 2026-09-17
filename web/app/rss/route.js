import { requestApi } from '../../lib/api';
import { createFeed } from '../../lib/feed';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const data = await requestApi('/v1/blog/posts', { withText: 1, limit: 10 });
    return new Response(createFeed(data.results, process.env.FRONTEND_URL || 'http://127.0.0.1:18348'), { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
  } catch { return new Response('Feed temporarily unavailable', { status: 503 }); }
}
