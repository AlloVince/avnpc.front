# 构建与历史发布配置
## 何时读
修改构建资源、镜像、CI 或准备发布时。

## AC-003 静态博客发布链路

目标产物是 Next 静态导出 `web/out/`，由 Cloudflare Pages 直接托管。已批准使用前端仓 GitHub Actions 构建并调用 Wrangler Direct Upload；线上项目和自定义域名仍待核实，尚未部署。

### 自动触发

1. `avnpc.content` 在 `master` 分支 push `source/**` 时，`.github/workflows/notify-frontend.yml` 通过 GitHub CLI 触发 `avnpc.front` 的 `deploy-blog.yml`。
2. 前端 workflow 检出两个仓，执行 `pnpm --dir web install --frozen-lockfile` 和静态构建，然后将 `web/out/` 上传到 Cloudflare Pages。
3. 内容 push 将显式上传到 `master` 生产分支。前端仓 Actions 页面手动运行时，默认建 `preview-<run number>` 预览部署；确认预览后可选择 `production`。

### 账号配置（值只填在各自控制台，不要发到聊天或仓库）

**GitHub**

- 在 `AlloVince/avnpc.content` → Settings → Secrets and variables → Actions → Secrets 新增 `FRONT_REPO_WORKFLOW_TOKEN`。
- 使用细粒度 PAT，只授权 `AlloVince/avnpc.front` 一个仓库，并授予 Actions: write；这是 GitHub workflow dispatch endpoint 所需权限。
- 在 `AlloVince/avnpc.front` → Settings → Secrets and variables → Actions → Variables 新增 `CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_PAGES_PROJECT`。Project 值是 Pages 项目名。
- 在同一前端仓 Actions Secrets 新增 `CLOUDFLARE_API_TOKEN`；Cloudflare token 只授予目标 account 的 Cloudflare Pages: Edit/Write。

**Cloudflare**

- 确认目标 Pages 项目为 Direct Upload。Direct Upload 项目的 `production_branch` 需通过 Cloudflare Pages API 设为 `master`，否则生产上传可能只成为 preview。
- 确认项目名和 Account ID 与前端仓的 Actions Variables 相同。
- 核对项目的 Custom Domains 已绑定用户指定的 `avnpc.com`。当前项目类型、旧站入口、域名绑定及 DNS 均未读/未改。
- Cloudflare 文档说明 Direct Upload 与 Git integration 是不同项目类型，Direct Upload 项目之后不能切换为 Git integration；若当前博客仍由 Git integration 项目托管，先确认目标项目再切换域名。[Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- 设置 Direct Upload 项目的生产分支时，在你自己的终端设置 `CLOUDFLARE_API_TOKEN` 环境变量后，可按 Cloudflare 官方 Pages API 将 `production_branch` 改成 `master`：`curl --fail-with-body --request PATCH "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$CLOUDFLARE_PAGES_PROJECT" --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" --header "Content-Type: application/json" --data '{"production_branch":"master"}'`。不要把 token 放入命令正文、聊天或仓库。[Cloudflare Pages API](https://developers.cloudflare.com/pages/configuration/api/)

账号配置完成后，先通过前端仓 Actions 手动运行（默认 `preview`）并检查 Pages 预览地址；确认文章/slug、搜索、RSS、robots、sitemap 和隐藏文章行为后，再手动选择 `production` 部署并核对自定义域名。此后内容 push 会自动部署到 `master` 生产分支。

### 权限和恢复

- 不需要前端仓读取内容仓的额外 secret，当前内容仓按公开文章源处理；内容仓只需要能够 dispatch 前端 workflow 的 PAT。
- Cloudflare API token 存在 GitHub Secrets，不写入日志或构建产物。Account ID 与 Pages 项目名是 GitHub Actions Variables，不是凭证。
- Cloudflare Pages 保留此前部署版本，可在 Pages 部署页面恢复上一部署。不要在未确认目标项目/domain 归属前直接上传生产版本。
- 本地静态验收命令与内容字段规则见 [现代前端](../development/modern-web.md)。

## 根目录旧应用（历史）

以下 Docker/Travis 记录来自根目录旧 Next 9 应用，不是当前 `web/` 发布链路，也不代表仍在线使用。

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
