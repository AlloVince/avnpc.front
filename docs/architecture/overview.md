# 架构概览
## 何时读
理解系统定位、请求主路径或跨模块改动时。

## 现代应用（AC-003 静态恢复）
`web/` 为独立 Next 16 / React 19 App Router 静态导出应用。构建从 `avnpc.content` 读取 Markdown/front matter，输出 slug 页面、列表、浏览器全文搜索索引、RSS、robots 和 sitemap；运行时页面不请求 `avnpc.js`。GitHub Actions 发布方案已实现，需 Cloudflare Direct Upload 项目和账号配置，尚未部署。根目录旧应用仍保留但不参与静态构建。实现、验证和未决评论/发布配置见 [现代前端](../development/modern-web.md) 与 [发布](../operations/deploy.md)。以下各节仅描述根目录旧应用。
## 定位与证据
- `avnpc.front`：avnpc.com 的 SSR 博客前端；原 README 指向独立后端 `AlloVince/avnpc.js`。已有实现，当前运营/维护阶段待确认。
- 声明依赖：Next.js `^9.0.2`、React `^16.8.6`、Ant Design `^3.20.3`、EvaEngine `^0.11.1`、Webpack `^4.35.3`。无锁文件，不能把声明版本当已安装版本。
- JavaScript，自定义 Node HTTP/EvaEngine 服务；Next Pages 路由与 `getInitialProps`，不是 App Router 或静态站生成项目。
## 主数据流
1. `server.js` 加载通用配置，初始化 EvaEngine/Express 与 Next，准备完成后监听端口。
2. GET 请求先匹配根静态文件特殊分支，否则交给 `routes.js` 的 next-routes handler。
3. 页面 `getInitialProps` → `services/http_client.js` → `BACKEND_URL` 的博客、笔记或搜索 API → JSON props。
4. 列表由 pages 展示；文章/笔记正文交给 `BlogPost` → Markdown HTML；客户端挂载再初始化评论、图表、目录和嵌入。
5. `_document.js` 将通用配置写入浏览器；路由导航可在客户端重新取数据，不能把 HTTP client 视为仅服务端代码。
6. `/p/:id` 处理跳转；`/rss` 直接写 Atom XML 响应，均不等同普通页面渲染。
## 构建路径
`webpack.dll.js` 将全站/第三方样式提取到 `static/` 并生成 manifest；`BlogHeader` 根据 manifest 加载样式；随后 `next build` 生成 `.next`。这两步的顺序是现有代码依赖。
## 已有约定
类组件、静态 `getInitialProps`、页面局部取数；服务端/构建配置用 CommonJS，页面与共享组件用 ES modules。ESLint 继承 Airbnb 并有项目覆盖，EditorConfig 约定 JS 两空格；不以默认偏好覆写既有代码模式。
## 相关
- 代码：`README.md`、`package.json`、`server.js`、`routes.js`、`pages/`、`webpack.dll.js`。
- 文档：[边界](boundaries.md)、[环境](../development/setup.md)、[模块地图](../index.md)。
验证于：2026-09-17，静态首扫；未安装、构建或联调。
