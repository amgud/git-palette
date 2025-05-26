import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Commit Amend command implementation
 * Allows amending the previous commit with a new message
 * Automatically adds all files before amending if the setting is enabled
 */
export async function gitCommitAmend() {
  log.info('Git commit amend command started');

  try {
    // First, get the last commit message to pre-fill
    log.info('Retrieving last commit message');
    const lastMessage = await getLastCommitMessage();
    log.debug(`Last commit message: "${lastMessage}"`);

    // Prompt for the new commit message
    const message = await vscode.window.showInputBox({
      prompt: 'Amend commit message',
      placeHolder: 'Enter new commit message',
      value: lastMessage, // Pre-fill with the last commit message
    });

    if (message === undefined) {
      log.info('Commit amend cancelled: No message provided');
      return; // User cancelled
    }

    // Check if auto-add is enabled
    const config = vscode.workspace.getConfiguration('git-palette');
    const autoAddFiles = config.get<boolean>('autoAddFiles', true);
    log.info(`Auto-add files is ${autoAddFiles ? 'enabled' : 'disabled'}`);

    // Automatically add all files if the setting is enabled
    if (autoAddFiles) {
      log.info('Adding all files to staging area');
      await executeGitCommand('add .');
      // Will show combined message later
    }

    // Execute the amend command
    log.info(`Amending commit with message: "${message}"`);
    await executeGitCommand(`commit --amend -m "${message}"`);

    // Show a single combined message
    const resultMessage = autoAddFiles
      ? 'Added all files and amended commit'
      : 'Amended commit';

    vscode.window.showInformationMessage(`${resultMessage}: ${message}`);
    log.info(`Commit amend successful: ${resultMessage}`);
  } catch (error) {
    const errorMsg = `Git Commit Amend Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}

/**
 * Helper function to get the last commit message
 * @returns The message of the last commit
 */
async function getLastCommitMessage(): Promise<string> {
  try {
    log.debug('Retrieving last commit message from git log');
    const output = await executeGitCommand('log -1 --pretty=%B');
    return output.trim();
  } catch (error) {
    // If there's an error (e.g., no commits yet), return an empty string
    log.debug(`Failed to get last commit message: ${error}`);
    return '';
  }
}
