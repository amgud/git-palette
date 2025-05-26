import * as vscode from 'vscode';
import * as cp from 'child_process';

/**
 * Helper function to execute git commands
 * @param command Git command to execute
 * @param cwd Optional working directory
 * @returns Promise with command output
 */
export async function executeGitCommand(
  command: string,
  cwd?: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const workspaceFolder =
      cwd || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspaceFolder) {
      reject('No workspace folder found');
      return;
    }

    cp.exec(
      `git ${command}`,
      { cwd: workspaceFolder },
      (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
          return;
        }
        resolve(stdout);
      }
    );
  });
}
