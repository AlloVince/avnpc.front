# 静态博客 web/

更新：2026-09-27。本文记录 AC-003 的静态构建实现；Cloudflare 线上项目和生产域名尚未验收。

## 当前实现

- `web/` 使用 Next.js 16 App Router 的静态导出；`next build` 输出 `web/out/`，部署后不需要 Next.js/Node 服务。
- 构建输入为 `avnpc.content/source/_posts/**/*.md` 和 `_data/legacy-gitalk.json`。本机默认读取 sibling 仓 `/Users/allovince/Developer/avnpc.content/source`；CI 设置 `CONTENT_ROOT` 指向 checkout 内容仓。没有在前端复制 Markdown。
- `web/scripts/validate-content.js` 解析全部 YAML front matter，缺失/无效 front matter、重复或非法 slug、缺标题/日期会使构建失败。slug 优先 `slug`、兼容 `s`，再回退文件名；`published` 和 `listed` 缺省为 true。
- `/pages/:slug/` 静态生成所有 published 页面。`published:false` 不生成页面；`listed:false` 仍可直达并输出 `noindex`，但不进入首页/Thinking、浏览器搜索索引、标签/分类筛选、RSS、sitemap 或相邻文章导航。
- `search-index.json` 只包含 listed 文章正文，按需在浏览器加载供本地全文搜索；分类/标签来自文章 front matter 并使用 Thinking 筛选。
- `/rss`、`/robots.txt` 和 `/sitemap.xml` 均在构建期生成；Cloudflare Pages `_headers` 为 `/rss` 指定 Atom MIME 类型。构建没有读取 `avnpc.js`、数据库或 Redis。
- `/p/:id` 路由已移除，不建立数字 ID 跳转。Reading 保留现有不可用提示；其动态详情页不随静态站导出。
- Gitalk UI 尚未接入。61 篇已标记开放评论的文章及历史 Issue 标识在构建模型中保留，等待安全 OAuth 方案获批并完成 Issue 匹配核验。

## 构建与本机检查

在前端仓执行：

| 命令 | 行为 |
|---|---|
| `pnpm --dir web install --frozen-lockfile` | 安装锁定依赖 |
| `CONTENT_ROOT=/Users/allovince/Developer/avnpc.content/source FRONTEND_URL=https://avnpc.com pnpm --dir web build` | 校验内容并生成 `web/out/` |
| `pnpm --dir web lint` | ESLint |

GitHub workflow 将前端与 `avnpc.content` checkout 到同一工作目录，设置 `CONTENT_ROOT`，执行同一静态构建后用 Wrangler 上传 Pages。

## 验证证据与限制

- 2026-09-27：`pnpm --dir web lint` 通过；静态生产构建通过，生成 206 个 Next 静态页面任务，其中 196 个文章路由来自 199 篇内容（196 published、110 listed、86 unlisted、3 unpublished）。
- 静态产物检查：196 个文章目录，110 条搜索索引记录；86 篇隐藏文章均有 `noindex`，隐藏 slug 不在 sitemap/feed；RSS 有 10 条；无 `/p/:id` 应用路由；构建产物不包含 `api.avnpc.com` 或旧 REST endpoint。
- 未执行 automated tests、浏览器/HTTP 验收、GitHub Actions、Cloudflare preview 或生产部署。跨仓触发 secret、Cloudflare 项目类型/name/account/domain 仍需配置和核实。
- 上述静态检查不证明 Cloudflare MIME、缓存/回退、项目绑定和 `avnpc.com` 线上可用；部署说明见 [发布](../operations/deploy.md)。

## 仍有功能边界

- Reading 上游此前返回 404；静态博客继续显示不可用提示。Search 已改为 listed 文章的浏览器全文搜索，不再请求旧 Search API。
- 文章 Markdown 经现有 renderer 与 HTML sanitizer 输出。旧 Mermaid、交互目录、第三方嵌入和评论尚未完成逐篇兼容验收。
- ESLint 暂固定 9.39.5；`web/pnpm-workspace.yaml` 显式禁止 `unrs-resolver` 构建脚本，不默认放开依赖安装脚本。

相关：[架构](../architecture/overview.md)、[命令](commands.md)、[测试](testing.md)、[发布](../operations/deploy.md)。
