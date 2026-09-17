import { requestApi } from '../lib/api';
import { listQuery } from '../lib/queries';
import PostList from '../components/PostList';

export const dynamic = 'force-dynamic';
export default async function Home({ searchParams }) {
  const query = listQuery(await searchParams);
  const data = await requestApi('/v1/blog/posts', query);
  return <>
    <section className="hero"><div><span className="eyebrow">THE PERSONAL JOURNAL OF ALLOVINCE</span><h1>思考，记录。<br/>然后继续向前。</h1><p>关于技术、阅读与生活的一些笔记。<br/>不追捧，不贬低，保持好奇心。</p></div><aside className="hero-aside"><strong>{data.pagination.total}</strong><p>{query.tag ? '篇相关文章' : '篇真实的思考与记录'}<br/>Thinking · Reading · Living</p></aside></section>
    <PostList data={data} query={query}/>
  </>;
}
