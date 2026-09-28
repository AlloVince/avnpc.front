# 静态博客 web/

更新：2026-09-28。本文记录 AC-003 的静态构建实现；Cloudflare Pages 与 `avnpc.com` 已由总仓完成线上验收。

## 当前实现

- `web/` 使用 Next.js 16 App Router 的静态导出；`next build` 输出 `web/out/`，部署后不需要 Next.js/Node 服务。
- 构建输入为 `avnpc.content/source/_posts/**/*.md` 和 `_data/legacy-gitalk.json`。本机默认读取 sibling 仓 `/Users/allovince/Developer/avnpc.content/source`；CI 设置 `CONTENT_ROOT` 指向 checkout 内容仓。没有在前端复制 Markdown。
- `web/scripts/validate-content.js` 解析全部 YAML front matter，缺失/无效 front matter、重复或非法 slug、缺标题/日期会使构建失败。slug 优先 `slug`、兼容 `s`，再回退文件名；`published` 和 `listed` 缺省为 true。
- `/pages/:slug/` 静态生成所有 published 页面。`published:false` 不生成页面；`listed:false` 仍可直达并输出 `noindex`，但不进入首页/Thinking、浏览器搜索索引、标签/分类筛选、RSS、sitemap 或相邻文章导航。
- `search-index.json` 只包含 listed 文章正文，按需在浏览器加载供本地全文搜索；分类/标签来自文章 front matter 并使用 Thinking 筛选。
- `/rss`、`/robots.txt` 和 `/sitemap.xml` 均在构建期生成；Cloudflare Pages `_headers` 为 `/rss` 指定 Atom MIME 类型。构建没有读取 `avnpc.js`、数据库或 Redis。
- `/p/:id` 路由已移除，不建立数字 ID 跳转。Reading 保留现有不可用提示；其动态详情页不随静态站导出。
- `@[toc]` 会生成文章内层级目录；标题带稳定锚点。Mermaid fence 以及旧式 `graph`、`flowchart`、`sequenceDiagram`、`gantt`、`classDiagram`、`stateDiagram`、`erDiagram` fence 在浏览器渲染为图表。
- Gitalk UI 默认显示在所有 published 文章中；只有 front matter 明确设 `comments: false` 或 `comment_status: closed` 才隐藏。已存在的旧 Issue 由内容仓 sidecar 映射到文章 slug，使用原有 `POST_<id>` 标签；新文章使用稳定 slug 身份。OAuth Client Secret 由独立 Worker 代理，不进入静态资源。操作步骤见 [评论与 OAuth 配置](../operations/config.md#gitalk-评论配置)。

## 构建与本机检查

在前端仓执行：

| 命令 | 行为 |
|---|---|
| `pnpm --dir web install --frozen-lockfile` | 安装锁定依赖 |
| `CONTENT_ROOT=/Users/allovince/Developer/avnpc.content/source FRONTEND_URL=https://avnpc.com pnpm --dir web build` | 校验内容并生成 `web/out/` |
| `pnpm --dir web lint` | ESLint |

GitHub workflow 将前端与 `avnpc.content` checkout 到同一工作目录，设置 `CONTENT_ROOT`，执行同一静态构建后用 Wrangler 上传 Pages。

## 验证证据与限制

- 2026-09-28：`pnpm --dir web lint` 与静态生产构建通过；生成 206 个 Next 静态页面任务，其中 196 个文章路由来自 199 篇内容（196 published、114 listed、82 unlisted、3 unpublished）。
- 本轮构建产物检查：`@[toc]` 页面生成目录锚点；示例文章生成 3 个 Mermaid 图表容器；侧栏导航没有图标。构建中 75 篇已发布内容标记开放评论。
- 2026-09-28 评论接入：Gitalk 1.8.0 经锁文件补丁移除公开 Issue 读取时的 Client Secret Basic Auth；查询覆盖开放与已关闭 Issue，并按创建时间倒序选取标签匹配项。Worker 密钥已部署，GitHub Actions Variables 已设置。全量比对内容仓公开 Issue，为 3 篇文章补齐旧映射，并为没有历史 Issue 的 9 篇文章初始化讨论区。未明确关闭评论的发布文章均可显示评论框。
- 重复 Issue 仍按最近创建项加载，不合并不同 Issue 的评论；`POST_138` 的 #69 有 1 条历史评论未包含在当前显示的 #90（3 条评论）中。
- 已运行 `pnpm --dir web lint` 和静态构建；未执行 automated tests 或完整浏览器 OAuth 登录验收。Worker 预检返回 204，使用无效授权码的交换请求返回 GitHub `bad_verification_code`，未产生 access token。部署与既有线上验收证据见总仓 AC-003。
- 静态构建不证明 Mermaid 浏览器渲染交互或线上部署后的行为；部署说明见 [发布](../operations/deploy.md)。

## 仍有功能边界

- Reading 上游此前返回 404；静态博客继续显示不可用提示。Search 已改为 listed 文章的浏览器全文搜索，不再请求旧 Search API。
- 文章 Markdown 经 renderer 与 HTML sanitizer 输出。目录标记与 Mermaid 图表已按旧语法恢复；第三方嵌入和评论浏览器交互尚未完成逐篇兼容验收。
- ESLint 暂固定 9.39.5；`web/pnpm-workspace.yaml` 显式禁止 `unrs-resolver` 构建脚本，不默认放开依赖安装脚本。

相关：[架构](../architecture/overview.md)、[命令](commands.md)、[测试](testing.md)、[发布](../operations/deploy.md)。
