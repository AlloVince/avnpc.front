# 运行特征与排障入口
## 何时读
排查启动、缺失样式、数据错误或进程退出时；以下是检查入口，不是已复现故障结论。
## 现象 → 检查
| 现象 | 先看 |
|---|---|
| engine 不可执行 | 它链接到 node_modules/.bin/engine；核对依赖安装，不新建源码替代 |
| 无法解析 vendor-manifest 或页面没样式 | DLL 构建是否先完成；manifest.name 与静态 CSS 是否一致 |
| 本地仍访问线上 | BACKEND_URL/FRONTEND_URL 默认值、配置加载时序与浏览器注入 |
| 列表/详情渲染异常 | API JSON 形状；pages 深层解构、post.text/tags、空结果假设 |
| HTTP 异常没有预期消息 | HTTP client 先解析 JSON 再看状态；未配置超时/重试 |
| feed 异常 | rss 依赖服务端 res、非空 results；响应与链接细节见 pages 文档 |
| 根 robots/sitemap 不可访问 | server 有分流，但受控 static 中未发现对应文件 |
| Docker 中出现 dev 行为 | 实际 NODE_ENV；Dockerfile CMD 本身不设置 production |
| 收到退出信号仍短暂存活 | server 定时约 10 秒退出，未显式关闭 HTTP server |
## 日志与外部能力
server 使用 DI logger 和 debug middleware，并注册 EvaEngine 的 server error/uncaughtException 处理；日志配置见 config。不要把依赖内部行为或没有证据的自动恢复写成保证。
评论、图表、异常图片和统计含外部资源；页面 HTML 成功不代表客户端功能全部可用。本次没有线上观测、浏览器测试或压测。
## 相关
- 代码：`server.js`、`components/BlogHeader.js`、`components/BlogPost.js`、`services/http_client.js`、`config/`、`static/`。
- 文档：[server](../components/server/README.md)、[pages](../components/pages/README.md)、[配置](config.md)、[测试](../development/testing.md)。
验证于：2026-09-17，静态首扫。
