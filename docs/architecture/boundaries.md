# 系统与模块边界
## 何时读
判断归属、影响面或是否需要跨仓改动时。
## 真实模块
| 文档模块 | 代码对应 | 负责 | 不负责 |
|---|---|---|---|
| [server](../components/server/README.md) | `server.js`、`routes.js` | 服务生命周期、静态分流、路由映射 | API 数据与内容存储 |
| [pages](../components/pages/README.md) | `pages/` | 路由页面、取数、SSR 外壳、跳转、feed | 通用请求机制、数据库查询 |
| [components](../components/components/README.md) | `components/` | 导航、文章展示、评论挂载、错误 UI | 顶层数据查询 |
| [services](../components/services/README.md) | `services/http_client.js` | REST URL、fetch、JSON/异常 | 缓存、持久化、业务校验 |
| [markdown](../components/markdown/README.md) | `markdown/index.js` | Markdown、扩展、高亮、图表占位 | 获取内容、浏览器图表初始化 |
配置 `config/`、`universal.config.js` 及样式/构建文件是运行支撑，分别归 operations，不伪造额外业务模块。`engine` 是 `./node_modules/.bin/engine` 符号链接，不是源代码模块。
## 外部边界
- 内容、笔记与搜索结果经后端 API 提供；本仓没有内容 CRUD、搜索索引或模型实现。`config/` 含 DB/Redis/Swagger 模板不证明前端拥有这些业务能力。
- 评论集成 Gitalk/GitHub，浏览器动态从 CDN 取 Gitalk 和 Mermaid；正文还可嵌入 CodePen。可用性与版本不全由本仓控制。
- SSR 和浏览器共享通用配置与请求代码；公开配置不能放凭据。正文/摘要以 HTML 插入，内容可信度与上游清理契约待确认。
- EvaEngine 内部 bootstrap、配置合并及基础设施连接行为属于外部依赖；首扫未读依赖实现，不声称必须配置数据库或 Redis 才能启动。
## 变更关联
路由改动同时核对 pages 和链接；正文改动核对 Markdown/UI/样式；API 契约改动核对 HTTP client 与消费者；部署/变量改动核对服务、构建和浏览器注入边界。
## 相关
- 代码：`server.js`、`routes.js`、`config/`、`universal.config.js`、上述模块路径。
- 文档：[概览](overview.md)、[配置](../operations/config.md)、[部署](../operations/deploy.md)。
验证于：2026-09-17，静态首扫。
