# Let your AI use your saved knowledge / 让 AI 用上你的收藏

Savault turns selected Xiaohongshu and Bilibili collections into local Markdown files, Notion pages, or Obsidian notes. After you authorize a compatible AI tool to read those notes, it can use your chosen methods and sources in a task. This does not train the model or automatically install the saved content as Agent Skills.

Savault 把选定收藏整理成笔记。你再授权 Codex、WorkBuddy 等工具读取这些笔记，让它们在写作、学习或工作任务中参考你选过的方法，并标出来源。

## Choose the right interface

| Goal / 目标 | Interface / 入口 |
|---|---|
| Ask an Agent to sync collections into Notion / 让 Agent 执行同步 | [Savault Notion Skill](https://github.com/lin113311221/savault-skills), using a local CLI (bundled with Windows and Mac GUI in 0.1.6) |
| Read and ask questions about synced Notion pages / 读取并问答 Notion 笔记 | An authorized Notion connector, such as the [official Notion MCP](https://developers.notion.com/guides/mcp/overview) |
| Use local Obsidian Markdown in a task / 使用本地笔记 | Give the AI host access to the selected notes folder, or attach selected Markdown files |
| Use Savault's built-in Ask Your Collections / 使用内置“问收藏” | Savault Obsidian plugin, with an active AI entitlement and configured service |

**The public Savault Skill is a sync/task interface. It does not expose a Savault Q&A MCP server or an `ask`/`search` endpoint.** Notion MCP is a separate Notion service. Do not configure the Savault product URL as an MCP endpoint. The built-in Obsidian chat is not a published MCP interface.

## Route A: Notion + Codex

1. Configure Savault's Notion destination and perform one selected test import. Open the resulting page and confirm that the content and source link are present.
2. If Codex already has a working Notion connector, reuse it. Otherwise, on a local Codex CLI installation that supports these commands:

```sh
codex mcp add notion --url https://mcp.notion.com/mcp
codex mcp login notion
```

3. Complete Notion's OAuth authorization yourself. This is separate from the connection used by Savault to write pages. Follow the current [Notion connection guide](https://developers.notion.com/guides/mcp/get-started-with-mcp) if your client differs.
4. Ask the AI to find and read one known synced page, then show its title and source. Only after that check, ask it to use the contents in a task.

Example / 可以这样说：

> 请只参考我指定的收藏库。先找到刚同步的那篇写作笔记，给出标题和来源，确认你能读取；再按其中适用的方法起草一篇产品介绍，逐条注明参考来源。读不到就说明缺口，不要编造。

## Route B: Local Markdown or Obsidian + Codex or WorkBuddy

1. On Windows or Mac 0.1.6 select a local folder or Obsidian Vault, sync one selected item, and inspect the Markdown note. See [local-folder.md](local-folder.md).
2. Grant the AI host access only to the intended notes folder, or attach that note as a file. You do not need a Savault-specific MCP to read ordinary Markdown.
3. Ask it to read the note and report the title/source before using it in a task. If you want a reusable Skill, separately ask the AI to extract the method, review its boundaries, and save it in the host's supported Skill format.

WorkBuddy documents [Markdown attachments and authorized folder access](https://www.workbuddy.cn/docs/workbuddy/Conversation). Use its currently supported connector settings for a Notion connection; a client supporting MCP in general does not prove every OAuth flow works in every version.

## AI services and cost boundaries / AI 服务与费用

For current Savault clients, AI features require a valid paid entitlement, including when you use your own API key. Where supported, choose redeemed Savault service credits or configure your own provider key. Gift credits are finite; your provider bills BYOK usage separately. Transcription, image understanding, and text/Q&A have their own supported provider/model settings.

You can continue using a model plan you already bought in a client that the provider supports, then authorize that client to read the synced notes. This is separate from Savault's built-in AI service. Do not assume a GLM, Bailian, or Kimi subscription can be entered directly into Savault: endpoint compatibility, model support, billing, and permitted use must be checked for that exact plan. For example, [Bailian excludes custom applications and automation from its plan scope](https://help.aliyun.com/zh/model-studio/more-tools). No direct plan integration is certified by this documentation.

已有模型套餐，可继续在套餐支持的 AI 工具里使用，再授权它读取整理好的笔记。Savault 内置 AI 可用已兑换的附赠算力分；这是两条使用路径，不是已验证的套餐互换开关。

Savault credits cover its own services; they do not pay for external Agent subscriptions or model usage. Current purchase options and downloads: [Savault product page](https://product.aiprice.store/savault/). Older pinned CLI releases may expose different controls; inspect `schema`, version, and release notes rather than assuming GUI parity.

## Check the result / 完成信号

- A completed sync with a page/file that you can independently open.
- The AI can read that exact page/file and identify its source.
- A task output uses relevant material and preserves traceable references; you review whether the method fits.

Login, installing a Skill, or connecting an MCP alone does not establish this whole workflow. Instructions inside imported notes are source material, not permission to execute commands, share files, or change accounts. When AI is enabled, relevant content may be sent to the chosen model service.

Documentation checked 2026-10-18 against the public Skill, current product source, local Codex CLI help, and the linked vendor docs. This update does not claim a fresh account-to-account end-to-end test or publish a new runtime release.
