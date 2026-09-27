import { getPost } from '../../lib/content';
import Post from '../../components/Post';
export const metadata = { title: 'About AlloVince' };
export default function About() {
  const post = getPost('about');
  return post ? <Post post={post}/> : <section><h1>About AlloVince</h1><p>关于页面暂未提供。</p></section>;
}
