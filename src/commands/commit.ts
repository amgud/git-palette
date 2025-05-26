import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Commit command implementation
 * Automatically adds all files before committing if the setting is enabled
 */
export async function gitCommit() {
  log.info('Git commit command started');

  // Prompt for the commit message
  const message = await vscode.window.showInputBox({
    prompt: 'Commit message',
    placeHolder: 'Enter commit message',
  });

  if (!message) {
    log.info('Commit cancelled: No message provided');
    return; // User cancelled or entered empty message
  }

  try {
    // Check if auto-add is enabled
    const config = vscode.workspace.getConfiguration('git-palette');
    const autoAddFiles = config.get<boolean>('autoAddFiles', true);
    log.info(`Auto-add files is ${autoAddFiles ? 'enabled' : 'disabled'}`);

    // Automatically add all files if the setting is enabled
    if (autoAddFiles) {
      log.info('Adding all files to staging area');
      await executeGitCommand('add .');
      // Combined message will be shown after commit
    }

    // Then commit
    log.info(`Committing with message: ${message}`);
    await executeGitCommand(`commit -m "${message}"`);

    // Show a single combined message
    const resultMessage = autoAddFiles
      ? 'Added all files and committed'
      : 'Committed';

    vscode.window.showInformationMessage(`${resultMessage}: ${message}`);
    log.info(`Commit successful: ${resultMessage}`);
  } catch (error) {
    const errorMsg = `Git Commit Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
