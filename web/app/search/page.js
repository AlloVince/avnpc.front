import { Suspense } from 'react';
import { getPostSummaries } from '../../lib/content';
import PostList from '../../components/PostList';
import StaticPostList from '../../components/StaticPostList';

export const metadata = { title: '搜索', robots: { index: false, follow: true } };

export default function Search() {
  const posts = getPostSummaries();
  return <Suspense fallback={<StaticPostList posts={posts} pathname="/search" heading="搜索"/>}>
    <PostList posts={posts} pathname="/search" heading="搜索"/>
  </Suspense>;
}
