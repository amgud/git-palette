import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Push command implementation
 */
export async function gitPush() {
  try {
    // First, check if there's a remote origin configured
    const remotes = await executeGitCommand('remote');

    if (!remotes.includes('origin')) {
      // No origin remote found, ask user if they want to add one using quick pick
      const addRemoteOptions = [
        { label: 'Yes', description: 'Add a remote origin' },
        { label: 'No', description: 'Skip adding remote' },
      ];

      const addRemoteChoice = await vscode.window.showQuickPick(
        addRemoteOptions,
        {
          placeHolder: 'No remote origin found. Would you like to add one?',
        }
      );

      if (addRemoteChoice && addRemoteChoice.label === 'Yes') {
        const remoteUrl = await vscode.window.showInputBox({
          prompt: 'Enter the remote repository URL',
          placeHolder: 'https://github.com/username/repository.git',
        });

        if (!remoteUrl) {
          return; // User cancelled
        }

        await executeGitCommand(`remote add origin ${remoteUrl}`);
        vscode.window.showInformationMessage(
          `Added remote origin: ${remoteUrl}`
        );

        // Ask if the user wants to set upstream using quick pick
        const upstreamOptions = [
          {
            label: 'Yes',
            description: 'Set upstream for the current branch',
          },
          { label: 'No', description: 'Skip setting upstream' },
        ];

        const setUpstreamChoice = await vscode.window.showQuickPick(
          upstreamOptions,
          {
            placeHolder: 'Do you want to set upstream for the current branch?',
          }
        );

        if (setUpstreamChoice && setUpstreamChoice.label === 'Yes') {
          // Get current branch name
          const branchOutput = await executeGitCommand('branch --show-current');
          const currentBranch = branchOutput.trim();

          await executeGitCommand(`push -u origin ${currentBranch}`);
          vscode.window.showInformationMessage(
            `Push successful and upstream set to origin/${currentBranch}`
          );
          return;
        }
      } else {
        return; // User doesn't want to add a remote
      }
    }

    // Regular push if origin exists or was just added but no upstream set
    try {
      const output = await executeGitCommand('push');
      vscode.window.showInformationMessage(`Push successful: ${output.trim()}`);
    } catch (error) {
      // Check if the error is due to no upstream branch
      if (
        error?.toString().includes('no upstream') ||
        error?.toString().includes('set upstream')
      ) {
        const branchOutput = await executeGitCommand('branch --show-current');
        const currentBranch = branchOutput.trim();

        // Ask about setting upstream using quick pick
        const upstreamOptions = [
          {
            label: 'Yes',
            description: 'Set upstream for the current branch',
          },
          { label: 'No', description: 'Skip setting upstream' },
        ];

        const setUpstreamChoice = await vscode.window.showQuickPick(
          upstreamOptions,
          {
            placeHolder: `No upstream branch set for ${currentBranch}. Would you like to set it?`,
          }
        );

        if (setUpstreamChoice && setUpstreamChoice.label === 'Yes') {
          try {
            await executeGitCommand(
              `push --set-upstream origin ${currentBranch}`
            );
            vscode.window.showInformationMessage(
              `Push successful and upstream set to origin/${currentBranch}`
            );
          } catch (upstreamError) {
            vscode.window.showErrorMessage(
              `Failed to set upstream: ${upstreamError}`
            );
          }
        }
      } else {
        vscode.window.showErrorMessage(`Git Push Error: ${error}`);
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Git Push Error: ${error}`);
  }
}
