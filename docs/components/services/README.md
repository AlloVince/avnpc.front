# services：HTTP 访问
## 何时读
修改后端地址、请求参数或错误处理时。
## 职责与接口
`HttpClient.requestRestAPI(input, init)` 是 pages 使用的静态异步入口，返回解析后的 JSON，异常原样抛出。依赖 url-parse、通用配置与全局 fetch；不做业务 schema 校验、缓存、重试或持久化。
## 当前实现
- input.url 存在时直接使用；否则从 BACKEND_URL 构建 URL，并按允许的 URL 属性覆盖；对象属性值仅过滤 null/undefined。
- fetch 调用的第二参数为默认 GET 与 input 合并，第三参数传 init。标准 fetch 只有两个主要参数，不能假定第三参数能生效；需变更时另行验证契约。
- 先 `response.json()`，再判断 HTTP 状态；非 JSON 响应会先触发解析错误。
- `status > 300 && status < 500` 抛 json.message；>=500 抛固定错误；300 本身未在该异常分支内。
- 没有显式超时、取消、身份认证或 cookie 转发机制。服务端/浏览器 fetch 环境不同，CORS 与凭据契约待确认。
## 相关
- 代码：`services/http_client.js`、`routes.js`、`universal.config.js`、`pages/`。
- 文档：[pages](../pages/README.md)、[配置](../../operations/config.md)。
验证于：2026-09-17，静态首扫；未调用后端。
