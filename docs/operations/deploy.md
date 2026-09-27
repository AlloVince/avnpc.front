# 构建与历史发布配置
## 何时读
修改构建资源、镜像、CI 或准备发布时。

## AC-003 静态博客发布链路

目标产物是 Next 静态导出 `web/out/`，由 Cloudflare Pages 直接托管。2026-09-27 已创建 Direct Upload 项目 `avnpc-blog`，生产分支为 `master`；前端 Actions 构建并上传成功，生产站已在 `https://avnpc-blog.pages.dev/` 提供服务。`avnpc.com` Pages custom domain 状态已于 2026-09-28 验证为 `active`；权威 DNS 返回 Cloudflare edge A 记录，HTTPS 首页和文章页均返回 200。`www.avnpc.com` 当前没有 DNS 记录，不属于已配置入口。

### 自动触发

1. `avnpc.content` 在 `master` 分支 push `source/**` 时，`.github/workflows/notify-frontend.yml` 通过 GitHub CLI 触发 `avnpc.front` 的 `deploy-blog.yml`。
2. 前端 workflow 检出两个仓，执行 `pnpm --dir web install --frozen-lockfile` 和静态构建，然后将 `web/out/` 上传到 Cloudflare Pages。
3. 内容 push 将显式上传到 `master` 生产分支。前端仓 Actions 页面手动运行时，默认建 `preview-<run number>` 预览部署；选择 `production` 上传 `master`。只有首次域名关联时勾选 `bind_domain`；内容 push 自动生产部署不重复创建域名关联。

### 账号配置（值只填在各自控制台，不要发到聊天或仓库）

**GitHub**

- 在 `AlloVince/avnpc.content` → Settings → Secrets and variables → Actions → Secrets 新增 `FRONT_REPO_WORKFLOW_TOKEN`。
- 使用细粒度 PAT，只授权 `AlloVince/avnpc.front` 一个仓库，并授予 Actions: write；这是 GitHub workflow dispatch endpoint 所需权限。
- 在 `AlloVince/avnpc.front` → Settings → Secrets and variables → Actions → Variables 新增 `CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_PAGES_PROJECT`。Project 值是 Pages 项目名。
- 在同一前端仓 Actions Secrets 新增 `CLOUDFLARE_API_TOKEN`；Cloudflare token 只授予目标 account 的 Cloudflare Pages: Edit/Write。

**Cloudflare**

- 目标项目 `avnpc-blog` 已确认为 Direct Upload，生产分支为 `master`。
- 确认项目名和 Account ID 与前端仓的 Actions Variables 相同。
- `avnpc.com` 的 Pages API 状态为 `active`，DNS 已解析到 Cloudflare edge。若后续重新配置，先核对 apex CNAME `@ → avnpc-blog.pages.dev` 为 Proxied，且没有冲突记录；保留 MX/TXT 等其他记录。Cloudflare 官方说明自定义 apex 域需由 Cloudflare zone 托管，并通过 Pages 的 custom domain 流程关联项目。[Cloudflare Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- Cloudflare 文档说明 Direct Upload 与 Git integration 是不同项目类型，之后不能互换；当前 `avnpc-blog` 已确定为 Direct Upload。[Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)

已验证的自动链路：内容仓 `master` push → 内容仓 Actions dispatch 前端 `target=production` → 前端构建并上传。预览 run `36328775016`、内容 push dispatch run `36328905425`、生产 run `36328947264`、域名关联 run `36329785592`、域名验证 run `36332296058` 均成功。2026-09-28 Pages domain API 返回 `active`；权威 DNS 返回 Cloudflare edge 地址。首页、旧文章、迁移文章、`listed:false` 文章均返回 200；隐藏文章带 `noindex` 且不在搜索索引。robots、sitemap、RSS、search index 也返回 200。`www.avnpc.com` 尚未配置；若产品需要该别名，需另设 DNS 和重定向。

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
