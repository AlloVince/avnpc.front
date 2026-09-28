# 静态运行与排障

Cloudflare Pages 提供静态 HTML、CSS、JavaScript 和文章资源；线上没有本仓 Node 服务。Node.js 只用于开发与构建。

| 现象 | 检查 |
|---|---|
| 构建找不到文章 | 核对 `CONTENT_ROOT` 是否指向内容仓 `source/` 目录；workflow 应检出 `avnpc.content` |
| 构建因 front matter 失败 | 按 `web/scripts/validate-content.js` 的字段/slug 校验修复内容源，再由内容仓维护 |
| 文章未出现在列表 | 核对 `published`、`listed` 和标签字段；`listed: false` 文章仍有直达页，但不进入索引 |
| 搜索或 RSS 内容不完整 | 核对 `web/out/search-index.json`、`web/out/rss` 和生成页面 |
| 评论无法授权 | 核对 GitHub OAuth Client ID、Worker URL、Worker Secret 和允许的 Origin；不要把 Secret 放进前端配置 |
| 生产页面未更新 | 核对 GitHub Actions 构建和 Cloudflare Pages 上传是否成功，以及 workflow 使用的内容仓 commit |
| 页面样式或资源缺失 | 核对 `web/out/` 生成文件、Next 导出产物与 Pages 发布目录 |

开发与生成命令见 [命令](../development/commands.md)，变量边界见 [配置](config.md)，发布状态见 [发布](deploy.md)。
