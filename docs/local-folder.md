# Local Markdown, Notion, or Obsidian / 三种保存位置

[Current desktop downloads / 当前客户端下载](https://product.aiprice.store/savault/#downloads) · [SHA-256](https://product.aiprice.store/savault/downloads/SHA256SUMS.txt) · [First local sync / 本地文件夹入门](https://product.aiprice.store/savault/#local-guide)

The current desktop packages include the app and CLI. On Windows x64, extract the ZIP and run the bundled app or `savault.cmd`. On macOS 13+, choose the Apple silicon or Intel preview, then run the app or `./savault`. The Agent Skill installer pins its [0.1.6 runtime](https://github.com/lin113311221/savault-skills/releases/tag/desktop-v0.1.6). Keep the app and launcher together. No separate Node installation is needed for manual use; the Agent Skill helper needs Node.js 18+.

在“写到哪里”选择本地文件夹、Notion 或 Obsidian。本地模式保存 Markdown，不需要笔记软件。先同步一条，检查正文、来源及封面，再扩大范围。按来源 ID 去重，更新已有笔记需要明确开启更新选项。

Windows PowerShell:

```powershell
.\savault.cmd local setup --folder "D:\MyKnowledge"
.\savault.cmd local check
.\savault.cmd auth login --platform xiaohongshu
.\savault.cmd collections list --platform xiaohongshu
.\savault.cmd sync start --platform xiaohongshu --collection YOUR_ID --limit 1 --wait
```

macOS Terminal:

```sh
./savault local setup --folder "$HOME/Documents/MyKnowledge"
./savault local check
./savault auth login --platform xiaohongshu
./savault collections list --platform xiaohongshu
./savault sync start --platform xiaohongshu --collection YOUR_ID --limit 1 --wait
```

Mac packages use ad-hoc signing and are not Apple-notarized. If blocked at first launch, review and allow the downloaded app in System Settings → Privacy & Security. Handle any Keychain prompt yourself. Keep the entire extracted folder together if you move it into Applications.

GUI and CLI keep separate encrypted configuration and login profiles. Do not run both against one target simultaneously. Grant a compatible AI host access to the selected folder to use those notes in a task. Notion reading requires an authorized connector. This does not train a model or install content as a Skill.

The current desktop app and Obsidian plugin include built-in Q&A; video-frame enrichment is currently limited to the Notion route. Paid AI and service quotas follow the product terms. Existing model plans are used within their supported AI clients, separately from Savault service credits.
