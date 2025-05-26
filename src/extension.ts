// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { showCommandPalette } from './commandPalette';
import {
  gitAdd,
  gitCommit,
  gitCommitAmend,
  gitClone,
  gitPull,
  gitPush,
} from './commands';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext): void {
  // Register command palette
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.showCustomCommands',
      showCommandPalette
    )
  );

  // Git Add command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-commands-toolkit.gitAdd', gitAdd)
  );

  // Git Commit command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-commands-toolkit.gitCommit', gitCommit)
  );

  // Git Clone command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-commands-toolkit.gitClone', gitClone)
  );

  // Git Pull command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-commands-toolkit.gitPull', gitPull)
  );

  // Git Push command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-commands-toolkit.gitPush', gitPush)
  );

  // Git Commit Amend command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.gitCommitAmend',
      gitCommitAmend
    )
  );
}
