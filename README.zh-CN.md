[English](README.md) | [简体中文](README.zh-CN.md)

# Savault Notion Skill

让 AI 调用本机 Savault，把小红书和 B站收藏整理到 Notion。支持选择收藏夹、配置目标、启动同步、停止和查询任务。

这是一个通过本机 Savault CLI，将你的小红书和 B站收藏同步到 Notion 的 Agent Skill。

## 让 AI 用上你收藏的好方法

同步后，再授权 Codex、WorkBuddy 等工具读取对应 Notion 页面或本地笔记，便可让 AI 在具体任务里参考你选过的方法，并注明来源。

**本 Skill 负责 Notion 同步和任务管理，不提供 Savault 问答 MCP 或 `ask`/`search` API。** 读取 Notion 内容需另接已授权的读取工具，例如官方 Notion MCP；Savault 内置“问收藏”目前属于 Obsidian 插件功能。

见[AI 知识使用与连接指南](docs/ai-knowledge-workflow.md)及[Agent 文档索引](llms.txt)。收藏不会自动训练模型，也不会自动变成已安装的 Skill。下面固定的 CLI 0.1.0 运行包不能直接等同于最新桌面客户端能力。

## 安装 Skill

```sh
npx skills add lin113311221/savault-skills --skill savault-notion
```

也可以下载本仓库，将 `skills/savault-notion` 文件夹放入你使用的 Agent 的技能目录。Skill 使用标准 `SKILL.md` 格式；宿主需要能执行本地命令。

## 安装运行包

安装 Skill 后，告诉你的 Agent：

> 使用 savault-notion 技能，检查并安装 Savault CLI，引导我配置 Notion，然后列出我的小红书收藏夹。先不要同步。

技能自带安装助手，会下载与你电脑匹配的 CLI 并校验 SHA256。你也可以手动下载：

| 系统 | CLI 0.1.0 |
|---|---|
| Windows x64 | [下载 ZIP](https://github.com/lin113311221/savault-skills/releases/download/cli-v0.1.0/Savault-CLI-0.1.0-20260909-win-x64.zip) |
| macOS 13+ Apple 芯片 | [下载 ZIP](https://github.com/lin113311221/savault-skills/releases/download/cli-v0.1.0/Savault-CLI-0.1.0-20260909-mac-arm64.zip) |
| macOS 13+ Intel | [下载 ZIP](https://github.com/lin113311221/savault-skills/releases/download/cli-v0.1.0/Savault-CLI-0.1.0-20260909-mac-x64.zip) |

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

Global 产品页是独立入口。本机 Savault CLI 的安装方式、支持平台、软件许可及可选服务条款以上述说明为准。
