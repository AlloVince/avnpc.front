# Project Memory

限高：全文 ≤150 行。超限先删 Assumed/过时/已升格进 docs 的条目。
只记：代码与 docs 都表达不好、且影响未来开发的信息。
不记：架构复述、API 说明、流水账、临时调试、git 能看到的变更列表。
置信：Confirmed（代码/测试/人确认）| Assumed（待验证，用完升格或删）。
更新：2026-09-28

## 当前焦点
- Confirmed：Gitalk 默认用于所有发布文章；只有 `comments: false` 或 `comment_status: closed` 才关闭。历史 Issue 映射维护在内容仓 `source/_data/legacy-gitalk.json`，新增/迁移旧文章前需按 slug 对照 GitHub Issue 的 `POST_<id>` 标签。

## 雷区与禁忌
- Confirmed：现代化不是重新设计授权。用户要求保留旧版整体布局、配色和风格，不添加口号、格言或无关装饰；仅允许简洁的细节调整。
- Confirmed：旧 OAuth Secret 曾出现在前端源码历史中，已轮换；不要恢复历史明文或把新 Secret 写入仓库。根目录旧应用只移除硬编码 Secret，保持其他逻辑不变。

## 调试手册

## 待验证

## 协作偏好（项目级）
