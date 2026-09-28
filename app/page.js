import { Suspense } from 'react';
import { getPostSummaries } from '../lib/content';
import PostList from '../components/PostList';
import StaticPostList from '../components/StaticPostList';

export default function Home() {
  const posts = getPostSummaries();
  return <Suspense fallback={<StaticPostList posts={posts} pathname="/"/>}><PostList posts={posts} pathname="/"/></Suspense>;
}
