import { getPost } from '../../lib/api';
import Post from '../../components/Post';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'About AlloVince' };
export default async function About() { return <Post post={await getPost('about')}/>; }
