[English](README.md) | [简体中文](README.zh-CN.md)

# Savault Collection Sync Skill

## 下载与校验

[官网下载页](https://product.aiprice.store/savault/#downloads)提供 Windows x64 桌面版（含 CLI，0.1.10）、Mac 预览版（0.1.10，macOS 13+，Apple 芯片或 Intel）和桌面 Obsidian 插件（0.5.75）。抖音收藏同步和分享链接导入仍为预览功能，首次请先同步一条，打开笔记核对来源。

将下方命令中的 `YOUR-DOWNLOAD.zip` 换为实际文件名。解压前按 ZIP 完整文件名查[官网 SHA-256 清单](https://product.aiprice.store/savault/downloads/SHA256SUMS.txt)，用 Windows 的 `Get-FileHash ./YOUR-DOWNLOAD.zip -Algorithm SHA256` 或 macOS 的 `shasum -a 256 ./YOUR-DOWNLOAD.zip` 比对摘要。首次保存 Markdown 可按[本地文件夹入门](https://product.aiprice.store/savault/#local-guide)操作。

Skill 安装器从 [GitHub 0.1.6 Release](https://github.com/lin113311221/savault-skills/releases/tag/desktop-v0.1.6) 下载[固定的 0.1.6 运行包](https://github.com/lin113311221/savault-skills/blob/main/skills/savault-notion/references/runtime.json)，并核对该版本的摘要。

让 AI 调用本机 Savault；Windows 和 Mac 可把小红书和 B站收藏整理到本地文件夹、Notion 或 Obsidian。支持选择收藏夹、配置目标、启动同步、停止和查询任务。

安装名 savault-notion 保持兼容，功能范围已包含 Windows/Mac 本地文件夹。

## 让 AI 用上你收藏的好方法

同步后，再授权 Codex、WorkBuddy 等工具读取对应 Notion 页面或本地笔记，便可让 AI 在具体任务里参考你选过的方法，并注明来源。

**本 Skill 负责收藏同步和任务管理，不提供 Savault 问答 MCP 或 `ask`/`search` API。** 读取 Notion 内容需另接已授权的读取工具，例如官方 Notion MCP；官网下载的桌面客户端和 Obsidian 插件均提供“问收藏”，需有效 AI 权益。

见[AI 知识使用与连接指南](docs/ai-knowledge-workflow.md)及[Agent 文档索引](llms.txt)。收藏不会自动训练模型，也不会自动变成已安装的 Skill。Windows 和 Mac 固定运行包均为统一版 0.1.6，请按安装版本的 schema 使用命令。

## 安装 Skill

```sh
npx skills add lin113311221/savault-skills --skill savault-notion
```

也可以下载本仓库，将 `skills/savault-notion` 文件夹放入你使用的 Agent 的技能目录。Skill 使用标准 `SKILL.md` 格式；宿主需要能执行本地命令。

## 安装 Skill 固定的 0.1.6 运行包

安装 Skill 后，告诉你的 Agent：

> 使用 savault-notion 技能，检查并安装 Savault CLI，引导我选择本地文件夹或 Notion，再列出我的小红书收藏夹。先不要同步。

技能自带安装助手，会下载与你电脑匹配的 CLI 并校验 SHA256。也可在下表手动下载同一版本。

| 系统 | 运行包 |
|---|---|
| Windows x64 | [下载 ZIP](https://github.com/lin113311221/savault-skills/releases/download/desktop-v0.1.6/Savault-0.1.6-win32-x64.zip) |
| macOS 13+ Apple 芯片 | [下载 ZIP](https://github.com/lin113311221/savault-skills/releases/download/desktop-v0.1.6/Savault-0.1.6-mac-arm64.zip) |
| macOS 13+ Intel | [下载 ZIP](https://github.com/lin113311221/savault-skills/releases/download/desktop-v0.1.6/Savault-0.1.6-mac-x64.zip) |

完整解压后将 `SAVAULT_CLI_DIR` 指向含 `savault.cmd`（Windows）或 `savault`（Mac）的目录。技能助手需要 Node.js 18+；手动运行 CLI 不需要另外安装 Node。

首次平台登录需要你本人扫码。CLI 的配置和登录会话与 Savault Notion 桌面版分开保存。Mac 包采用 ad-hoc 签名，未做 Apple 公证；首次如被拦截，请在系统设置中核对并放行本次下载的应用。

## 试用

> 把我的小红书“科技”收藏夹同步到已配置的 Notion，先处理一条，完成后告诉我任务结果。

> 查看上次 Savault 同步是否完成，有哪些失败；不要重复启动任务。

> 停止当前 Savault 同步，然后查询最终状态。

技能安装不会替你创建 Notion integration、接管浏览器登录或启用付费增强。密钥在本机安全输入，不能发到聊天中。只有本地 Windows/Mac 宿主可使用本套运行包；纯云端或 Linux Agent 暂不支持。

## 文档

- [Skill 入口](skills/savault-notion/SKILL.md)
- [运行包与账号配置](skills/savault-notion/references/setup.md)
- [固定版本运行包哈希](skills/savault-notion/references/runtime.json)
- [Savault 产品与支持](https://product.aiprice.store/savault/)

本仓库中的 Skill 和辅助脚本采用 MIT 许可。Savault 运行包和可选外部服务保留各自的条款；本仓库的 MIT 许可不会改变这些条款。部分运行功能需要 Savault 授权，或单独计费的服务/供应商账号。这是独立的 Savault 集成，并非 Notion、小红书或 B站的官方产品。

## 相关入口

- [Dream Bridge Lab](https://github.com/dreambridgelab)
- [Savault Global](https://yourdreamlab.net/apps/savault/)

Savault Global 是独立的英文 CLI，可将本人 YouTube 播放列表保存为 Markdown。本页 Skill 适用于上文列出的收藏平台。

## 协作者与 Agent 接手

阅读 [agentconversation.md](agentconversation.md)，了解本仓职责、版本边界与接手步骤。英文 README 与本文同步维护。

使用独立分支提交 PR，说明目的和实际验证。默认分支要求 PR 与至少 1 人审核，禁止强推和删除，保留管理员例外。普通访客可以 Fork 和提议修改；写权限另行授予。

公开示例、Issue 和 Agent 接手记录不包含凭据、私人笔记或内部客户资料。
