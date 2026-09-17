# 构建与历史发布配置
## 何时读
修改构建资源、镜像、CI 或准备发布时。
## 样式与 Next 构建
- webpack.dll.js 入口包含 NProgress、styles/antd.less、styles/blog.css、KaTeX、Gitalk、高亮主题；ExtractTextPlugin 生成 vendor 哈希 CSS，DllPlugin 写 static/vendor-manifest.json。
- BlogHeader 在渲染时 require manifest，读取 name 作为样式 URL；next.config.js 的 DllReferencePlugin 已注释，不能据 DLL 命名声称启用了 JS DLL 引用。
- Next 配置扩展字体/CSS/Less/Stylus/ico loader，启用 source-map；Babel 使用 next/babel 与动态导入语法插件。
- postcss.config.js 列 easy-import → url inline → autoprefixer；package.json 另有 lost/postcss-nested 声明，实际组合取决于旧工具链，待构建验证。
- static/vendor* 与 .next 被 Git 忽略；不要把生成资源当需手工维护的源码。
## Dockerfile（静态事实）
node:10-alpine；设置 Asia/Shanghai；复制仓库到 /opt/htdocs/avnpc.front；npm install/build/prune --production；暴露 3000；CMD 为 node ./server.js。
- Dockerfile 没有设置 NODE_ENV=production；RUN 构建里的变量不会成为运行时 ENV，不能断言该 CMD 自动以生产模式启动。真实部署环境待确认。
- .dockerignore 未排除 .env、node_modules、.next；发布前须由负责人核查上下文，不能假定 .gitignore 能阻止它们进镜像。不在本次改配置。
## Travis（历史配置，不代表当前服务有效）
- master 且无 tag：Node 10，npm install、lint、travis-deploy-once 包装 semantic-release；npmPublish=false。
- 有 tag：生成 CI 元信息，构建 allovince/avnpc.front，登录 Docker，推送 latest 和 tag。密钥由 CI 环境变量提供，禁止抄录值。
- defaults 的 main 是通用偏好；本仓 CI 明确匹配 master，不改分支名或发布策略。
## 待确认
Travis/semantic-release 当前是否仍使用、镜像是否仍发布、运行环境注入、代理/域名/回滚/监控方案。仓库未提供这些事实，不补写假设运维手册。
## 相关
- 代码：`Dockerfile`、`.dockerignore`、`.travis.yml`、`Makefile`、`webpack.dll.js`、`next.config.js`、`babel.config.js`、`postcss.config.js`、`styles/`。
- 文档：[命令](../development/commands.md)、[配置](config.md)、[运行](runtime.md)。
验证于：2026-09-17，静态首扫；未构建或发布镜像。
