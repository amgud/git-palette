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

/**
 * Gets the current Git repository from the active file or workspace
 * @returns Object with repository info or undefined if not found
 */
export function getCurrentRepository(): { rootUri: vscode.Uri } | undefined {
  // Get the active file's path
  const activeEditor = vscode.window.activeTextEditor;
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder found');
    return undefined;
  }

  // If there's an active file, use its folder, otherwise use the first workspace folder
  const folderUri = activeEditor
    ? vscode.Uri.file(activeEditor.document.uri.fsPath).with({
        path: activeEditor.document.uri.path.split('/').slice(0, -1).join('/'),
      })
    : workspaceFolders[0].uri;

  return { rootUri: folderUri };
}

/**
 * Shows an error message with details
 * @param message The main error message
 * @param error The error object or message
 */
export function showErrorMessage(message: string, error: any): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  vscode.window.showErrorMessage(`${message}: ${errorMessage}`);
  console.error(message, error);
}
