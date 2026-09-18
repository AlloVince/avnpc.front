import { requestApi } from '../../lib/api';
import { listQuery } from '../../lib/queries';
import PostList from '../../components/PostList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reading' };
export default async function Reading({ searchParams }) {
  const query = listQuery(await searchParams);
  let data;
  try { data = await requestApi('/v1/evernote/notes', query); }
  catch { return <section><h1>Reading</h1><p className="notice" role="status">阅读服务暂时不可用，请稍后重试。</p></section>; }
  return <PostList data={data} query={query} kind="reading" pathname="/reading"/>;
}
