import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Undo Commit command implementation
 * Undoes the most recent commit if it hasn't been pushed yet
 */
export async function gitUndoCommit() {
  log.info('Git undo commit command started');
  log.warning('User is attempting to undo the last commit');

  try {
    // Confirm with user before undoing commit
    const confirmed = await vscode.window.showWarningMessage(
      'This will undo your most recent commit. The changes will be preserved in your working directory. Continue?',
      { modal: true },
      'Yes'
    );

    if (confirmed !== 'Yes') {
      log.info('User cancelled undo commit operation');
      return; // User cancelled
    }

    // Execute git reset HEAD~1 (soft reset to preserve changes)
    log.info('Executing git reset HEAD~1 to undo last commit');
    await executeGitCommand('reset HEAD~1');

    const successMessage =
      'Successfully undid the last commit. Changes are preserved in your working directory.';
    vscode.window.showInformationMessage(successMessage);
    log.info(successMessage);
  } catch (error) {
    const errorMsg = `Git Undo Commit Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
