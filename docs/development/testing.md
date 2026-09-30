# 测试与验收

## 当前入口

| 命令 | 覆盖 |
|---|---|
| `pnpm lint` | ESLint 检查前端源码 |
| `pnpm test` | Vitest：Markdown 输出与 Atom feed |
| `CONTENT_ROOT=/Users/allovince/Developer/avnpc.content/source FRONTEND_URL=https://avnpc.com pnpm build` | 全量 front matter 校验和 Next.js 静态构建 |

没有 E2E 套件。静态构建通过不证明 OAuth 登录、浏览器 Mermaid 渲染或移动端交互完整。

## 本轮依赖清理验证（2026-09-28）

- 冻结安装通过。
- `pnpm lint` 通过。
- 静态生产构建通过，读取 199 篇文章并生成静态站点。
- `pnpm audit` 报告没有已知漏洞。
- Vitest 15/15 通过；修正 Atom 测试 fixture，使其提供 feed 实际消费的 `body` 字段。
- 根目录旧 Next.js 应用、Docker 和 Travis 文件已从工作树移除；它们不属于当前构建和发布路径。

## 死代码清理（2026-09-30）

- 退役 SSR 时代遗留的 `lib/api.js`（后端 API client）与 `lib/queries.js`（后端查询参数校验）已删除。静态构建不读 `avnpc.js`、数据库或 Redis，二者只被自身单元测试引用。
- 随之删除的 Vitest 用例不再覆盖后端错误处理；测试数从 15 降到 5。
- `test:e2e` 脚本、`@playwright/test` 依赖和 Playwright 的 ignore 条目已删除；仓库没有 `playwright.config.*`，该脚本原本无法运行。
- 验证：冻结安装、`pnpm lint`、`pnpm test`、`pnpm build`、`pnpm audit` 均通过。

## 相关

- [现代前端](modern-web.md)
- [命令](commands.md)
- [运行与排障](../operations/runtime.md)
