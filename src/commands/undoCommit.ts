import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Undo Commit command implementation
 * Undoes the most recent commit if it hasn't been pushed yet
 */
export async function gitUndoCommit() {
  try {
    // Confirm with user before undoing commit
    const confirmed = await vscode.window.showWarningMessage(
      'This will undo your most recent commit. The changes will be preserved in your working directory. Continue?',
      { modal: true },
      'Yes'
    );

    if (confirmed !== 'Yes') {
      return; // User cancelled
    }

    // Execute git reset HEAD~1 (soft reset to preserve changes)
    await executeGitCommand('reset HEAD~1');
    vscode.window.showInformationMessage(
      'Successfully undid the last commit. Changes are preserved in your working directory.'
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Git Undo Commit Error: ${error}`);
  }
}
