# 开发环境

本仓根目录维护静态前端。环境版本与构建入口见 [现代前端](modern-web.md)。

## 要求

- Node.js 24
- pnpm 11.22.0
- sibling 内容仓 `../avnpc.content/source/`，或通过 `CONTENT_ROOT` 指定兼容内容目录

工作流和本机都从 `pnpm-lock.yaml` 安装依赖，不在仓库根目录安装 npm 包。

## 本地启动

```sh
pnpm install --frozen-lockfile
CONTENT_ROOT=/Users/allovince/Developer/avnpc.content/source pnpm dev
```

开发服务器监听 `127.0.0.1:18348`。外部服务配置与 OAuth Secret 不需要放进前端环境文件；本地评论显示需要相应的公开 Client ID 和 OAuth Worker URL。配置边界见 [配置](../operations/config.md)。

## 相关

- 构建和验证命令：[命令](commands.md)
- 静态内容输入和路由行为：[现代前端](modern-web.md)
- Pages 发布：[发布](../operations/deploy.md)
