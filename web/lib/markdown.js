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

const md = new MarkdownIt({
  html: true, linkify: true, typographer: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) return hljs.highlight(code, { language }).value;
    return '';
  },
}).use(footnote).use(abbr).use(deflist).use(sub).use(sup)
  .use(katex, { throwOnError: false, trust: false }).use(anchor);

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
