import { requestApi } from '../../lib/api';
import { listQuery } from '../../lib/queries';
import PostList from '../../components/PostList';
export const dynamic = 'force-dynamic';
export const metadata = { title: '搜索' };
export default async function Search({ searchParams }) {
  const query = listQuery(await searchParams);
  let data;
  let unavailable = false;
  if (query.q) {
    try { data = await requestApi('/v1/search', query); }
    catch { unavailable = true; }
  }
  return <section><h1>{query.q ? `搜索：${query.q}` : '搜索'}</h1>
    {!query.q && <p>请在导航栏输入搜索关键词。</p>}
    {unavailable && <p role="status" className="notice">搜索服务暂时不可用，请稍后重试。</p>}
    {data && <PostList data={data} query={query} kind="search" pathname="/search"/>}
  </section>;
}
