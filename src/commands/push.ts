import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Push command implementation
 */
export async function gitPush() {
  log.info('Git push command started');

  try {
    // First, check if there's a remote origin configured
    log.info('Checking for remote origin');
    const remotes = await executeGitCommand('remote');
    log.debug(`Available remotes: ${remotes}`);

    if (!remotes.includes('origin')) {
      log.info('No remote origin found, prompting user to add one');
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
          log.info('User cancelled adding remote origin');
          return; // User cancelled
        }

        log.info(`Adding remote origin: ${remoteUrl}`);
        await executeGitCommand(`remote add origin ${remoteUrl}`);
        vscode.window.showInformationMessage(
          `Added remote origin: ${remoteUrl}`
        );
        log.info(`Successfully added remote origin: ${remoteUrl}`);

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
          log.info('Getting current branch name');
          const branchOutput = await executeGitCommand('branch --show-current');
          const currentBranch = branchOutput.trim();
          log.debug(`Current branch: ${currentBranch}`);

          log.info(`Pushing and setting upstream to origin/${currentBranch}`);
          await executeGitCommand(`push -u origin ${currentBranch}`);
          vscode.window.showInformationMessage(
            `Push successful and upstream set to origin/${currentBranch}`
          );
          log.info(
            `Successfully pushed and set upstream to origin/${currentBranch}`
          );
          return;
        }
      } else {
        log.info('User chose not to add a remote');
        return; // User doesn't want to add a remote
      }
    }

    // Regular push if origin exists or was just added but no upstream set
    try {
      log.info('Executing standard git push');
      const output = await executeGitCommand('push');
      vscode.window.showInformationMessage(`Push successful: ${output.trim()}`);
      log.info('Push successful');
    } catch (error) {
      // Check if the error is due to no upstream branch
      log.debug(`Push error: ${error}`);
      if (
        error?.toString().includes('no upstream') ||
        error?.toString().includes('set upstream')
      ) {
        log.info('No upstream branch set, asking user to set one');
        const branchOutput = await executeGitCommand('branch --show-current');
        const currentBranch = branchOutput.trim();
        log.debug(`Current branch: ${currentBranch}`);

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
            log.info(`Setting upstream to origin/${currentBranch} and pushing`);
            await executeGitCommand(
              `push --set-upstream origin ${currentBranch}`
            );
            vscode.window.showInformationMessage(
              `Push successful and upstream set to origin/${currentBranch}`
            );
            log.info(
              `Successfully pushed and set upstream to origin/${currentBranch}`
            );
          } catch (upstreamError) {
            const errorMsg = `Failed to set upstream: ${upstreamError}`;
            vscode.window.showErrorMessage(errorMsg);
            log.error(errorMsg);
          }
        } else {
          log.info('User chose not to set upstream');
        }
      } else {
        const errorMsg = `Git Push Error: ${error}`;
        vscode.window.showErrorMessage(errorMsg);
        log.error(errorMsg);
      }
    }
  } catch (error) {
    const errorMsg = `Git Push Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
