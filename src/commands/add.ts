import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Add command implementation
 */
export async function gitAdd() {
  // Check if we should always add all changes or prompt for files
  const config = vscode.workspace.getConfiguration('git-commands-toolkit');
  const alwaysAddAllChanges = config.get<boolean>('alwaysAddAllChanges', true);

  let files = '.';

  // If not set to always add all changes, prompt the user for files to add
  if (!alwaysAddAllChanges) {
    const userInput = await vscode.window.showInputBox({
      prompt: 'Files to add (e.g., "." for all files)',
      placeHolder: '.',
      value: '.',
    });

    if (userInput === undefined) {
      return; // User cancelled
    }

    files = userInput;
  }

  try {
    await executeGitCommand(`add ${files}`);
    vscode.window.showInformationMessage(`Added files: ${files}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Add Error: ${error}`);
  }
}
