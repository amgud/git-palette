import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Edit Commit Message command implementation
 * Allows editing the message of the most recent commit
 */
export async function gitEditCommitMessage() {
  log.info('Git edit commit message command started');

  try {
    // Get the current commit message
    log.info('Retrieving current commit message');
    const commitLog = await executeGitCommand('log -1 --pretty=%B');
    const currentMessage = commitLog.trim();
    log.debug(`Current commit message: "${currentMessage}"`);

    // Prompt user with the current message for editing
    const newMessage = await vscode.window.showInputBox({
      prompt: 'Edit commit message',
      value: currentMessage,
      placeHolder: 'Enter new commit message',
    });

    if (!newMessage) {
      log.info('User cancelled edit commit message operation');
      vscode.window.showInformationMessage(
        'No changes made to commit message.'
      );
      return; // User cancelled
    }

    if (newMessage === currentMessage) {
      log.info('User did not change the commit message');
      vscode.window.showInformationMessage(
        'No changes made to commit message.'
      );
      return; // No changes made
    }

    // Execute git commit --amend with the new message
    log.info(`Updating commit message to: "${newMessage}"`);
    await executeGitCommand(`commit --amend -m "${newMessage}"`);

    const successMessage = 'Successfully updated the commit message.';
    vscode.window.showInformationMessage(successMessage);
    log.info(successMessage);
  } catch (error) {
    const errorMsg = `Git Edit Commit Message Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
