import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Commit Amend command implementation
 * Allows amending the previous commit with a new message
 * Automatically adds all files before amending if the setting is enabled
 */
export async function gitCommitAmend() {
  try {
    // First, get the last commit message to pre-fill
    const lastMessage = await getLastCommitMessage();

    // Prompt for the new commit message
    const message = await vscode.window.showInputBox({
      prompt: 'Amend commit message',
      placeHolder: 'Enter new commit message',
      value: lastMessage, // Pre-fill with the last commit message
    });

    if (message === undefined) {
      return; // User cancelled
    }

    // Check if auto-add is enabled
    const config = vscode.workspace.getConfiguration('git-commands-toolkit');
    const autoAddFiles = config.get<boolean>('autoAddFiles', true);

    // Automatically add all files if the setting is enabled
    if (autoAddFiles) {
      await executeGitCommand('add .');
      vscode.window.showInformationMessage('Added all files to staging area');
    }

    // Execute the amend command
    await executeGitCommand(`commit --amend -m "${message}"`);
    vscode.window.showInformationMessage(`Commit amended: ${message}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Commit Amend Error: ${error}`);
  }
}

/**
 * Helper function to get the last commit message
 * @returns The message of the last commit
 */
async function getLastCommitMessage(): Promise<string> {
  try {
    const output = await executeGitCommand('log -1 --pretty=%B');
    return output.trim();
  } catch {
    // If there's an error (e.g., no commits yet), return an empty string
    return '';
  }
}
