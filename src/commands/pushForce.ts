import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Push Force command implementation
 * Provides options for force push with lease (safer) or regular force push
 */
export async function gitPushForce() {
  log.info('Git push force command started');
  log.warning('User is attempting a force push operation');

  try {
    // Show a warning and confirmation before proceeding with force push
    const warningMessage =
      'Force pushing can overwrite remote changes. How would you like to proceed?';

    const pushOptions = [
      {
        label: 'Force push with lease',
        description:
          "Safer option that protects against overwriting others' changes",
        detail: 'Uses --force-with-lease flag',
      },
      {
        label: 'Force push',
        description: 'Overwrites remote branch (use with caution)',
        detail: 'Uses --force flag',
      },
      {
        label: 'Cancel',
        description: 'Abort the force push operation',
      },
    ];

    const selectedOption = await vscode.window.showQuickPick(pushOptions, {
      placeHolder: warningMessage,
    });

    if (!selectedOption || selectedOption.label === 'Cancel') {
      log.info('User cancelled force push operation');
      return; // User cancelled
    }

    // Determine which force push option to use
    const forceFlag =
      selectedOption.label === 'Force push with lease'
        ? '--force-with-lease'
        : '--force';

    log.info(
      `User selected force push option: ${selectedOption.label} (${forceFlag})`
    );

    // Get current branch
    log.info('Getting current branch name');
    const branchOutput = await executeGitCommand('branch --show-current');
    const currentBranch = branchOutput.trim();
    log.info(`Current branch: ${currentBranch}`);

    // Execute force push
    log.info(`Executing: git push ${forceFlag} origin ${currentBranch}`);
    const output = await executeGitCommand(
      `push ${forceFlag} origin ${currentBranch}`
    );

    const successMessage = `Force push successful: ${
      output.trim() || `to origin/${currentBranch}`
    }`;
    vscode.window.showInformationMessage(successMessage);
    log.info(successMessage);
  } catch (error) {
    const errorMsg = `Git Force Push Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
