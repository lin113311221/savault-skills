# Local Markdown, Notion, or Obsidian / 三种保存位置

[Windows 0.1.6 download and SHA256](https://github.com/lin113311221/savault-skills/releases/tag/desktop-v0.1.6)

The Windows ZIP contains Savault.exe and savault.cmd, sharing one runtime. Fully extract the folder. Select local folder, Notion, or Obsidian in the GUI. CLI commands:

```powershell
.\savault.cmd local setup --folder "D:\MyKnowledge"
.\savault.cmd local check
.\savault.cmd auth login --platform xiaohongshu
.\savault.cmd collections list --platform xiaohongshu
.\savault.cmd sync start --platform xiaohongshu --collection YOUR_ID --limit 1 --wait
```

Windows 统一包内同时提供 GUI 和 CLI。本地模式保存 Markdown，不需要笔记软件；也可选择 Notion 或 Obsidian。先同步一条，检查正文、来源及封面后再扩大范围。按来源 ID 去重，更新已有笔记需要明确开启更新选项。

GUI and CLI keep separate encrypted configuration and login profiles. Do not run both against one target simultaneously. Grant a compatible AI host access to the selected folder to use those notes in a task. Notion reading requires an authorized connector. This does not train a model or install content as a Skill.

Mac remains on its existing Notion/CLI preview packages. No new Mac unified build is included. Built-in Q&A is an Obsidian plugin feature; video-frame enrichment is currently limited to the Notion route. Paid AI and service quotas follow the product terms. Existing model plans are used within their supported AI clients, separately from Savault service credits.
