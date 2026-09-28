# 测试与验收

## 当前入口

| 命令 | 覆盖 |
|---|---|
| `pnpm --dir web lint` | ESLint 检查 `web/` |
| `pnpm --dir web test` | Vitest：API 错误处理、查询参数、Markdown 输出与 Atom feed |
| `CONTENT_ROOT=/Users/allovince/Developer/avnpc.content/source FRONTEND_URL=https://avnpc.com pnpm --dir web build` | 全量 front matter 校验和 Next.js 静态构建 |

Playwright 配置依赖存在，但没有可报告通过的 E2E 套件。静态构建通过不证明 OAuth 登录、浏览器 Mermaid 渲染或移动端交互完整。

## 本轮依赖清理验证（2026-09-28）

- 冻结安装通过。
- `pnpm --dir web lint` 通过。
- 静态生产构建通过，读取 199 篇文章并生成静态站点。
- `pnpm --dir web audit` 报告没有已知漏洞。
- Vitest 15/15 通过；修正 Atom 测试 fixture，使其提供 feed 实际消费的 `body` 字段。
- 根目录旧 Next.js 应用、Docker 和 Travis 文件已从工作树移除；它们不属于当前构建和发布路径。

## 相关

- [现代前端](modern-web.md)
- [命令](commands.md)
- [运行与排障](../operations/runtime.md)
