# AGENTS.md

<!-- 协议参考基线：agent.protocol v0.3.0（https://github.com/AlloVince/agent.protocol），commit 0f98a08；该仓无 tag，本地工作区干净。 -->

## 项目与入口

- 名称与目标：`avnpc.front`，avnpc.com 当前生产静态博客。仓库根目录是 Next.js 16 App Router 静态导出，读取 `avnpc.content` 的 Markdown 构建后发布到 Cloudflare Pages。
- 边界：负责静态构建、页面展示、浏览器交互、Gitalk 评论 UI 与 `worker/gitalk-oauth/`、Pages 发布链路；不负责后端 API/数据库、文章内容源（属 `avnpc.content`）、Cloudflare/GitHub 凭据与 DNS 配置。系统边界见 [边界](docs/architecture/boundaries.md)。
- 按任务阅读：入口表在 [docs/index.md](docs/index.md)。结构与数据流 [架构概览](docs/architecture/overview.md)；静态实现与 front matter 规则 [现代前端](docs/development/modern-web.md)；环境 [setup](docs/development/setup.md) / [commands](docs/development/commands.md) / [testing](docs/development/testing.md)；发布与配置 [deploy](docs/operations/deploy.md) / [config](docs/operations/config.md) / [runtime](docs/operations/runtime.md)。
- 正式命令：`package.json` scripts 与 [命令表](docs/development/commands.md)——`pnpm install --frozen-lockfile`、`pnpm lint`、`pnpm test`、`pnpm build`（需 `CONTENT_ROOT`）、`pnpm dev`、`pnpm start`。发布只由 `.github/workflows/deploy-blog.yml` 执行，Worker 部署用文档中的 `pnpm dlx wrangler@4.136.3` 命令。
- 已有基础设施：`lib/`（内容读取、查询参数、日期、feed、Markdown）、`components/`（展示与评论 UI）、`scripts/validate-content.js`（构建输入校验）、`tests/`（Vitest）、`patches/`、`worker/gitalk-oauth/`。新增读取、渲染、feed 或校验能力前先扩展这些位置。
- 所属系统：`../avnpc.super`（总仓）。系统地图与 ownership 见其 [仓库登记表](../avnpc.super/docs/architecture/repositories.md)，当前工作见 [当前状态](../avnpc.super/docs/status/current.md)，事实归属与审批门槛见 [责任边界](../avnpc.super/docs/architecture/boundaries.md)。跨仓改动按总仓 `AGENTS.md` 的 L2 流程确认。

## 权威与事实

- 当前人类指令优先，其次是相关 `owner/` 长期意图和本文件（子目录更近的 `AGENTS.md` 更具体）。`owner/` 默认只读，只有当前人类明确要求修改具体文件时才可动它。
- 实际行为以代码、测试、构建产物和线上检查验证；docs 与旧报告不能代替验证。事实优先级：代码行为 > 测试 > 已确认决策/文档 > 历史陈述 > 新生成内容。
- 区分当前实现、已批准目标、过期说明与实现偏离；未验证项标「待确认」，不把现状当正确目标。

## 复用与正式操作入口

- 新增内容读取、渲染、feed、校验、评论或发布能力前，先查本仓 `lib/`、`components/`、`scripts/`、`worker/`，再查总仓声明的跨仓能力（如内容 schema 在 `avnpc.content`）。能力不足或复用会破坏部署/数据边界时，先说明原因再新增。
- 构建、校验、发布、Worker 部署、依赖安装一律走上面的正式命令与 workflow；一次性调查可用临时代码，不保留第二套操作路径。
- 文章内容与 front matter 只在 `avnpc.content` 提交，不在本仓复制或生成 Markdown；`CONTENT_ROOT` 指向内容仓 `source/`。改内容读取方式或公开 URL 规则属于跨仓 contract 变更。

## 人类可读与改动纪律

- 清晰命名、直接控制流、显式数据流；遵循现有 App Router 与静态导出模式，不做过度抽象或隐式魔法。
- 保留现有整体布局、配色与视觉风格，不添加口号、格言或无关装饰；只做简洁的细节调整。现代化不等于重新设计授权。
- 禁止堆积超长函数、超大文件、混杂职责和重复实现；按职责整理，不机械拆文件、不加抽象层掩盖复杂度。
- 不混入无关重构、依赖升级或格式化；不为假想需求加依赖；不静默改变公开 URL、构建输入约定或 Gitalk 行为。
- 改动规模：微（文案、typo）直接改；小（局部修正）先读相关 docs/代码；中（功能、跨文件）先简述影响、做法与风险；大（架构、边界、主技术栈）先说明问题、现有能力为何不够、最简方案、影响与验收，必要时写 ADR。

## 工程默认线

- 构建输入校验复用 `scripts/validate-content.js`，不另建平行校验脚本；`pnpm build` 必须能失败退出。
- Cloudflare Pages 已承担传输层压缩，应用层不重复启用；`_headers` 的 MIME 与缓存配置见 [发布](docs/operations/deploy.md)。
- 凭据只走 GitHub Actions secrets/variables 与 Cloudflare Worker Secret；不写入 `.env*`、前端 bundle 或仓库。旧 OAuth Secret 曾泄露并已轮换，不恢复历史明文。
- 批量或长任务给出阶段、进度、失败项与最终摘要；静态构建日志要能判断内容校验在哪一步失败。

## 文档准入

`README.md` 与 `owner/` 面向人类；`docs/` 只保存长期有效、原生载体难以表达且能减少未来误判或重建成本的知识，写法见 [docs 规范](docs/spec.md)。不保存 session 流水账、当前焦点、下一步或一次性 debug；过期内容修正或删除。

## 长任务与交付

- 先明确最终可见成果与可观察验收条件；研究与中间步骤不能替代最终成果。下一步明确、已授权且无真实阻塞时继续。
- 每个可验证阶段结束前检查并重构本任务累积的代码；中间产物按实际规模使用分块或流式，不堆成需整量载入的超大单体。
- 按变更范围运行 `pnpm lint`、`pnpm test` 和（涉及内容或构建时）`pnpm build`；不为绿灯弱化测试，说明未验证项（例如 OAuth 登录、浏览器 Mermaid 渲染、移动端交互与搜索体验）。
- 除非人类明确要求，不自动 commit / push / release；保留用户已有未提交改动。
