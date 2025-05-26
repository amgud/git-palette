import * as vscode from 'vscode';
import {
  getCurrentRepository,
  showErrorMessage,
  executeGitCommand,
  log,
} from '../utils';

export async function renameBranch() {
  log.info('Git rename branch command started');

  try {
    const repository = getCurrentRepository();
    if (!repository) {
      log.info('No repository found, exiting');
      return;
    }

    log.info(`Using repository at ${repository.rootUri.fsPath}`);

    // Get current branch name
    log.info('Getting current branch name');
    const currentBranch = (
      await executeGitCommand(
        'branch --show-current',
        repository.rootUri.fsPath
      )
    ).trim();
    log.info(`Current branch: ${currentBranch}`);

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
      log.info('User cancelled branch rename');
      return; // User cancelled
    }

    log.info(`Renaming branch from '${currentBranch}' to '${newBranchName}'`);

    // Rename the branch
    await executeGitCommand(
      `branch -m "${currentBranch}" "${newBranchName}"`,
      repository.rootUri.fsPath
    );

    vscode.window.showInformationMessage(
      `Branch renamed from '${currentBranch}' to '${newBranchName}'`
    );
    log.info(
      `Successfully renamed branch from '${currentBranch}' to '${newBranchName}'`
    );
  } catch (error) {
    log.error(`Failed to rename branch: ${error}`);
    showErrorMessage('Failed to rename branch', error);
  }
}
