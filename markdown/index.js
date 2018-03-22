import MarkdownIt from 'markdown-it';
import markdownitMermaid from 'markdown-it-mermaid';
import markdownitAbbr from 'markdown-it-abbr';
import markdownitDeflist from 'markdown-it-deflist';
import markdownitFootnote from 'markdown-it-footnote';
import markdownitSub from 'markdown-it-sub';
import markdownitSup from 'markdown-it-sup';
import markdownitKatex from 'markdown-it-katex';
import hljs from 'highlight.js/lib/index';


export default () => {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
        } catch (e) {
          console.error(e);
        }
      }
      return `<pre class="hljs"><code>${str}</code></pre>`
    }
  });
  markdown.use(markdownitMermaid);
  markdown.use(markdownitAbbr);
  markdown.use(markdownitDeflist);
  markdown.use(markdownitFootnote);
  markdown.use(markdownitSub);
  markdown.use(markdownitSup);
  markdown.use(markdownitKatex);
  return markdown;
};

