# Git Commands Toolkit for VS Code

This extension provides quick access to common Git commands directly from VS Code with a convenient keyboard shortcut.

## Features

- Access Git commands directly from VS Code with a single keyboard shortcut
- Execute Git commands with a user-friendly interface
- **Smart Fuzzy Search** to quickly find commands using related terms
- Available commands:
  - Git Add - Add file contents to the index
  - Git Commit - Record changes to the repository
  - Git Commit Amend - Amend the previous commit
  - Git Commit Force - Force commit changes
  - Git Clone - Clone a repository into a new directory
  - Git Pull - Fetch from and integrate with another repository
  - Git Push - Push local changes to a remote repository

## Usage

You can access Git commands in two ways:

### Using Command Palette

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) to open the Command Palette
2. Type "Git:" and select from available commands

### Using Keyboard Shortcut

1. Press `Cmd+Shift+G` (Mac) or `Ctrl+Shift+G` (Windows/Linux)
2. Select a Git command from the quick pick menu
3. **Enhanced Fuzzy Search**: Type any related term to find commands quickly
   - Example: Type "amend" to find "Git Commit Amend"
   - Example: Type "push" or "upload" to find "Git Push"
   - Example: Type "rec" to find commands with "record" in their description

## Requirements

- Git must be installed and accessible from your PATH

## Extension Settings

- No specific settings required

## Known Issues

- None at this time

## Release Notes

### 1.0.0

Initial release of the Git Commands Toolkit extension.
