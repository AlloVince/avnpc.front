import { requestApi } from '../../lib/api';
import { listQuery } from '../../lib/queries';
import PostList from '../../components/PostList';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reading' };
export default async function Reading({ searchParams }) {
  const query = listQuery(await searchParams);
  let data;
  try { data = await requestApi('/v1/evernote/notes', query); }
  catch { return <section><p className="eyebrow">READING / 阅读收藏</p><h1>读过，留下印记。</h1><p className="notice" role="status">阅读服务暂时不可用。已有文章仍可正常浏览；这里不是空收藏，后端阅读接口尚未接通。</p></section>; }
  return <><section><p className="eyebrow">READING / 阅读收藏</p><h1>读过，留下印记。</h1></section><PostList data={data} query={query} kind="reading" pathname="/reading"/></>;
}
