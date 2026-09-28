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
- Worker 位于 `worker/gitalk-oauth/`，只接受 `https://avnpc.com` 的浏览器 Origin，代理路径为 `/oauth/access_token`。在 Worker 上设置 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`；前者可公开但用于核对请求，后者使用 Cloudflare Secret。`ALLOWED_ORIGIN` 已在 Wrangler 配置中设为 `https://avnpc.com`。Cloudflare 要求通过 Worker Secret 保存敏感值，见 [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)。
- 从前端仓根目录部署 Worker：`pnpm dlx wrangler@4.136.3 login`，然后 `pnpm dlx wrangler@4.136.3 deploy --config worker/gitalk-oauth/wrangler.toml`。部署后分别运行 `pnpm dlx wrangler@4.136.3 secret put GITHUB_CLIENT_ID --config worker/gitalk-oauth/wrangler.toml` 和 `pnpm dlx wrangler@4.136.3 secret put GITHUB_CLIENT_SECRET --config worker/gitalk-oauth/wrangler.toml`；命令会交互式提示输入，不要用会回显值的 shell 命令。`secret put` 会发布 Worker 新版本。
- 在前端 GitHub repo Settings → Secrets and variables → Actions → Variables 设置 `GITALK_CLIENT_ID` 为同一个 Client ID，`GITALK_OAUTH_PROXY` 为 `https://<Worker 域名>/oauth/access_token`。两个值都不是 Client Secret。Worker 的 OPTIONS 预检已返回 204，伪造授权码的请求返回 GitHub `bad_verification_code`，确认代理已到达 GitHub 交换端点。
- 评论存于 `AlloVince/avnpc.content`，管理员为 `AlloVince`，Issue 使用 `Gitalk` 与文章 ID 标签。历史文章沿用 `POST_<旧文章 ID>`，新文章使用稳定 slug ID（超过 49 字符时使用稳定摘要）。Gitalk 设置为手动创建 Issue，避免自动产生重复讨论；管理员在确认某篇没有对应旧 Issue 后，可在该文评论区创建 Issue。Issue 映射维护在内容仓 `source/_data/legacy-gitalk.json`。Gitalk 的 Issue 标签和 ID 限制见[官方配置说明](https://github.com/gitalk/gitalk#options)。
- 2026-09-28 已比对 `avnpc.content` 的公开 Issue。Gitalk 查询开放与已关闭 Issue，并按创建时间倒序选择匹配项；明确关闭评论的文章以外，已为所有发布文章映射或初始化评论 Issue。旧文章映射在内容仓 `source/_data/legacy-gitalk.json`，新增讨论区需同时使用 `Gitalk` 标签和文章 ID 标签。
- 个别旧文章存在重复 Issue 时，Gitalk 只加载最新创建的一条，不会把多条 Issue 的评论合并。例如 `POST_138` 使用 #90（3 条评论），关闭的重复 #69 另有 1 条旧评论。
## 构建配置

- `CONTENT_ROOT` 指向内容仓 `source/`；它只在构建期使用，不写入浏览器 bundle。
- `FRONTEND_URL` 只供构建期 RSS 链接使用，默认值为 `https://avnpc.com`。
- Pages 静态产物不读取 `BACKEND_URL`，也不嵌入服务器或数据库凭据。
- `.env*` 被忽略；不要把 OAuth Secret 或 Cloudflare API token 放入前端环境文件。发布凭据只由 GitHub Actions 与 Cloudflare Worker Secret 管理。

## 相关

- 代码：`next.config.js`、`.env.example`、`worker/gitalk-oauth/`。
- 文档：[环境](../development/setup.md)、[发布](deploy.md)、[现代前端](../development/modern-web.md)。
