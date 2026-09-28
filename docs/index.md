# 项目文档

仓库根目录维护当前上线的静态博客应用。旧 Next.js 服务端应用及其 Docker/Travis 发布链路已退役并清理。

| 任务 | 文档 |
|---|---|
| 系统结构与职责 | [架构概览](architecture/overview.md)、[边界](architecture/boundaries.md) |
| 本地环境、命令与验证 | [现代前端](development/modern-web.md)、[环境](development/setup.md)、[命令](development/commands.md)、[测试](development/testing.md) |
| 内容和 OAuth 配置 | [配置](operations/config.md) |
| Cloudflare Pages 发布 | [发布](operations/deploy.md) |
| 排查静态构建和发布 | [运行与排障](operations/runtime.md) |
| 文档结构 | [规范](spec.md) |

前端从 `avnpc.content/source/` 读取文章，运行时不依赖 `avnpc.js`、数据库或 Redis。内容 schema 与文章源由内容仓维护；部署环境与凭据由 GitHub Actions/Cloudflare 管理。
