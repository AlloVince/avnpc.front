# 配置与公开边界
## 何时读
修改环境变量、运行模式、后端地址或配置注入时。

## 静态博客构建配置
- `CONTENT_ROOT` 是构建期路径，指向内容仓的 `source/`。本机默认 sibling `avnpc.content/source`；GitHub workflow 指向其 checkout 路径。它不会写入浏览器或静态 bundle。
- `FRONTEND_URL` 只供构建期 RSS 链接使用，静态发布默认 `https://avnpc.com`。
- Cloudflare API token 只保存在前端 GitHub Actions secret `CLOUDFLARE_API_TOKEN`；Account ID 和 Pages 项目名保存在 Actions variables。设置步骤见 [发布](deploy.md)。
- 静态页面没有 `BACKEND_URL`，也不把 API URL 或服务器凭证嵌入 HTML。

## Gitalk 评论配置
- Gitalk 已接入静态文章页。OAuth 与 Worker 配置已在 2026-09-28 完成；评论框默认出现在所有发布文章中，除非 front matter 将 `comments` 设为 `false` 或 `comment_status` 设为 `closed`。
- GitHub OAuth App 使用现有 App 与 Client ID；Homepage URL 填 `https://avnpc.com`，Authorization callback URL 填 `https://avnpc.com/pages/`，并启用该 callback 的 wildcard matching，使文章 `/pages/:slug/` 可回跳。只保留 apex 域名。
- 在 GitHub Developer Settings → OAuth Apps → 该 App 的 Client secrets 中生成新 Secret，并删除旧 Secret。旧 Secret 曾出现在前端源码，应视为已泄露；不要把新值贴进仓库、聊天或 GitHub Actions。GitHub 建议泄露后生成新 Secret、更新服务并删除旧 Secret，见 [OAuth App 安全建议](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app)。
- Worker 位于 `web/worker/gitalk-oauth/`，只接受 `https://avnpc.com` 的浏览器 Origin，代理路径为 `/oauth/access_token`。在 Worker 上设置 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`；前者可公开但用于核对请求，后者使用 Cloudflare Secret。`ALLOWED_ORIGIN` 已在 Wrangler 配置中设为 `https://avnpc.com`。Cloudflare 要求通过 Worker Secret 保存敏感值，见 [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)。
- 从前端仓根目录部署 Worker：`pnpm dlx wrangler@4.136.3 login`，然后 `pnpm dlx wrangler@4.136.3 deploy --config web/worker/gitalk-oauth/wrangler.toml`。部署后分别运行 `pnpm dlx wrangler@4.136.3 secret put GITHUB_CLIENT_ID --config web/worker/gitalk-oauth/wrangler.toml` 和 `pnpm dlx wrangler@4.136.3 secret put GITHUB_CLIENT_SECRET --config web/worker/gitalk-oauth/wrangler.toml`；命令会交互式提示输入，不要用会回显值的 shell 命令。`secret put` 会发布 Worker 新版本。
- 在前端 GitHub repo Settings → Secrets and variables → Actions → Variables 设置 `GITALK_CLIENT_ID` 为同一个 Client ID，`GITALK_OAUTH_PROXY` 为 `https://<Worker 域名>/oauth/access_token`。两个值都不是 Client Secret。Worker 的 OPTIONS 预检已返回 204，伪造授权码的请求返回 GitHub `bad_verification_code`，确认代理已到达 GitHub 交换端点。
- 评论存于 `AlloVince/avnpc.content`，管理员为 `AlloVince`，Issue 使用 `Gitalk` 与文章 ID 标签。历史文章沿用 `POST_<旧文章 ID>`，新文章使用稳定 slug ID（超过 49 字符时使用稳定摘要）。Gitalk 设置为手动创建 Issue，避免自动产生重复讨论；管理员在确认某篇没有对应旧 Issue 后，可在该文评论区创建 Issue。Issue 映射维护在内容仓 `source/_data/legacy-gitalk.json`。Gitalk 的 Issue 标签和 ID 限制见[官方配置说明](https://github.com/gitalk/gitalk#options)。
- 2026-09-28 已比对 `avnpc.content` 的 90 个公开 Issue，并为所有匹配到当前文章的开放 Issue 添加映射；11 个有评论的开放 Issue 均能由对应文章加载。Gitalk 默认只读取开放 Issue；已关闭的重复 Issue 不会自动并入仍开放的同标签 Issue。
## 通用配置
| 键 | 源码行为 |
|---|---|
| NODE_ENV / ENV | universal.config 按 production/preview 分组，ENV 来自 NODE_ENV 或 development；server 仅 production 关闭 dev |
| BACKEND_URL | 各分组默认 https://api.avnpc.com；开发也会访问线上，除非显式覆盖 |
| FRONTEND_URL | 默认 https://avnpc.com；用于 p 页面跳转，不能认为所有 URL 都随之变化 |
| PORT | server.js parseInt 后回退 3000，不在通用配置注入对象中 |
`universal.config.js` 将结果写入 process.env 并导出；`_document.js` 把整个对象嵌入 HTML，写到 window.__ENV__ 与 process.env。这是公开配置，不放令牌、密码或服务端专属字段。
## EvaEngine 配置
- `config/config.default.js` 包含日志、Redis、DB 读写、session、token、Swagger 配置；development/production/test 文件提供覆盖项。
- 可见变量名包括 REDIS_HOST/PORT、DB_PORT/DATABASE、DB_REPLICATION_WRITE_*、DB_REPLICATION_READ0_*、SWAGGER_HOST；本文不记录凭据值。
- 默认日志位置为 logs/application.log；development 将 logger.file 关闭。实际配置合并优先级与服务连接要求取决于 EvaEngine，未读依赖或运行验证。
- 环境配置中有模板占位及凭据类字段，不能当作有效的安全生产配置；不要将其默认值复制进新环境。
## 加载与风险
- next.config.js 调 dotenv.config；server.js 先加载 universal.config。不要假定只写 .env 就会覆盖已求值的通用配置；启动时序待验证。
- Git 忽略 .env、config/config.local*、config/sequelize.json；首扫不读其内容。Docker 上下文排除规则不同，见 deploy。
- BlogPost 有客户端第三方集成配置；后续应单独确认凭据状态/处置，不在文档复制原值。
- RSS、正文外链与统计部分硬编码；地址切换不能只查 universal.config。
## 相关
- 代码：`universal.config.js`、`config/`、`next.config.js`、`server.js`、`pages/_document.js`、`pages/p.js`、`pages/rss.js`。
- 文档：[环境](../development/setup.md)、[部署](deploy.md)、[UI](../components/components/README.md)。
验证于：2026-09-17，静态首扫；无密钥文件读取或后端访问。
