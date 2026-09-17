# markdown：正文转换
## 何时读
修改 Markdown 扩展、高亮、公式或 Mermaid 识别时。
## 职责与接口
`markdown/index.js` 默认导出工厂，返回 MarkdownIt 实例；调用方式为工厂后 `.render(text)`。调用方为 BlogPost；模块不取数、不操作 DOM、不初始化浏览器 Mermaid。
## 行为与依赖
- MarkdownIt 开启 html/linkify/typographer。
- 扩展：abbr、deflist、footnote、sub、sup、KaTeX、toc-and-anchor（tocClassName 为 `toc`）。
- 已知语言调用 highlight.js；未知语言或高亮失败回退到 pre/code 模板。
- fence info 为 mermaid，或内容首行匹配 gantt、sequenceDiagram、graph 方向声明时输出 `.mermaid` 容器；其余委托原 fence renderer。
- 公式/代码样式由 DLL 样式构建提供，图表浏览器初始化与目录定位归 BlogPost。
## 雷区
允许原始 HTML；回退代码块及 Mermaid 容器直接拼接内容，未提供独立清理层。不要把渲染器视为安全净化器；上游内容信任/清理契约待确认。
## 相关
- 代码：`markdown/index.js`、`components/BlogPost.js`、`webpack.dll.js`。
- 文档：[UI](../components/README.md)、[测试](../../development/testing.md)。
验证于：2026-09-17，静态首扫。
