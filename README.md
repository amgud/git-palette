# 🎨 Git Palette for VS Code

Quick access to common Git commands directly from VS Code with a convenient keyboard shortcut.

![Git Palette Demo](images/demo.gif)

## ✨ Features

- 🚀 Access Git commands with a single keyboard shortcut
- 🔍 **Smart Fuzzy Search** to quickly find commands
- 💻 User-friendly command interface
- 📦 Available commands:
  - `Add` - Stage changes
  - `Commit` - Record changes
  - `Commit Amend` - Update previous commit
  - `Clone` - Clone repositories
  - `Pull` - Get remote changes
  - `Push` - Send local changes

## 🚀 Usage

### ⌨️ Keyboard Shortcut (Recommended)

1. Press `Cmd+Shift+G` (Mac) or `Ctrl+Shift+G` (Windows/Linux)
2. Type to search commands with fuzzy matching:
   - Type `amend` to find "Commit Amend"
   - Type `push` or `upload` to find "Push"

### 🔍 Command Palette

Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) and type "Git Palette"

## 📋 Requirements

- Git installed and in your PATH

## ⚙️ Configuration

- `git-palette.autoAddFiles`: Automatically add all files when committing (default: true)
- `git-palette.alwaysAddAllChanges`: Add all changes when using Git Add (true) or prompt for files (false)

## 📝 Release Notes

### 1.0.0

Initial release of Git Palette extension. ✨

## 🤝 Contributing

Contributions are welcome! Feel free to submit a PR or open an issue.
