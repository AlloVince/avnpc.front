# AGENTS.md — avnpc.front
## 身份与角色
- 名称：avnpc.front；已有项目，采用 Standard 协作协议。
- 项目定位、技术栈与维护状态：见 [知识地图](docs/index.md) 与 [架构概览](docs/architecture/overview.md)，不在入口复述。
- 作为长期工程师先理解再改；最小改动，维护代码与文档一致。
## 每个 session 必读
1. 本文件。
2. [.ai/defaults/preferences.md](.ai/defaults/preferences.md)。
3. [.ai/defaults/ai-coding.md](.ai/defaults/ai-coding.md)。
4. [.ai/memory.md](.ai/memory.md)（≤150 行；超限先裁剪）。
5. [.ai/workflow/start.md](.ai/workflow/start.md)，再由 [docs/index.md](docs/index.md) 选最小文档集。
## 按需加载
| 任务 | 入口 |
|---|---|
| 结构、责任与数据流 | [overview](docs/architecture/overview.md)、[boundaries](docs/architecture/boundaries.md) |
| 改某模块 | [模块地图](docs/index.md)，只读对应模块与代码 |
| 环境、运行、测试 | [setup](docs/development/setup.md)、[commands](docs/development/commands.md)、[testing](docs/development/testing.md) |
| 部署、配置、排障 | [deploy](docs/operations/deploy.md)、[config](docs/operations/config.md)、[runtime](docs/operations/runtime.md) |
| 文档维护、外部变更同步 | [spec](docs/spec.md)、[sync](.ai/workflow/sync.md) |
| 架构级变更、重要决策 | [design-review](.ai/workflow/design-review.md)；有决策再建 ADR 并更新地图 |
| 收工 | [end](.ai/workflow/end.md) |
## 边界与加载规则
- 负责：已授权范围内的实现、验证与知识维护；具体系统边界见 docs。
- 不负责：未授权的后端、线上配置、部署、依赖升级或架构迁移。
- 先相关 docs，再相关代码/测试；禁止无目的整仓扫描。上下文膨胀时先总结。
- defaults 是通用偏好，不是现有项目迁移指令；运行工具链和发布约束先核对 setup/deploy，不自动替换。
- 项目事实只进 docs；memory 只放非显性约束与当前焦点。中文、紧凑，未知标待确认。
- 事实冲突：代码行为 > 测试 > 已确认决策/文档 > 历史陈述 > 新生成；memory 不覆盖事实。
## 变更分级
| 规模 | 做前 | 做后 |
|---|---|---|
| 微：文案、typo | 直接改 | 极简确认 |
| 小：bug、局部调整 | 读相关 docs/代码 | end；检查文档影响 |
| 中：feature、跨文件知识维护 | 简述影响、做法与风险 | 完整 end；按需 sync |
| 大：架构、边界、主技术栈 | design-review；不清则确认 | end + sync；必要 ADR |
## 禁止与完成检查
不混入无关重构、升级或修复；不静默改变公共接口；不编造事实或删测试装通过；不记录密钥原文；未经要求不 commit/push。
收工按 end 核对：需求满足、最小 diff、符合既有模式、验证及限制已说明、docs/memory 已同步、无临时文件。
