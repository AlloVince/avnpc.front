import MarkdownIt from 'markdown-it';
import markdownitAbbr from 'markdown-it-abbr';
import markdownitDeflist from 'markdown-it-deflist';
import markdownitFootnote from 'markdown-it-footnote';
import markdownitSub from 'markdown-it-sub';
import markdownitSup from 'markdown-it-sup';
import markdownitKatex from 'markdown-it-katex';
import hljs from 'highlight.js/lib/index';

const mermaidChart = (code) => {
  try {
    return `<div class="mermaid">${code}</div>`;
  } catch ({ str, hash }) {
    return `<pre>${str}</pre>`;
  }
};

const markdownitMermaid = (md) => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules);
  Object.assign(md.renderer.rules, {
    fence: (tokens, idx, options, env, slf) => {
      const token = tokens[idx];
      const code = token.content.trim();
      if (token.info === 'mermaid') {
        return mermaidChart(code);
      }
      const firstLine = code.split(/\n/)[0].trim();
      if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
        return mermaidChart(code);
      }
      return temp(tokens, idx, options, env, slf);
    }
  });
};

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
  markdown.use(markdownitAbbr);
  markdown.use(markdownitDeflist);
  markdown.use(markdownitFootnote);
  markdown.use(markdownitSub);
  markdown.use(markdownitSup);
  markdown.use(markdownitKatex);
  markdown.use(markdownitMermaid);
  return markdown;
};

