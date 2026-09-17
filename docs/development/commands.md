# 命令与副作用
## 何时读
运行、构建、验证或发布前。

新应用请使用 [现代前端 web/ 命令](modern-web.md)：Node 24、pnpm 11，所有命令指定 web 工作目录。以下表格仅描述根目录旧应用，来自脚本定义，不代表旧应用已执行成功。
## package.json
| 命令 | 当前行为 / 限制 |
|---|---|
| `npm install` | 既有安装流程；无锁文件，结果可能漂移，不使用 npm ci 冒充可复现安装 |
| `npm run build:dll` | production Webpack DLL 样式构建，输出到 static |
| `npm run dev-css` | Webpack development watch，常驻进程 |
| `npm run dev` | babel-node server.js；脚本不设置 NODE_ENV，启动前先生成样式 manifest |
| `npm run build` | production DLL 构建后 next build；首个 NODE_ENV 赋值只作用于其紧随命令，不笼统当作整条 shell 链环境设置 |
| `npm start` | NODE_ENV=production node server.js；需要既有构建产物 |
| `npm run lint` | eslint pages/* --ext .js；只覆盖 pages，不覆盖 components/services/server 等 |
| `npm test` | 转 npm run coverage，但 coverage 脚本未定义；不可当作有效测试入口 |
| `npm run pre-build` | 引用 atool-build 与 antd-custom/webpack.config.js；前者未声明，后者未见，历史入口待确认 |
| `npm run semantic-release` | 发布工具，release.npmPublish=false；非本地验证命令 |
| `npm run travis-deploy-once` | CI 发布包装器，需配合参数；不作为本地运行入口 |
## Makefile：不能当无副作用快捷键
- `make build` → install → git pull、npm install、npm run build；会拉取代码和改变依赖，不能替代只构建。
- `make pre-build` 全局安装 nodemon/Babel/tramp-cli；与 npm run pre-build 不是同一命令。
- `make migrate` 调 tramp migrate；本仓未见迁移目录，不执行或据此推断有数据库迁移流程。
- `make travis-build-log` 会 printenv 并生成 static/ci.txt；可能输出敏感环境信息，不能在包含凭据的环境盲目运行或将其完整输出带入文档。
## 相关
- 代码：`package.json`、`Makefile`、`webpack.dll.js`、`.travis.yml`。
- 文档：[环境](setup.md)、[测试](testing.md)、[部署](../operations/deploy.md)。
验证于：2026-09-17，静态首扫。
