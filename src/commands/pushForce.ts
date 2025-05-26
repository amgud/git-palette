import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Push Force command implementation
 * Provides options for force push with lease (safer) or regular force push
 */
export async function gitPushForce() {
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
      return; // User cancelled
    }

    // Determine which force push option to use
    const forceFlag =
      selectedOption.label === 'Force push with lease'
        ? '--force-with-lease'
        : '--force';

    // Get current branch
    const branchOutput = await executeGitCommand('branch --show-current');
    const currentBranch = branchOutput.trim();

    // Execute force push
    const output = await executeGitCommand(
      `push ${forceFlag} origin ${currentBranch}`
    );

    vscode.window.showInformationMessage(
      `Force push successful: ${output.trim() || `to origin/${currentBranch}`}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Git Force Push Error: ${error}`);
  }
}
