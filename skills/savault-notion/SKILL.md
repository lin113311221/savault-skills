---
name: savault-notion
description: Sync the user's Xiaohongshu or Bilibili collections into Notion with Savault CLI. Use for importing saved posts/videos, listing collection folders, preparing a Notion target, and starting, stopping or checking Savault sync jobs. 支持小红书/B站收藏同步到 Notion、收藏夹查询和同步任务管理。
license: MIT
metadata:
  author: Dreambridge Creation
  version: "0.1.0"
---

# Savault Notion

Use the separately installed Savault CLI to import the user's own saved content into Notion. The runtime supports Windows x64 and macOS 13+ (Apple Silicon / Intel), requires a local graphical desktop for initial platform login, and keeps its configuration separate from the Savault Notion GUI. A cloud-only agent cannot use the user's local login session through this skill.

## Locate the runtime

The bundled helpers require Node.js 18+. Resolve this skill's installed directory as `SKILL_DIR`; all helper paths below are relative to it, not the user's project.

```sh
node "$SKILL_DIR/scripts/savault.cjs" --version
node "$SKILL_DIR/scripts/savault.cjs" doctor
node "$SKILL_DIR/scripts/savault.cjs" status
```

In PowerShell use `node "$SKILL_DIR/scripts/savault.cjs" ...` after assigning `$SKILL_DIR` to the actual skill directory. If the user already has a CLI package, set `SAVAULT_CLI_DIR` to its extracted directory (the directory containing `savault.cmd` or `savault`). Do not point it at the GUI application. If missing, read [setup.md](references/setup.md) and install the pinned runtime using `scripts/install.cjs` within the user's installation request. The helper verifies the release SHA256 before extracting and never changes global PATH.

## Connect accounts

Use `status` and `auth status --platform PLATFORM` before asking for credentials. A saved `confirmed` flag records an earlier login confirmation; collection and sync requests revalidate the session.

- If Notion is unconfigured, follow [setup.md](references/setup.md). The user enters the token locally through a secure prompt or existing secret store; send configuration through stdin. Do not ask for tokens, cookies or service cards in chat or put their values in command arguments.
- Run `notion check` to validate an existing target. `notion setup` can create or modify the configured database; use it when requested as part of preparing the destination.
- Run `auth login --platform xiaohongshu` or `--platform bilibili`. The user completes QR login or platform checks in the opened window. Check `auth status`; use `auth confirm` if completion needs another check. Do not claim login until confirmation succeeds.

## Select and sync

1. Run `collections list --platform PLATFORM`. Use collection IDs from that result. If the requested folder is ambiguous, ask the user to choose among the actual names.
2. Start the user's requested selection:

   ```sh
   node "$SKILL_DIR/scripts/savault.cjs" sync start --platform xiaohongshu --collection COLLECTION_ID --limit 1 --wait --progress
   ```

   The CLI defaults to one item. Repeat `--collection` for multiple folders. Use `--all` only for an explicit all-collections request. `--limit 0` removes the item limit; do not silently turn a sample import into a full import. Use `--update-existing` when the user asks to refresh existing content; it can replace synced page bodies.
3. Preserve the returned job ID. For longer jobs, omit `--wait` then use `jobs get --job ID` or `jobs wait --job ID`. Do not launch a duplicate job just because a wait timed out.
4. On a stop request run `sync stop --job ID`. Cancellation is cooperative; inspect the final job state after an in-flight request finishes.

## Read results correctly

Stdout is one JSON result; `--progress` streams progress to stderr. Check both exit code and `ok`. Job states include `queued`, `running`, `stopping`, `completed`, `partial`, `failed`, `cancelled`, and `interrupted`. A submitted job is not completed work. After a daemon crash, unfinished jobs become `interrupted` and are not automatically restarted.

Report created/updated/skipped/failed counts and relevant errors. A `partial` job is not full success. If a Notion read connector is available within the requested scope, read back the created/updated page; otherwise distinguish the CLI's reported result from an independently verified Notion page. Runtime checks or synthetic tests do not prove real account sync.

Use `jobs get`, `logs --job ID --tail 30`, and `doctor` for bounded diagnostics. `daemon stop` refuses a running operation. Exit codes: 0 success, 1 operation/job failure, 2 invalid input, 130 cancelled wait. Consult `schema` for the exact CLI command set.

## Optional licensed services

Basic collection sync and optional ASR, image understanding and AI summarization follow Savault's existing product limits. Configure `asr`, `vision`, or `ai` only when requested. `license activate --stdin`, `license redeem --stdin`, and `balance` manage the user's license/service balance; redemption and paid enhancement are real service operations, not diagnostic probes. The skill is free; runtime/service terms and external provider costs are separate.

Product and support: <https://product.aiprice.store/savault/>. Runtime downloads: <https://github.com/lin113311221/savault-skills/releases/tag/cli-v0.1.0>.
