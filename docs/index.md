# 项目知识地图
## 何时读
从 `AGENTS.md` 进入后，按当前任务选读；不全量加载。

现代应用 `web/` 的架构、配置、运行和验证统一见 [现代前端](development/modern-web.md)。以下 server/pages/components/services/markdown 模块文档描述根目录旧应用，不代表新 App Router 实现；旧 Docker/CI 尚未切换。
## 任务 → 路径
| 任务 | 文档 |
|---|---|
| 理解系统、主数据流 | [架构概览](architecture/overview.md) |
| 判断模块职责与外部边界 | [边界](architecture/boundaries.md) |
| 修改服务入口、路由分发 | [server](components/server/README.md) |
| 修改页面、数据查询、RSS | [pages](components/pages/README.md) |
| 修改页头、文章展示、评论与错误 UI | [components](components/components/README.md) |
| 修改 HTTP 请求与错误处理 | [services](components/services/README.md) |
| 修改 Markdown、代码块与图表 | [markdown](components/markdown/README.md) |
| 配置开发环境、查看历史限制 | [setup](development/setup.md) |
| 运行、构建、检查命令与副作用 | [commands](development/commands.md) |
| 测试现状与建议验收 | [testing](development/testing.md) |
| 修改样式管线、构建、发布 | [deploy](operations/deploy.md) |
| 配置变量与公开配置边界 | [config](operations/config.md) |
| 排查启动、静态文件、退出行为 | [runtime](operations/runtime.md) |
| 维护文档结构 | [规范](spec.md) |
## 证据与待确认
- 首扫：2026-09-17；基于本地源码与配置静态核对，不代表运行验证或线上状态。
- 模式 B（已有项目）；用户不可用并授权自主判断，采用默认偏好包 `defaults`，不是用户逐项人工确认。
- 协议来源：`AlloVince/agent.protocol`，版本 0.2，提交 `945e6d7340f8e31861014127bf6aaa70d77596e4`。
- 原 `README.md` 保留；项目描述纳入架构概览，开发补丁说明纳入 setup 并标待确认。首扫未发现既有 docs 或 AI 规则。
- 待确认分置 setup（运行版本、历史补丁）、testing（验证能力）、deploy（线上发布状态）、模块文档（接口契约）；不把静态推断写成已验证行为。
- 无已确认的新架构决策，不生成 ADR；有决策时按规范建 `architecture/adr/` 并更新地图。
## 相关
- 代码：仓库根 `README.md`、`package.json`、`server.js`、`routes.js`。
- 流程：`../.ai/workflow/start.md`、`../.ai/workflow/sync.md`、`../.ai/workflow/end.md`。
