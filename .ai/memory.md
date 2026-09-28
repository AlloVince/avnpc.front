# Project Memory

限高：全文 ≤150 行。超限先删 Assumed/过时/已升格进 docs 的条目。
只记：代码与 docs 都表达不好、且影响未来开发的信息。
不记：架构复述、API 说明、流水账、临时调试、git 能看到的变更列表。
置信：Confirmed（代码/测试/人确认）| Assumed（待验证，用完升格或删）。
更新：2026-09-28

## 当前焦点
- Confirmed：2026-09-28 已轮换 GitHub OAuth Secret、部署 Gitalk Worker 并设置 Actions Variables；侧栏、目录、Mermaid 和 Gitalk UI 的生产上线由本轮 Pages 部署完成。8 个无匹配旧 Issue 的处理见 `docs/operations/config.md`。

## 雷区与禁忌
- Confirmed：现代化不是重新设计授权。用户要求保留旧版整体布局、配色和风格，不添加口号、格言或无关装饰；仅允许简洁的细节调整。
- Confirmed：旧 OAuth Secret 曾出现在前端源码历史中，已轮换；不要恢复历史明文或把新 Secret 写入仓库。根目录旧应用只移除硬编码 Secret，保持其他逻辑不变。

## 调试手册

## 待验证

## 协作偏好（项目级）
