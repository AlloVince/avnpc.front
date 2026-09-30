import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../lib/markdown';
import { createFeed } from '../lib/feed';

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
    const feed = createFeed([{ id: 1, slug: 'test', title: 'A & B', createdAt: 1, body: '<example> ]]>' }], 'http://localhost:18348');
    expect(feed).toContain('A &amp; B'); expect(feed).toContain('&lt;example&gt;'); expect(feed).toContain('http://localhost:18348/pages/test');
  });
});
