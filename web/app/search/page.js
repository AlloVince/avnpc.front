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
  return <section><p className="eyebrow">SEARCH / 查找记录</p><h1>{query.q ? `搜索：${query.q}` : '找一篇旧文章。'}</h1>
    {!query.q && <p>在页头输入关键词，查找感兴趣的内容。</p>}
    {unavailable && <p role="status" className="notice">搜索服务暂时不可用，外部搜索服务尚未接通。可先通过 Thinking 浏览文章和标签。</p>}
    {data && <PostList data={data} query={query} kind="search" pathname="/search"/>}
  </section>;
}
