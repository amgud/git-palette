import * as vscode from 'vscode';
import { executeGitCommand, log } from '../utils';

/**
 * Git Pull command implementation
 */
export async function gitPull() {
  log.info('Git pull command started');

  try {
    log.info('Executing git pull');
    const output = await executeGitCommand('pull');
    const trimmedOutput = output.trim();
    vscode.window.showInformationMessage(`Pull successful: ${trimmedOutput}`);
    log.info(`Pull successful: ${trimmedOutput}`);
  } catch (error) {
    const errorMsg = `Git Pull Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
