# 构建与发布

## 当前发布链路

目标产物是 Next.js 静态导出 `out/`，由 Cloudflare Pages 直接托管；生产域名为 `https://avnpc.com`。

1. 内容仓 `master` 分支 push `source/**` 时，`avnpc.content` workflow dispatch 前端 `deploy-blog.yml`，目标为 production。
2. 前端 workflow 检出内容仓，使用 Node 24、pnpm 11.22.0，执行 `pnpm install --frozen-lockfile` 和静态构建。
3. Wrangler 上传 `out/` 到 Cloudflare Pages。手动运行 workflow 默认上传 preview；选择 production 才上传 `master` 生产分支。
4. 首次关联域名时可在 production run 设置 `bind_domain`；已有关联时不需要重复设置。

## 配置

- Pages 项目 `avnpc-blog` 是 Direct Upload 项目。
- Actions variables：`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_PAGES_PROJECT`、`GITALK_CLIENT_ID`、`GITALK_OAUTH_PROXY`。
- Actions secret：`CLOUDFLARE_API_TOKEN`。
- 内容仓需要一个仅能 dispatch 前端 workflow 的 `FRONT_REPO_WORKFLOW_TOKEN`。
- Gitalk OAuth Client Secret 保存在 Worker Secret；配置步骤见 [配置](config.md)。

不要在构建日志或仓库记录凭据。Cloudflare Direct Upload 与 Git integration 是不同项目类型，当前项目使用 Direct Upload。

## 已验收状态

2026-09-28 Pages 项目 `avnpc-blog` 与 `avnpc.com` custom domain 状态为 active。内容 push 触发生产 workflow 成功；生产构建、Pages 上传以及首页、旧文章、迁移文章、RSS、robots、sitemap、search index 和隐藏文章 HTTP 检查通过。当前前端最新生产部署 run 为 `36425135398`，提交 `4358827`；首页、代表文章、RSS、robots、favicon 与新字体资源均返回 HTTP 200。`www.avnpc.com` 未配置，当前入口只承诺 apex 域名。

## 退役代码

原仓库根目录的 Next.js 9/EvaEngine SSR 应用、Docker 镜像和 Travis 发布配置不在此链路中，已按当前实际用途清理。仓库根目录是唯一前端应用。
