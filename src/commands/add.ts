import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Add command implementation
 */
export async function gitAdd() {
  const files = await vscode.window.showInputBox({
    prompt: 'Files to add (e.g., "." for all files)',
    placeHolder: '.',
    value: '.',
  });

  if (files === undefined) {
    return; // User cancelled
  }
  try {
    await executeGitCommand(`add ${files}`);
    vscode.window.showInformationMessage(`Added files: ${files}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Add Error: ${error}`);
  }
}
