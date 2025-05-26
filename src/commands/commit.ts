import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Commit command implementation
 * Automatically adds all files before committing if the setting is enabled
 */
export async function gitCommit() {
  // Prompt for the commit message
  const message = await vscode.window.showInputBox({
    prompt: 'Commit message',
    placeHolder: 'Enter commit message',
  });

  if (!message) {
    return; // User cancelled or entered empty message
  }

  try {
    // Check if auto-add is enabled
    const config = vscode.workspace.getConfiguration('git-palette');
    const autoAddFiles = config.get<boolean>('autoAddFiles', true);

    // Automatically add all files if the setting is enabled
    if (autoAddFiles) {
      await executeGitCommand('add .');
      vscode.window.showInformationMessage('Added all files to staging area');
    }

    // Then commit
    await executeGitCommand(`commit -m "${message}"`);
    vscode.window.showInformationMessage(`Committed: ${message}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Commit Error: ${error}`);
  }
}
