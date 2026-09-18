import { requestApi } from '../lib/api';
import { listQuery } from '../lib/queries';
import PostList from '../components/PostList';

export const dynamic = 'force-dynamic';
export default async function Home({ searchParams }) {
  const query = listQuery(await searchParams);
  const data = await requestApi('/v1/blog/posts', query);
  return <PostList data={data} query={query}/>;
}
