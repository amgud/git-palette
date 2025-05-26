import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Add command implementation
 */
export async function gitAdd() {
  log.info('Git add command started');

  // Check if we should always add all changes or prompt for files
  const config = vscode.workspace.getConfiguration('git-palette');
  const alwaysAddAllChanges = config.get<boolean>('alwaysAddAllChanges', true);
  log.info(
    `Always add all changes is ${alwaysAddAllChanges ? 'enabled' : 'disabled'}`
  );

  let files = '.';

  // If not set to always add all changes, prompt the user for files to add
  if (!alwaysAddAllChanges) {
    log.info('Prompting user for files to add');
    const userInput = await vscode.window.showInputBox({
      prompt: 'Files to add (e.g., "." for all files)',
      placeHolder: '.',
      value: '.',
    });

    if (userInput === undefined) {
      log.info('Git add cancelled by user');
      return; // User cancelled
    }

    files = userInput;
    log.info(`User specified files to add: ${files}`);
  }

  try {
    log.info(`Executing git add for files: ${files}`);
    await executeGitCommand(`add ${files}`);
    vscode.window.showInformationMessage(`Added files: ${files}`);
    log.info(`Successfully added files: ${files}`);
  } catch (error) {
    const errorMsg = `Git Add Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
