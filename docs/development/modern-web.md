# 现代前端 web/

更新：2026-09-17。适用于本轮本地演示；不代表生产切换或完整博客验收。

## 范围与决定
- `web/` 是独立 Next.js App Router 应用，保留 SSR 和既有主要 URL；参考 javken.mobile 的现代工具链方向，不照搬 Vite SPA，不引入新服务。
- 根目录旧 Next 9 / React 16 / AntD 3 应用、Docker 与 CI 未迁移；运行新应用必须指定 `web/`。旧应用文档仍是历史路径说明。
- 固定 Next 16.3.5、React/react-dom 19.3.0，Node 24（本机验证 24.18.0）、pnpm 11.22.0；精确解析以 `web/pnpm-lock.yaml` 为准。不将版本声明等同持续的“最新版本”。
- L1：独立目录隔离旧依赖与构建，保留 SSR/API/URL；代价是两套入口暂时并存，部署尚未切换。API、ownership、数据存储 contract 未改变。

## 视觉兼容约束（2026-09-17 用户纠正）
- 现代化仅升级实现，不授权重新设计：整体配色、布局和页面效果以根目录旧版 `components/BlogHeader.js`、`pages/index.js`、`styles/blog.css`、`styles/antd.less` 为基准；不新增口号、格言、装饰区。
- `web/` 已恢复深蓝 200px 固定侧栏、白底蓝链、原 Logo 字体、紧凑文章列表和正文基础排版；移除首页 Hero、页脚格言、阅读页口号与列表装饰箭头。移动端保留可折叠导航。
- 字体从旧 `static/fonts` 构建；Turbopack root 为仓根，`web/postcss.config.js` 隔离旧 PostCSS 插件，不新增依赖。
- 本轮现有单测 15/15、生产构建和 diff 检查通过。模拟数据仅查看了首页 DOM，不是截图对比或真实后端验收；临时服务与测试数据文件已清理。现场 18347/18348 未运行，桌面/移动端真实内容视觉及交互仍待复验，不声称像素级还原。

## 运行
在 `web/` 中执行，或使用 `pnpm --dir /Users/allovince/Developer/avnpc.front/web …`：

| 命令 | 行为 |
|---|---|
| `pnpm install --frozen-lockfile` | 根据锁文件安装；不要在根目录安装代替新应用 |
| `pnpm dev` | 开发服务器，127.0.0.1:18348 |
| `pnpm lint` | ESLint 检查新应用 |
| `pnpm test` | Vitest 单元测试 |
| `pnpm build` | Next 生产构建，写入 web/.next |
| `pnpm start` | 使用既有构建在 127.0.0.1:18348 启动；与 dev 二选一 |
| `pnpm test:e2e` | 仅预留 Playwright 脚本；尚无 E2E 测试集，不作为已通过证据 |

- 后端须先运行于 `http://127.0.0.1:18347`，启动方式归 avnpc.js 维护。本仓不会导入内容或启动 DB/Redis。
- 配置示例为 `web/.env.example`；可复制为被忽略的 `.env.local` 或通过进程环境注入。`BACKEND_URL` 用于服务端取数，默认本机 18347；`FRONTEND_URL` 用于 Atom 链接，默认本机 18348。
- 监听仅限 loopback；未部署，其他设备不能通过自己的 127.0.0.1 访问。不要把旧 Docker/Makefile 当作新应用启动流程。

## 模块与请求路径
- `app/`：服务端页面、metadata、错误页与 route handlers。首页及 `/thinking` 列表，`/pages/[slug]` 文章，`/about`，Reading/Search 页面，`/p/[id]` 302，`/rss` Atom，robots。
- 页面 → `lib/api.js` → 后端 REST API（no-store，10 秒超时，错误详情不透出）→ `components/PostList.js` / `Post.js`。
- `lib/queries.js`：分页范围及 tag/q 参数；`lib/markdown.js`：Markdown、脚注/公式/代码高亮与 HTML 清理，avnpc.com 内链本地化；`lib/feed.js`：XML 转义与 Atom 输出。
- `app/globals.css`：原生 CSS 与响应式布局；旧 DLL/AntD 样式管线不参与新构建。

## 验证证据与限制
- 本轮 `pnpm lint`、`pnpm test`（15/15）、`pnpm build` 成功。单测覆盖 API 参数/失败（含 HTTP 200 错误包裹拒绝）、分页参数、Markdown 清理/格式和 Atom 文本转义，不等于端到端覆盖。
- HTTP：首页、Thinking、About、文章、RSS、robots 为 200；`/p/197` 为 302；不存在的文章为 404。RSS 10 条；列表来自既有真实数据（186 篇）。
- 浏览器已检查首页、文章、About、标签/分页、404、降级提示和客户端导航。自动化 Playwright 套件未运行；移动端完整交互和所有历史正文类型尚不能宣称覆盖。
- Reading：`/v1/evernote/notes` 返回 404。Search：直接 `?q=React` 为 400；带分页参数时上游返回 HTTP 200 的 PERMISSION_DENIED 错误对象（无 results/pagination）。前端 `lib/api.js` 已拒绝此类包裹并按状态码降级，重启后浏览器复验 `/reading`、`/search?q=React` 均显示不可用提示、首页正常；状态码 200 不等于功能成功，接通仍需后端/外部授权。
- 评论未配置；旧 Mermaid/交互式目录及外部嵌入没有等价迁移验收。不要把“正文基础渲染通过”写成旧功能全部兼容。
- 未执行内容源 → 导入 → 数据库的新一轮验证，未做生产部署或用户最终验收。完整博客目标仍有上述缺口。

## 维护注意
- ESLint 暂固定 9.39.5：本轮 ESLint 10 与 eslint-plugin-react 组合不兼容；不绕过规则冒充 lint 成功。
- `web/pnpm-workspace.yaml` 显式禁止 unrs-resolver 构建脚本；升级依赖时复核，不默认允许所有脚本。

相关：[架构](../architecture/overview.md)、[命令](commands.md)、[测试](testing.md)。
