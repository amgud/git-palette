import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Commit command implementation
 */
export async function gitCommit() {
  // First prompt for the commit message
  const message = await vscode.window.showInputBox({
    prompt: 'Commit message',
    placeHolder: 'Enter commit message',
  });

  if (!message) {
    return; // User cancelled or entered empty message
  }

  // Then show checkboxes for amend and force options
  const commitOptions = await vscode.window.showQuickPick(
    [
      { label: 'Amend previous commit', picked: false },
      { label: 'Force commit', picked: false },
    ],
    {
      placeHolder: 'Select commit options (if any)',
      canPickMany: true,
    }
  );

  if (!commitOptions) {
    return; // User cancelled
  }

  const shouldAmend = commitOptions.some(
    (option) => option.label === 'Amend previous commit'
  );

  const shouldForce = commitOptions.some(
    (option) => option.label === 'Force commit'
  );

  try {
    let commitCommand = 'commit';
    if (shouldAmend) {
      commitCommand += ' --amend';
    }
    if (shouldForce) {
      commitCommand += ' --force';
    }

    await executeGitCommand(`${commitCommand} -m "${message}"`);

    const amendText = shouldAmend ? ' (amended)' : '';
    const forceText = shouldForce ? ' (forced)' : '';
    vscode.window.showInformationMessage(
      `Committed${amendText}${forceText}: ${message}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(`Git Commit Error: ${error}`);
  }
}
