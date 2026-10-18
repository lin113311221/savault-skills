[English](README.md) | [简体中文](README.zh-CN.md)

# Savault Collection Sync Skill

## Windows and Mac unified 0.1.6

[Download package and checksums](https://github.com/lin113311221/savault-skills/releases/tag/desktop-v0.1.6) · [Local folder guide](docs/local-folder.md)

Each Windows or Mac package includes GUI and CLI, with local Markdown, Notion and Obsidian destinations. Local mode needs no note-taking app; grant your AI tool folder access after syncing. GUI and CLI profiles remain separate. Mac supports macOS 13+ on Apple silicon and Intel.


Let AI call the local Savault CLI to organize your Xiaohongshu and Bilibili collections in a local Markdown folder, Notion or Obsidian on Windows or Mac. The Skill supports selecting collections, configuring destinations, starting and stopping syncs, and checking tasks.

The installed Skill name remains savault-notion for compatibility.

## Use your saved knowledge with AI

Sync is the first step. After granting a compatible AI tool access to the resulting Notion pages or local notes, you can ask Codex, WorkBuddy, or another Agent to apply your saved methods with source references.

**This Skill manages collection sync jobs; it does not expose a Savault Q&A MCP or `ask`/`search` API.** Read synced Notion content through a separate authorized connector such as official Notion MCP. Savault's built-in Ask Your Collections is currently an Obsidian plugin feature.

Read the [AI knowledge workflow and connection guide](docs/ai-knowledge-workflow.md), or start from the compact [Agent documentation index](llms.txt). Notes do not automatically become installed Skills or train the model. Windows and Mac are pinned to unified 0.1.6. Check the installed schema before using destination-specific commands.

## Install the Skill

```sh
npx skills add lin113311221/savault-skills --skill savault-notion
```

You can also download this repository and place the `skills/savault-notion` folder in your Agent's skills directory. The Skill uses the standard `SKILL.md` format; the host must be able to execute local commands.

## Install the Runtime

After installing the Skill, tell your Agent:

> Use the savault-notion Skill to check and install the Savault CLI, help me choose a local folder or Notion, and then list my Xiaohongshu collections. Do not sync yet.

The Skill includes an installation helper that downloads the CLI matching your computer and verifies its SHA256. You can also download it manually:

| System | Runtime |
|---|---|
| Windows x64 | [Download ZIP](https://github.com/lin113311221/savault-skills/releases/download/desktop-v0.1.6/Savault-0.1.6-win32-x64.zip) |
| macOS 13+ Apple silicon | [Download ZIP](https://github.com/lin113311221/savault-skills/releases/download/desktop-v0.1.6/Savault-0.1.6-mac-arm64.zip) |
| macOS 13+ Intel | [Download ZIP](https://github.com/lin113311221/savault-skills/releases/download/desktop-v0.1.6/Savault-0.1.6-mac-x64.zip) |

Extract the entire archive, then point `SAVAULT_CLI_DIR` to the directory containing `savault.cmd` (Windows) or `savault` (Mac). The Skill helper requires Node.js 18+; running the CLI manually does not require a separate Node installation.

Your first platform login requires you to scan the QR code yourself. The CLI stores its configuration and login sessions separately from the Savault Notion desktop app. Mac packages use ad-hoc signing and are not notarized by Apple; if the first launch is blocked, check the downloaded app in System Settings and allow it to run.

## Try It

> Sync my Xiaohongshu “Technology” collection to the configured Notion destination. Process one item first, then tell me the task result when it finishes.

> Check whether my last Savault sync has finished and which items failed. Do not start the task again.

> Stop the current Savault sync, then check its final status.

Installing the Skill does not create a Notion integration for you, take over browser login, or enable paid enrichment. Enter keys securely on your own computer; do not send them in chat. These runtime packages support local Windows/Mac hosts only; cloud-only and Linux Agents are not currently supported.

## Documentation

- [Skill entrypoint](skills/savault-notion/SKILL.md)
- [Runtime and account setup](skills/savault-notion/references/setup.md)
- [Pinned runtime hashes](skills/savault-notion/references/runtime.json)
- [Savault product and support](https://product.aiprice.store/savault/)

The Skill and helper scripts in this repository are MIT licensed. Savault runtime distributions and optional external services retain their respective terms; this repository's MIT license does not change those terms. Some runtime capabilities require a Savault license or a separately billed service/provider account. This is an independent Savault integration, not an official Notion, Xiaohongshu or Bilibili product.

## Related Links

- [Dream Bridge Lab](https://github.com/dreambridgelab)
- [Savault Global](https://yourdreamlab.net/apps/savault/)

The Global product page is a separate entry point. The local Savault CLI installation, supported platforms, licensing, and optional service terms are those documented above.
