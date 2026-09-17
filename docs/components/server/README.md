# server：服务入口与路由
## 何时读
修改监听、请求分发、路由或信号处理时。
## 职责与边界
`server.js` 初始化 EvaEngine/Express 和 Next，通过 Node HTTP 服务承载页面；`routes.js` 导出 next-routes 实例，供服务端 handler 和 UI 的 Link/Router 共用。不实现后端 API。
## 入口与依赖
- 先 require `universal.config`，再 `engine.bootstrap()`、`EvaEngine.getApp()`；等待 `app.prepare()` 后注册 debug middleware 和 GET `*`。
- `PORT` 解析整数，假值回退 3000；Next 的 dev 判定严格为 `NODE_ENV !== 'production'`。
- `/robots.txt`、`/sitemap.xml`、`/favicon.ico` 交 `app.serveStatic`；其它请求交 next-routes handler。
- 路由：`/` index、`/rss` rss、`/thinking` thinking、`/reading` reading、`/search` search、`/reading/:slug` note、`/p/:id` p、`/pages/:slug` page、`/about` about。
- `routes.js` 加载 `isomorphic-unfetch`；服务依赖 EvaEngine 的 logger/debug/异常处理，具体 DI 行为未联调。
## 雷区
- 根静态文件有分支不代表资源存在；首扫仅见 favicon，未见 robots/sitemap。
- 多种退出信号触发定时器，约 10 秒后 `process.exit(0)`，未显式停止接收请求或 drain；不描述为完整优雅停机。
- `preview` 仍令 Next 进入 dev；不要仅按通用配置的 production/preview 分组判断服务运行模式。
## 相关
- 代码：`server.js`、`routes.js`、`universal.config.js`。
- 文档：[pages](../pages/README.md)、[运行](../../operations/runtime.md)。
验证于：2026-09-17，静态首扫。
