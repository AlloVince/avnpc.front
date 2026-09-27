import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '../../../lib/content';
import Post from '../../../components/Post';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().filter(post => post.published).map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? {
    title: post.title,
    description: post.body.replace(/[#*_`>\[\]()!~-]/g, ' ').replace(/\s+/g, ' ').slice(0, 180),
    ...(post.listed ? {} : { robots: { index: false, follow: true } }),
  } : { title: '文章' };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const allPosts = getAllPosts().filter(post => post.published && post.listed);
  const index = allPosts.findIndex(post => post.slug === slug);
  const post = getPost(slug);
  if (!post) notFound();
  return <Post post={{
    ...post,
    prev: index > 0 ? { slug: allPosts[index - 1].slug, title: allPosts[index - 1].title } : null,
    next: index >= 0 && index < allPosts.length - 1 ? { slug: allPosts[index + 1].slug, title: allPosts[index + 1].title } : null,
  }}/>;
}
