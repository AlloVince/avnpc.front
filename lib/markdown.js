import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import footnote from 'markdown-it-footnote';
import abbr from 'markdown-it-abbr';
import deflist from 'markdown-it-deflist';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import katex from '@traptitech/markdown-it-katex';
import anchor from 'markdown-it-anchor';
import sanitizeHtml from 'sanitize-html';

function tableOfContents(md) {
  md.core.ruler.push('table_of_contents', state => {
    const headings = [];
    for (let i = 0; i < state.tokens.length; i += 1) {
      const token = state.tokens[i];
      if (token.type !== 'heading_open') continue;
      const inline = state.tokens[i + 1];
      const id = token.attrGet('id');
      if (id && inline?.type === 'inline') {
        const title = md.renderer.renderInlineAsText(inline.children, md.options, {});
        headings.push({ level: Number(token.tag.slice(1)), id, title });
      }
    }

    const marker = state.tokens.findIndex(token => token.type === 'inline' && token.content.trim() === '@[toc]');
    if (marker < 0 || headings.length === 0) return;

    const tree = [];
    const parents = [];
    headings.forEach(heading => {
      const node = { ...heading, children: [] };
      while (parents.length && parents[parents.length - 1].level >= node.level) parents.pop();
      const siblings = parents.length ? parents[parents.length - 1].children : tree;
      siblings.push(node);
      parents.push(node);
    });
    const renderItems = nodes => `<ul>${nodes.map(node => `<li><a href="#${md.utils.escapeHtml(node.id)}">${md.utils.escapeHtml(node.title)}</a>${node.children.length ? renderItems(node.children) : ''}</li>`).join('')}</ul>`;
    const html = renderItems(tree).replace('<ul>', '<ul class="toc">');

    const inline = state.tokens[marker];
    if (state.tokens[marker - 1]?.type === 'paragraph_open') state.tokens[marker - 1].hidden = true;
    if (state.tokens[marker + 1]?.type === 'paragraph_close') state.tokens[marker + 1].hidden = true;
    inline.type = 'html_block';
    inline.content = `${html}\n`;
    inline.children = null;
  });
}

const md = new MarkdownIt({
  html: true, linkify: true, typographer: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) return hljs.highlight(code, { language }).value;
    return '';
  },
}).use(footnote).use(abbr).use(deflist).use(sub).use(sup)
  .use(katex, { throwOnError: false, trust: false }).use(anchor).use(tableOfContents);

const renderFence = md.renderer.rules.fence.bind(md.renderer.rules);
md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
  const token = tokens[index];
  const code = token.content.trim();
  const firstLine = code.split('\n', 1)[0].trim();
  const isDiagram = token.info.trim().split(/\s+/, 1)[0] === 'mermaid'
    || /^(?:flowchart|graph)\s+(?:TB|BT|RL|LR|TD)\b/.test(firstLine)
    || /^(?:gantt|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram)\b/.test(firstLine);
  if (isDiagram) return `<pre class="mermaid">${md.utils.escapeHtml(code)}</pre>\n`;
  return renderFence(tokens, index, options, env, renderer);
};

export function renderMarkdown(source) {
  return sanitizeHtml(md.render(source), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'details', 'summary', 'span', 'math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'mspace', 'mtext', 'mtable', 'mtr', 'mtd', 'mover', 'munder', 'msubsup', 'msqrt', 'mroot', 'mpadded', 'mstyle', 'menclose'],
    allowedAttributes: { '*': ['class', 'id', 'aria-hidden'], a: ['href', 'name', 'target', 'rel'], img: ['src', 'alt', 'title', 'width', 'height', 'loading'], span: ['class', 'style', 'aria-hidden'], math: ['xmlns', 'display'], annotation: ['encoding'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan'] },
    allowedStyles: { span: { height: [/^[\d.]+em$/], width: [/^[\d.]+em$/], top: [/^-?[\d.]+em$/], 'vertical-align': [/^-?[\d.]+em$/], 'margin-right': [/^-?[\d.]+em$/], 'margin-left': [/^-?[\d.]+em$/], 'font-size': [/^[\d.]+em$/] } },
    transformTags: {
      a: (tagName, attrs) => {
        if (/^https?:\/\/avnpc\.com\//.test(attrs.href || '')) attrs.href = attrs.href.replace(/^https?:\/\/avnpc\.com/, '');
        return { tagName, attribs: { ...attrs, rel: 'noopener noreferrer' } };
      },
      img: (tagName, attrs) => ({ tagName, attribs: { ...attrs, loading: 'lazy', alt: attrs.alt || '' } }),
    },
  });
}
