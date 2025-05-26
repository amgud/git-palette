import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Edit Commit Message command implementation
 * Allows editing the message of the most recent commit
 */
export async function gitEditCommitMessage() {
  try {
    // Get the current commit message
    const commitLog = await executeGitCommand('log -1 --pretty=%B');
    const currentMessage = commitLog.trim();

    // Prompt user with the current message for editing
    const newMessage = await vscode.window.showInputBox({
      prompt: 'Edit commit message',
      value: currentMessage,
      placeHolder: 'Enter new commit message',
    });

    if (!newMessage || newMessage === currentMessage) {
      vscode.window.showInformationMessage(
        'No changes made to commit message.'
      );
      return; // User cancelled or didn't change message
    }

    // Execute git commit --amend with the new message
    await executeGitCommand(`commit --amend -m "${newMessage}"`);
    vscode.window.showInformationMessage(
      'Successfully updated the commit message.'
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Git Edit Commit Message Error: ${error}`);
  }
}
