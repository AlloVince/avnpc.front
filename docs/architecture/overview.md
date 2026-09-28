# 架构概览

仓库根目录是 avnpc.com 当前使用的 Next.js 16 / React 19 静态博客。GitHub Actions 从 `avnpc.content` 检出 Markdown 文章，执行内容校验和静态构建，再将 `out/` 发布到 Cloudflare Pages。

## 数据流

1. 构建期从 `avnpc.content/source/_posts/` 读取文章与 front matter，并读取 `_data/legacy-gitalk.json` 中的历史评论映射。
2. `scripts/validate-content.js` 校验 front matter、日期和 slug；Next.js 生成首页、列表、文章、RSS、robots、sitemap 与搜索索引。
3. 浏览器加载静态 HTML、样式和脚本。全文搜索在浏览器本地执行；文章评论通过 Gitalk 连接 GitHub，并经 OAuth Worker 获取授权。
4. Pages 静态托管不连接后端 API、MySQL 或 Redis。内容维护属于 `avnpc.content`，评论 OAuth 与 Pages 部署属于各自 Cloudflare/GitHub 配置。

## 主要代码

- `app/`：App Router 页面和静态资源端点。
- `components/`：文章、列表、导航、Markdown 和 Gitalk 展示。
- `lib/`：内容查询、日期、feed、Markdown 与查询参数处理。
- `scripts/validate-content.js`：构建输入检查。
- `worker/gitalk-oauth/`：评论授权代理。
- `.github/workflows/deploy-blog.yml`：静态构建和 Pages 发布。

部署行为与已验收状态见 [发布](../operations/deploy.md)；文章字段、隐藏规则及构建细节见 [现代前端](../development/modern-web.md)。
