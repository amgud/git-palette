import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Commit command implementation
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
    await executeGitCommand(`commit -m "${message}"`);
    vscode.window.showInformationMessage(`Committed: ${message}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Commit Error: ${error}`);
  }
}
