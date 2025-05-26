import * as vscode from 'vscode';
import * as path from 'path';
import { executeGitCommand } from '../utils';

/**
 * Git Clone command implementation
 */
export async function gitClone() {
  const repoUrl = await vscode.window.showInputBox({
    prompt: 'Repository URL',
    placeHolder: 'https://github.com/user/repo.git',
  });

  if (!repoUrl) {
    return; // User cancelled
  }

  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Folder for Clone',
  });

  if (!folderUri || folderUri.length === 0) {
    return; // User cancelled
  }
  try {
    const targetPath = folderUri[0].fsPath;
    await executeGitCommand(`clone ${repoUrl}`, targetPath);
    vscode.window.showInformationMessage(`Cloned repository: ${repoUrl}`);

    const repoName = path.basename(
      repoUrl.endsWith('.git') ? repoUrl.slice(0, -4) : repoUrl
    );

    const clonedFolderPath = path.join(targetPath, repoName);
    const uri = vscode.Uri.file(clonedFolderPath);
    vscode.commands.executeCommand('vscode.openFolder', uri);
  } catch (error) {
    vscode.window.showErrorMessage(`Git Clone Error: ${error}`);
  }
}
