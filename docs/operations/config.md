# 配置与公开边界
## 何时读
修改环境变量、运行模式、后端地址或配置注入时。
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
