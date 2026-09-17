# 开发环境
## 何时读
首次运行、选择 Node/包管理器或排查历史兼容问题时。

新应用 `web/` 使用 Node 24 + pnpm 11.22.0，配置和本机 18348 启动步骤见 [现代前端](modern-web.md)。下文为根目录旧应用静态基线，不适用于 web，也不代表旧应用已完成迁移。
## 已确认的仓库约束
- package engines 为 Node >=10；历史 Travis 指定 Node 10，Docker 为 node:10-alpine。只是声明/配置证据，不证明现代 Node 兼容，也不建议把已停止维护的 Node 10 用于新的生产部署。
- 包脚本、Makefile、Docker、CI 均使用 npm；未发现受控锁文件，yarn.lock 被忽略，未声明 packageManager 或运行时版本管理文件。
- 默认偏好包建议 fnm/pnpm/最新 LTS，但本仓接入不迁移工具链；另开任务确认支持版本与锁定方案。
- `engine` 链接到依赖中的 CLI；未安装 node_modules 时链接不可读是预期文件状态，不应新建同名源码替代。
## 运行顺序（静态推导，未执行）
1. 先确认兼容 Node/npm 与隔离测试环境；安装依赖使用仓库既有 npm 流程。安装可能产生锁文件及执行生命周期脚本，需审阅 diff。
2. 检查 [配置](../operations/config.md)，尤其 BACKEND_URL/FRONTEND_URL；开发默认也指向线上站点，不盲目发起请求。
3. 先 `npm run build:dll` 生成 static/vendor-manifest.json 和样式；再 `npm run dev`。样式开发可另用 `npm run dev-css` 常驻构建。
4. 生产构建/启动见 [commands](commands.md)；本次未验证成功与否。
## 历史说明迁移
原 README 要求修改 Next 依赖内 `next/dist/client/next-dev.js` 的动态导入为 require 才能开发。保留原 README，不执行补丁；这是历史陈述，当前精确依赖解析版本和是否仍必需待确认，不能视作已验证安装步骤。
## 待确认
实际可用 Node/npm 组合、依赖解析与旧构建插件兼容性；后端开发入口；EvaEngine 是否需要 DB/Redis；dotenv 与配置加载顺序；README 补丁适用性。
## 相关
- 代码：`README.md`、`package.json`、`.gitignore`、`Dockerfile`、`.travis.yml`、`engine`、`webpack.dll.js`。
- 文档：[命令](commands.md)、[测试](testing.md)、[配置](../operations/config.md)。
验证于：2026-09-17，静态首扫；未安装依赖。
