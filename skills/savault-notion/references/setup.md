# Runtime and account setup

Run paths relative to this installed skill directory. The helpers require Node.js 18+; the downloaded runtime itself bundles Electron and does not need Node. Supported hosts: Windows x64, macOS 13+ arm64/x64. Initial platform login needs the user's desktop, so a Linux/cloud-only session is not supported.

## Install

```sh
node scripts/install.cjs
node scripts/savault.cjs doctor
```

The installer downloads the matching version from the public [Savault release](https://github.com/lin113311221/savault-skills/releases/tag/cli-v0.1.0), checks the SHA256 in `runtime.json`, and extracts into `%LOCALAPPDATA%/SavaultCLI/0.1.0` on Windows or `~/Applications/SavaultCLI/0.1.0` on Mac. It refuses to replace an existing destination. No PATH, system proxy, browser configuration or GUI data is changed. Download requires access to GitHub release assets; an interrupted or failed install is not a ready runtime.

For an existing manually downloaded package, set `SAVAULT_CLI_DIR` to the directory containing `savault.cmd` (Windows) or `savault` (Mac). `install.cjs --archive FILE --dir DIRECTORY` installs a previously downloaded pinned archive into a chosen directory; use the returned directory as `SAVAULT_CLI_DIR` afterward.

Mac runtime uses ad-hoc signing and is not Apple-notarized. If Gatekeeper blocks the download, let the user review and allow this app through System Settings → Privacy & Security. Do not disable Gatekeeper or remove quarantine automatically. A first Keychain prompt also belongs to the user.

## Configure Notion securely

The integration must have access to the intended Notion page/database. Use the user's existing integration and destination when provided; do not create a new integration or database solely because configuration is missing.

The CLI does not provide a Notion OAuth/login browser. It needs an integration token plus the intended page/database ID. The token must be entered on the user's machine; the target ID is not a secret and may be supplied to the helper as an argument.

Prefer launching the bundled prompt in a visible local terminal:

```powershell
node scripts/configure-notion.cjs --parent-id REPLACE_WITH_TARGET_ID --parent-type database
```

The helper hides token input and passes it to the runtime over stdin. An agent may open this terminal for the user, but must not type, capture, print, or request the token in chat. If the target ID is not known, ask for the intended Notion page/database link or ID before launching the prompt.

The runtime also accepts a partial configuration JSON on stdin. PowerShell example for a user who prefers to run the command manually:

```powershell
$secret = Read-Host 'Notion token' -AsSecureString
$token = [System.Net.NetworkCredential]::new('', $secret).Password
@{ notion = @{ token = $token; parentId = 'REPLACE_WITH_TARGET_ID'; parentType = 'database' } } | ConvertTo-Json -Compress | node scripts/savault.cjs config set --stdin
Remove-Variable token,secret
```

On macOS the same Node helper prompts without echo and pipes JSON directly to the local CLI. The user runs it interactively, replacing the target ID:

```sh
node scripts/configure-notion.cjs --parent-id REPLACE_WITH_TARGET_ID --parent-type database
```

`parentType` accepts `database`, `data_source`, or `page`. Credentials are encrypted by the runtime's OS storage. `status` returns only `hasKey` flags. Run `notion check` after the prompt exits successfully; use `notion setup` when preparing/creating the destination is within the request. A configured Savault Notion desktop app is not evidence that this CLI profile is configured.

## Profiles and login

Every command accepts `--profile NAME`, default `default`. Keep the same profile across config, login and sync. CLI profiles use `%APPDATA%/SavaultCLI/profiles/NAME` or `~/Library/Application Support/SavaultCLI/profiles/NAME`. They do not share the GUI's SavaultNotion data.

```sh
node scripts/savault.cjs auth login --platform xiaohongshu
node scripts/savault.cjs auth status --platform xiaohongshu
node scripts/savault.cjs collections list --platform xiaohongshu
```

Wait for the user to complete QR login and any platform checks. Automatic confirmation hides the login window; `auth confirm --platform xiaohongshu` retries identity validation. Replace the platform with `bilibili` for Bilibili. Never export cookies from another browser/profile to avoid login.

If the command reports that the login window opened but the user sees nothing, inspect `daemon status` before retrying. A stale `busy: true` state with no active sync job may require stopping and restarting only that CLI profile. Do not claim that a window was visible from the JSON response alone.

## Service configuration

`config set --stdin` accepts `notion`, `licenseKey`, and `asr`/`vision`/`ai` objects. Content enhancement requires the existing product authorization. For each enhancement, `source` is `gift` (Savault service balance) or `own` (user's provider), and fields include `enabled`, `provider`, `baseUrl`, `model`, `apiKey`. Use `status` for available presets and `schema` for commands. Keep credentials local and pass values through stdin. Activation and service-card redemption accept a plain string on stdin, not a JSON string.

Free usage limits, licensed capabilities and paid provider costs are separate from installation of this free Skill. Do not redeem cards or invoke paid enhancement just to test connectivity.
