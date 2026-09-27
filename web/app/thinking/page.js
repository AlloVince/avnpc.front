import { Suspense } from 'react';
import { getPostSummaries } from '../../lib/content';
import PostList from '../../components/PostList';
import StaticPostList from '../../components/StaticPostList';

export const metadata = { title: 'Thinking' };

export default function Thinking() {
  const posts = getPostSummaries();
  return <Suspense fallback={<StaticPostList posts={posts} pathname="/thinking"/>}><PostList posts={posts} pathname="/thinking"/></Suspense>;
}
