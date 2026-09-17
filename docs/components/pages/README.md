# pages：页面与数据编排
## 何时读
修改页面查询、分页、跳转、搜索或 feed 时。
## 职责与边界
Next Pages 类组件在 `getInitialProps` 取数据，组装布局；依赖 routes、HttpClient、共享组件、Luxon，RSS 另用 xmlbuilder。不实现存储或后端查询。
## 路由与 API（源码消费者契约）
| 页面/路由 | 请求 | 参数/行为 |
|---|---|---|
| index `/`；thinking `/thinking` | `/v1/blog/posts` | offset、limit 默认 10、tag；thinking 重导出 index |
| reading `/reading` | `/v1/evernote/notes` | offset、limit 默认 10、tag |
| search `/search` | `/v1/search` | offset、q；未把查询中的 limit 传给 API |
| page `/pages/:slug` | `/v1/blog/posts/${slug}` | 传完整 query，正文交 BlogPost |
| note `/reading/:slug` | `/v1/evernote/notes/${slug}` | 传完整 query，正文交 BlogPost |
| about `/about` | `/v1/blog/posts/about` | 继承 page，仅覆盖取数 |
| p `/p/:id` | `/v1/blog/posts/${id}` | 有 post 和 res 时 302 到 FRONTEND_URL/pages/slug；否则客户端 replace 到 FRONTEND_URL |
| rss `/rss` | `/v1/blog/posts` | withText=1、limit=10，直接 res.write/end |
## 数据形状与关键行为
- 列表解构 `{results, pagination: {limit, offset, total}}`；文章列表用 id/slug/title/createdAt，搜索用 url/title/summary。时间戳按秒乘 1000。
- 详情期待包含正文、标签等字段的 post，见 [UI](../components/README.md)；以上只是消费形状，不是验证过的后端 schema。
- index 翻页跳 thinking；index/reading 翻页没有传 tag；search 翻页带 q。Pagination 使用 defaultCurrent。
- reading 的命名路由与内层 anchor 的 `/slug/...` 字面路径不同；真实导航/无 JS 行为待验证，不在接入阶段修复。
- page/note 取数只返回 post，缺失 post 的报错分支却读取 `query.slug`；缺失数据行为待验证。
- rss 名称虽为 RSS，输出根为 Atom feed；依赖非空 results 和服务端 res，未显式设置 Content-Type；feed URL 硬编码，不随 FRONTEND_URL 变化。正文使用原始文本 CDATA。
- `_document.js` 注入通用配置到浏览器，production 下加统计脚本；`_error.js` 从 res/xhr 获取状态交 Exception，未知状态按其默认 UI 展示。
## 待确认
API 实际 schema、错误/空数据、分页保留筛选、浏览器直达与客户端导航的一致性。不得根据静态阅读宣称端到端成功。
## 相关
- 代码：`pages/`、`routes.js`、`services/http_client.js`。
- 文档：[HTTP](../services/README.md)、[测试](../../development/testing.md)、[配置](../../operations/config.md)。
验证于：2026-09-17，静态首扫。
