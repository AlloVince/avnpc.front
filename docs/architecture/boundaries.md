# 系统与模块边界

| 区域 | 负责 | 不负责 |
|---|---|---|
| `app/` | 页面路由、静态页面生成、robots/sitemap/RSS | 文章 CRUD、数据库或服务端 API |
| `components/` | 导航、文章展示、Markdown、评论 UI | 内容持久化、评论存储 |
| `lib/` | 构建期内容读取、查询、feed 与 Markdown 输出 | 内容源维护、后端搜索索引 |
| `scripts/` | 校验构建输入 | 修改或修复源文章 |
| `worker/gitalk-oauth/` | 代理 GitHub OAuth token 交换 | 文章内容和 GitHub Issue 生命周期管理 |
| `.github/workflows/` | 构建、Pages 上传、域名状态检查 | 内容仓编辑与 Cloudflare 凭据管理 |

## 外部边界

- 内容来自 `avnpc.content/source/`；构建 workflow 将内容仓检出为 sibling 目录。字段语义以内容仓和 [现代前端](../development/modern-web.md) 说明为准。
- 静态页面不请求 `avnpc.js`、MySQL 或 Redis。修改内容读取方式或公开 URL 规则会影响跨仓 contract，应先走系统架构确认流程。
- Gitalk 评论由 GitHub Issues 保存；OAuth Secret 只存于 Cloudflare Worker Secret，不进入浏览器 bundle 或仓库。
- Cloudflare Pages 与 GitHub Actions 负责托管和发布；发布变量/Secret 的职责见 [配置](../operations/config.md) 和 [发布](../operations/deploy.md)。

验证于：2026-09-28，按当前仓库根目录、workflow 与内容输入路径核对。
