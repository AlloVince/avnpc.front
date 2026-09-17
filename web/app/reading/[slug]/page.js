import { notFound } from 'next/navigation';
import { requestApi } from '../../../lib/api';
import Post from '../../../components/Post';
export const dynamic = 'force-dynamic';
export default async function Note({ params }) {
  const { slug } = await params;
  let post;
  try { post = await requestApi(`/v1/evernote/notes/${encodeURIComponent(slug)}`); }
  catch (error) { if (error.status === 404) notFound(); throw error; }
  return <Post post={post}/>;
}
