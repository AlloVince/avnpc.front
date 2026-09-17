import { notFound } from 'next/navigation';
import { getPost } from '../../../lib/api';
import Post from '../../../components/Post';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try { const post = await getPost(slug); return { title: post.title }; }
  catch { return { title: '文章' }; }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  let post;
  try { post = await getPost(slug); }
  catch (error) { if (error.status === 404) notFound(); throw error; }
  if (!post?.id) notFound();
  return <Post post={post}/>;
}
