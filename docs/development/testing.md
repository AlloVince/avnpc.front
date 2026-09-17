# 测试与验收
## 何时读
准备验证改动、判断现有质量门槛或补测试前。

新应用 `web/` 已通过 lint、12 个 Vitest 单测和生产构建；真实后端页面及浏览器检查、未执行项目与 Reading/Search 缺口见 [现代前端](modern-web.md)。Playwright 只有脚本/依赖，尚无可报告通过的 E2E 套件。以下为根目录旧应用首扫记录。
## 仓库现状
- 未发现受控测试文件、测试 runner 配置、coverage 脚本或端到端测试目录。
- npm test 引用不存在的 coverage；不能报告测试通过。未为此次文档接入修复脚本或添加依赖。
- lint 为 ESLint 6 + babel-eslint + Airbnb 17，项目覆盖见 .eslintrc；仅检查 pages。pre-commit 配置也只运行 lint。
- Travis 的 test 阶段实际执行安装、lint、semantic-release 包装；没有 npm test，不能把 CI 绿色等同业务测试覆盖。
## 后续验证建议（未执行）
仅在明确授权、隔离后端和兼容环境确认后：
1. lint；DLL/Next 构建；记录真实版本及结果，不用文档断言替代运行。
2. 直达与客户端导航验证 `/`、thinking、reading、search、详情、about；包括分页、tag/q 保留、空列表和缺失文章。
3. `/p/:id` 服务端 302 与客户端分支分别检查；`/rss` 按服务端 feed 检查 XML、空数据、响应类型和链接。
4. 正文使用无害 fixture 覆盖标题/TOC、代码高亮、公式、Mermaid、来源信息；外部评论/CDN 不可用时检查展示。
5. HTTP mock 覆盖 JSON 成功、业务错误、5xx、非 JSON、网络失败；本仓尚无此测试设施，不声称已有。
## 本次接入验收边界
仅校验 Markdown 路径、协议副本一致性、memory 限高、模板占位符、模块映射、Git 变更范围。不安装依赖、不发 API 请求、不启动服务器；既有运行/测试缺口已登记。
## 相关
- 代码：`package.json`、`.eslintrc`、`.editorconfig`、`.travis.yml`、`pages/`、`services/http_client.js`。
- 文档：[命令](commands.md)、[模块地图](../index.md)。
验证于：2026-09-17，静态首扫。
