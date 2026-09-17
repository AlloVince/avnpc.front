# components：共享 UI
## 何时读
修改导航、正文展示、目录、评论或异常页面时。
## 职责与入口
| 文件 | 主要接口与行为 |
|---|---|
| `BlogHeader.js` | title/router；withRouter、侧栏菜单、搜索表单、Head、NProgress 全局路由回调；读取 static/vendor-manifest 加载样式 |
| `ActiveLink.js` | children/router/href；pathname 判断 active，点击包装 div 调 router.push |
| `BlogPost.js` | post；正文、标签、来源/版权、相邻文章、目录、评论、捐赠及返回顶部 |
| `Exception.js` | type/title/desc/img/actions/linkElement；支持 401/403/404/500，未知类型回退 404 |
不负责顶层 API 查询；依赖 React/Ant Design、routes、Markdown、Luxon，消费 pages 提供的数据。
## 文章契约与生命周期
- 必需消费字段包括 `post.text.content`、`post.tags`；另外使用 id/title/type/slug/createdAt/source/sourceUrl/contentStorage/commentStatus/prev/next。默认空对象不足以形成完整文章。
- render 调 Markdown 并通过 dangerouslySetInnerHTML 插入 HTML；`type=note` 展示来源，`article` 展示捐赠，remote 内容展示 GitHub 勘误链接。
- componentDidMount 动态注入 Gitalk 与 Mermaid 脚本、绑定 resize/scroll、定位 TOC，并为指定作者的 CodePen 链接绑定嵌入转换。
- 评论容器只在 commentStatus=open 时存在，但挂载阶段没有同条件门控初始化。未见卸载时清理事件/脚本；客户端切换行为需另行验证。
## 雷区与待确认
- BlogHeader 的样式 manifest 是构建产物，首次启动前须先生成。
- Gitalk/Mermaid 使用 CDN 脚本，不能用 package.json 声明版本推断浏览器版本；离线与 CDN 失败路径未验证。
- 代码含浏览器端 Gitalk 凭据类字段；不要复制原值到文档/日志，是否仍有效及处置需负责人另行确认。
- 搜索摘要与正文的可信度不由 UI 校验；需与上游确认内容来源与清理责任。
## 相关
- 代码：`components/`、`styles/blog.css`、`styles/exception.less`。
- 文档：[Markdown](../markdown/README.md)、[pages](../pages/README.md)、[构建](../../operations/deploy.md)。
验证于：2026-09-17，静态首扫。
