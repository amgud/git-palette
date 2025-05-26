import * as vscode from 'vscode';
import { executeGitCommand } from '../utils';

/**
 * Git Pull command implementation
 */
export async function gitPull() {
  try {
    const output = await executeGitCommand('pull');
    vscode.window.showInformationMessage(`Pull successful: ${output.trim()}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Pull Error: ${error}`);
  }
}
