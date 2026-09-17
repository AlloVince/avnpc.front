import { describe, it, expect, vi } from 'vitest';
import { requestApi } from '../lib/api';
import { listQuery } from '../lib/queries';
import { renderMarkdown } from '../lib/markdown';
import { createFeed } from '../lib/feed';

describe('server API client', () => {
  it('preserves query values and omits missing parameters', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [] })));
    expect(await requestApi('/v1/blog/posts', { tag: 'C++', offset: 0, q: undefined }, fetcher)).toEqual({ results: [] });
    const url = fetcher.mock.calls[0][0];
    expect(url.searchParams.get('tag')).toBe('C++');
    expect(url.searchParams.get('offset')).toBe('0');
    expect(url.searchParams.has('q')).toBe(false);
  });
  it.each([404, 500])('hides upstream error details (%s)', async status => {
    await expect(requestApi('/v1/blog/posts', {}, async () => new Response('private upstream details', { status }))).rejects.toMatchObject({ status, message: '内容服务暂时不可用，请稍后重试。' });
  });
  it('rejects non-JSON success', async () => { await expect(requestApi('/', {}, async () => new Response('<html>'))).rejects.toMatchObject({ status: 502 }); });
  it('handles network failure', async () => { await expect(requestApi('/', {}, async () => { throw Error('private'); })).rejects.toMatchObject({ status: 503 }); });
  it.each([400, '403', 500])('rejects an HTTP 200 error envelope (%s) without exposing details', async statusCode => {
    const fetcher = async () => new Response(JSON.stringify({ statusCode, message: 'private upstream details', stack: 'private stack' }));
    await expect(requestApi('/v1/search', {}, fetcher)).rejects.toMatchObject({
      name: 'ApiError', status: Number(statusCode), message: '内容服务暂时不可用，请稍后重试。',
    });
  });
});

describe('query validation', () => {
  it('bounds pagination and preserves filters', () => { expect(listQuery({ offset: '-2', limit: '500', tag: 'React', q: ' hello ' })).toEqual({ offset: 0, limit: 50, tag: 'React', q: 'hello' }); });
  it('rejects arrays and nonnumeric values', () => { expect(listQuery({ offset: 'NaN', limit: '0', tag: ['one', 'two'] })).toEqual({ offset: 0, limit: 1 }); });
});

describe('Markdown rendering', () => {
  it('renders headings, highlights, formulas and footnotes', () => {
    const html = renderMarkdown('# Hello\n\n```js\nconst x = 1;\n```\n\n$x^2$\n\nA[^1]\n\n[^1]: footnote');
    expect(html).toContain('id="hello"'); expect(html).toContain('hljs-keyword'); expect(html).toContain('katex'); expect(html).toContain('footnote');
  });
  it('escapes unknown code fences and strips active HTML', () => {
    const html = renderMarkdown('```unknown\n<strong>text</strong>\n```\n\n<script>bad()</script><p onclick="bad()">safe</p>');
    expect(html).toContain('&lt;strong&gt;'); expect(html).not.toContain('<script'); expect(html).not.toContain('onclick'); expect(html).toContain('safe');
  });
  it('keeps internal links on local frontend', () => { expect(renderMarkdown('[link](https://avnpc.com/pages/example)')).toContain('href="/pages/example"'); });
});

describe('Atom', () => {
  it('supports an empty feed', () => { expect(createFeed([], 'http://localhost:18348')).toContain('<feed xmlns='); });
  it('escapes text and uses configured origin', () => {
    const feed = createFeed([{ id: 1, slug: 'test', title: 'A & B', createdAt: 1, text: { content: '<example> ]]>' } }], 'http://localhost:18348');
    expect(feed).toContain('A &amp; B'); expect(feed).toContain('&lt;example&gt;'); expect(feed).toContain('http://localhost:18348/pages/test');
  });
});
