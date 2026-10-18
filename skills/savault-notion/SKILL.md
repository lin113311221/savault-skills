---
name: savault-notion
description: Sync selected Xiaohongshu or Bilibili collections with Savault. Windows and Mac 0.1.6 support local Markdown folders, Notion and Obsidian with one GUI/CLI package. Use for installation, choosing a destination, collection listing and sync task management. 支持小红书/B站收藏同步到本地文件夹、Notion 或 Obsidian，并供 AI 读取笔记。
license: MIT
metadata:
  author: Dreambridge Creation
  version: "0.1.6"
---

# Savault collection sync

Use the locally installed Savault runtime to import the user's own saved content. Windows and Mac 0.1.6 save to a local Markdown folder, Notion, or an Obsidian Vault; its GUI and CLI share one package. The runtime supports Windows x64 and macOS 13+ (Apple Silicon / Intel), requires a local graphical desktop for initial platform login, and keeps its configuration separate from the Savault Notion GUI. A cloud-only agent cannot use the user's local login session through this skill.

## Choose the correct Savault surface

This skill controls **Savault CLI profiles**, not the Savault Notion desktop application's profile. Their profiles remain separate even when GUI and CLI share one package:

- CLI configuration and sessions live under `SavaultCLI`; desktop configuration and sessions live under `SavaultNotion`.
- A working desktop Notion connection does not make `node scripts/savault.cjs notion check` pass, and a confirmed CLI platform login does not log the desktop app in.
- Do not conclude that the user's Notion account is unconfigured merely because the CLI profile has no token. State which surface was checked.
- Stay on the CLI path for requests made through this skill. If the user explicitly wants to reuse the desktop app, use only a documented desktop automation entrypoint that exists on that machine; otherwise explain the profile boundary instead of trying to copy encrypted settings or cookies.

- Do not fall back to the desktop GUI merely because the CLI profile lacks credentials. The CLI supports Notion configuration through `config set --stdin`, product authorization through `license activate --stdin`, and service-card redemption through `license redeem --stdin`. Use those commands or the bundled hidden-input helper.

## Locate the runtime

The bundled helpers require Node.js 18+. Resolve this skill's installed directory as `SKILL_DIR`; all helper paths below are relative to it, not the user's project.

```sh
node "$SKILL_DIR/scripts/savault.cjs" --version
node "$SKILL_DIR/scripts/savault.cjs" doctor
node "$SKILL_DIR/scripts/savault.cjs" status
```

In PowerShell use `node "$SKILL_DIR/scripts/savault.cjs" ...` after assigning `$SKILL_DIR` to the actual skill directory. If the user already has a CLI package, set `SAVAULT_CLI_DIR` to its extracted directory (the directory containing `savault.cmd` or `savault`). Unified 0.1.6 points to the directory containing Savault.exe and savault.cmd (Windows), or Savault.app and savault (Mac); older Notion-only GUI packages do not provide this CLI. If missing, read [setup.md](references/setup.md) and install the pinned runtime using `scripts/install.cjs` within the user's installation request. The helper verifies the release SHA256 before extracting and never changes global PATH.

## Choose a destination

Reuse a destination the user already selected. On Windows and Mac 0.1.6, local Markdown is the default for a new profile and requires no Notion or Obsidian account:

```sh
node "$SKILL_DIR/scripts/savault.cjs" local setup --folder "ABSOLUTE_FOLDER_PATH"
node "$SKILL_DIR/scripts/savault.cjs" local check
```

Use the actual OS path, not this placeholder. The setup creates the chosen folder and selects the local target. Notes are placed under savault/platform/collection with relative cover-image links. Do not write through symlinks/Junctions. To use Notion, configure target=notion and run notion check; to use Obsidian, configure target=obsidian and obsidian.vaultPath then run obsidian check. Keep credentials on stdin. Inspect schema for the installed runtime; older Mac 0.1.0 packages lack local setup/check, so upgrade before using these commands.

After syncing, grant the AI host access to the selected local folder, or use a separate authorized Notion connector. This Skill does not provide Q&A MCP, train a model, or automatically turn content into installed Skills.

## Connect accounts

Use `status` and `auth status --platform PLATFORM` before asking for credentials. A saved `confirmed` flag records an earlier login confirmation; it does not prove the current platform page is usable. Run `collections list` or the requested sync to revalidate the live session.

- If Notion is unconfigured, follow [setup.md](references/setup.md). The CLI has no Notion OAuth/login browser: configuration uses a local hidden-input prompt or an existing secret store. Offer to launch that prompt in a **visible local terminal** after obtaining the non-secret target page/database ID. The user enters the token locally; never ask for tokens, cookies or service cards in chat or put their values in command arguments.
- Run `notion check` to validate an existing target. `notion setup` can create or modify the configured database; use it when requested as part of preparing the destination.
- Run `auth login --platform xiaohongshu` or `--platform bilibili` from a local graphical session. The user completes QR login or platform checks in the opened window. `loginWindowOpened: true` proves only that the daemon accepted the request; it does not prove that the user can see the window. Ask the user to interact only after a visible window is actually present. Check `auth status`; use `auth confirm` if completion needs another check. Do not claim login until confirmation succeeds.

### When an interactive window does not appear

Use `daemon status`, `auth status`, `logs --tail 30`, and the current process state before retrying. Do not start repeated login requests blindly.

- If the daemon is healthy and idle, retry once with `auth login --platform PLATFORM --no-wait` from a visible desktop process, then verify the result.
- If `daemon status` reports `busy: true` with no sync job, a stale login request may be holding the daemon. Try `daemon stop`; if it returns `BUSY`, report that exact state. Restart only the identified Savault CLI profile after confirming it has no active sync job and the restart is within the user's request.
- On Windows, a daemon started with a hidden console may still need to be restarted as a visible desktop process before its Electron login window can be presented. Do not equate exit code 0 or an empty stdout with a visible window.
- After a restart, run `auth login --platform PLATFORM --no-wait`, then read back `auth status` after the user confirms.

## Select and sync

1. Run `collections list --platform PLATFORM`. Use collection IDs from that result. If the requested folder is ambiguous, ask the user to choose among the actual names.
2. Start the user's requested selection:

   ```sh
   node "$SKILL_DIR/scripts/savault.cjs" sync start --platform xiaohongshu --collection COLLECTION_ID --limit 1 --wait --progress
   ```

   The CLI defaults to one item. Repeat `--collection` for multiple folders. Use `--all` only for an explicit all-collections request. `--limit 0` removes the item limit; use it only when the user clearly asks for the whole selected folder, and report the folder's listed count before starting. Distinguish a folder described as “new” from a request for only newly added items. Do not silently turn a sample import into a full import. Use `--update-existing` when the user asks to refresh existing content; it can replace synced page bodies.
3. Preserve the returned job ID. For longer jobs, omit `--wait` then use `jobs get --job ID` or `jobs wait --job ID`. Do not launch a duplicate job just because a wait timed out.
4. On a stop request run `sync stop --job ID`. Cancellation is cooperative; inspect the final job state after an in-flight request finishes.

## Read results correctly

Stdout is one JSON result; `--progress` streams progress to stderr. Check both exit code and `ok`. Job states include `queued`, `running`, `stopping`, `completed`, `partial`, `failed`, `cancelled`, and `interrupted`. A submitted job is not completed work. After a daemon crash, unfinished jobs become `interrupted` and are not automatically restarted.

Report created/updated/skipped/failed counts and relevant errors. A `partial` job is not full success. If a Notion read connector is available within the requested scope, read back the created/updated page; otherwise distinguish the CLI's reported result from an independently verified Notion page. Runtime checks or synthetic tests do not prove real account sync.

Do not treat `status: completed` or `failed: 0` as proof that requested enhancements succeeded. Savault deliberately writes the base note when an optional enhancement fails, so a job can complete after logging ASR, vision, or summary failures. Inspect job progress/logs for enhancement errors and read back a representative Notion page when the user requires transcripts, image interpretation, or AI summaries. Stop before a full-folder run if the canary page lacks the requested sections.

For a full-folder acceptance, inspect every local Markdown file and resolve its image links, or query the Notion destination by collection and aggregate every returned page: require an AI summary plus either a transcript or image interpretation according to the available media. Use an explicit supported Notion API version if the CLI's OpenAPI-version discovery returns 403. Report the platform badge count separately from the live API result count; removed or private favorites may make them differ.

Use `jobs get`, `logs --job ID --tail 30`, and `doctor` for bounded diagnostics. `daemon stop` refuses a running operation. Exit codes: 0 success, 1 operation/job failure, 2 invalid input, 130 cancelled wait. Consult `schema` for the exact CLI command set.

## Optional licensed services

Basic collection sync and optional ASR, image understanding and AI summarization follow Savault's existing product limits. Configure `asr`, `vision`, or `ai` only when requested. `license activate --stdin`, `license redeem --stdin`, and `balance` manage the user's license/service balance; redemption and paid enhancement are real service operations, not diagnostic probes. A successful redemption or a large account balance proves only the user's account entitlement. It does not prove that the shared backend budget, provider balance, or server-side price-review window is available.

Interpret common enhancement errors precisely:

- `DEVICE_NOT_BOUND`: the current CLI profile/device is not bound to the redeemed service account.
- `PRICE_REVIEW_REQUIRED`: a server-side pricing kill switch expired; issuing or re-entering a card cannot fix it.
- `SERVICE_BUDGET_EXHAUSTED`: the shared backend spend cap cannot cover the reservation; it is separate from the card/account balance.

Do not ask the user to resend a full card number when `status` already reports `cloud.hasKey: true`. Use the redacted `balance` result, job progress, and the applicable service layer to locate the failure. Maintainers diagnosing the hosted service should read [backend-diagnostics.md](references/backend-diagnostics.md) before using provider or CloudBase administration tools.

The skill is free; runtime/service terms and external provider costs are separate.

Product and support: <https://product.aiprice.store/savault/>. Windows / Mac unified runtime: <https://github.com/lin113311221/savault-skills/releases/tag/desktop-v0.1.6>. Mac requires macOS 13+, with separate Apple silicon and Intel packages.
