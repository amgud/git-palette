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
  gitPushForce,
  gitUndoCommit,
  gitEditCommitMessage,
} from './commands';

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext): void {
  // Register command palette
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-palette.showCustomCommands',
      showCommandPalette
    )
  );

  // Git Add command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitAdd', gitAdd)
  );

  // Git Commit command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitCommit', gitCommit)
  );

  // Git Clone command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitClone', gitClone)
  );

  // Git Pull command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitPull', gitPull)
  );

  // Git Push command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitPush', gitPush)
  );

  // Git Commit Amend command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-palette.gitCommitAmend',
      gitCommitAmend
    )
  );

  // Git Push Force command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitPushForce', gitPushForce)
  );

  // Git Undo Commit command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-palette.gitUndoCommit', gitUndoCommit)
  );

  // Git Edit Commit Message command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-palette.gitEditCommitMessage',
      gitEditCommitMessage
    )
  );
}
