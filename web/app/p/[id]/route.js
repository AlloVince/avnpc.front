import { getPost } from '../../../lib/api';
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const post = await getPost(id);
    if (!post?.slug) return new Response('Not found', { status: 404 });
    return new Response(null, { status: 302, headers: { Location: `/pages/${encodeURIComponent(post.slug)}` } });
  } catch (error) { return new Response('Content unavailable', { status: error.status === 404 ? 404 : 503 }); }
}
