import * as vscode from 'vscode';
import {
  getCurrentRepository,
  showErrorMessage,
  executeGitCommand,
} from '../utils';

export async function renameBranch() {
  try {
    const repository = getCurrentRepository();
    if (!repository) {
      return;
    }

    // Get current branch name
    const currentBranch = (
      await executeGitCommand(
        'branch --show-current',
        repository.rootUri.fsPath
      )
    ).trim();

    // Ask user for new branch name
    const newBranchName = await vscode.window.showInputBox({
      prompt: `Enter new name for branch '${currentBranch}'`,
      placeHolder: 'New branch name',
      value: currentBranch, // Default to current branch name
      validateInput: (value) => {
        if (!value) {
          return 'Branch name cannot be empty';
        }
        if (value.includes(' ')) {
          return 'Branch name cannot contain spaces';
        }
        if (value === currentBranch) {
          return 'New name must be different from current name';
        }
        return null;
      },
    });

    if (!newBranchName) {
      return; // User cancelled
    }

    // Rename the branch
    await executeGitCommand(
      `branch -m "${currentBranch}" "${newBranchName}"`,
      repository.rootUri.fsPath
    );

    vscode.window.showInformationMessage(
      `Branch renamed from '${currentBranch}' to '${newBranchName}'`
    );
  } catch (error) {
    showErrorMessage('Failed to rename branch', error);
  }
}
