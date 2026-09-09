# Savault Notion Skill

让 AI 调用本机 Savault，把小红书和 B站收藏整理到 Notion。支持选择收藏夹、配置目标、启动同步、停止和查询任务。

An Agent Skill for syncing your Xiaohongshu and Bilibili collections into Notion through the local Savault CLI.

## Install the Skill

```sh
npx skills add lin113311221/savault-skills --skill savault-notion
```

也可以下载本仓库，将 `skills/savault-notion` 文件夹放入你使用的 Agent 的技能目录。Skill 使用标准 `SKILL.md` 格式；宿主需要能执行本地命令。

## Install the runtime

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

## Try it

> 把我的小红书“科技”收藏夹同步到已配置的 Notion，先处理一条，完成后告诉我任务结果。

> 查看上次 Savault 同步是否完成，有哪些失败；不要重复启动任务。

> 停止当前 Savault 同步，然后查询最终状态。

技能安装不会替你创建 Notion integration、接管浏览器登录或启用付费增强。密钥在本机安全输入，不能发到聊天中。只有本地 Windows/Mac 宿主可使用本套运行包；纯云端或 Linux Agent 暂不支持。

## Documentation

- [Skill entrypoint](skills/savault-notion/SKILL.md)
- [Runtime and account setup](skills/savault-notion/references/setup.md)
- [Pinned runtime hashes](skills/savault-notion/references/runtime.json)
- [Savault product and support](https://product.aiprice.store/savault/)

The Skill and helper scripts in this repository are MIT licensed. Savault runtime distributions and optional external services retain their respective terms; this repository's MIT license does not change those terms. Some runtime capabilities require a Savault license or a separately billed service/provider account. This is an independent Savault integration, not an official Notion, Xiaohongshu or Bilibili product.
