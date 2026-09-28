# 命令与副作用

所有命令从仓库根目录执行，依赖清单和锁文件位于 `web/`。

| 命令 | 行为 |
|---|---|
| `pnpm --dir web install --frozen-lockfile` | 按锁文件安装；遵循 `web/pnpm-workspace.yaml` 的构建脚本许可 |
| `pnpm --dir web lint` | ESLint 检查现代前端 |
| `pnpm --dir web test` | 运行 Vitest 单元测试 |
| `CONTENT_ROOT=/Users/allovince/Developer/avnpc.content/source FRONTEND_URL=https://avnpc.com pnpm --dir web build` | 校验内容并输出静态页面到 `web/out/` |
| `pnpm --dir web dev` | 在本机 18348 端口启动开发服务器 |
| `pnpm --dir web start` | 使用已有构建产物启动本机静态预览服务器 |

构建会读取全部文章并写入 `web/out/` 与忽略的 `web/public/search-index.json`。`install` 可能改变本机依赖目录；不要去掉 `--frozen-lockfile` 让部署解析漂移。Pages 上传只由 [deploy-blog workflow](../../.github/workflows/deploy-blog.yml) 执行。

## 相关

- [环境](setup.md)
- [现代前端](modern-web.md)
- [测试](testing.md)
- [发布](../operations/deploy.md)
