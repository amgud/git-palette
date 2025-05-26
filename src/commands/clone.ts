import * as vscode from 'vscode';
import * as path from 'path';
import { executeGitCommand, log } from '../utils';

/**
 * Git Clone command implementation
 */
export async function gitClone() {
  log.info('Git clone command started');

  const repoUrl = await vscode.window.showInputBox({
    prompt: 'Repository URL',
    placeHolder: 'https://github.com/user/repo.git',
  });

  if (!repoUrl) {
    log.info('Git clone cancelled: No repository URL provided');
    return; // User cancelled
  }

  log.info(`Repository URL: ${repoUrl}`);

  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select Folder for Clone',
  });

  if (!folderUri || folderUri.length === 0) {
    log.info('Git clone cancelled: No target folder selected');
    return; // User cancelled
  }
  try {
    const targetPath = folderUri[0].fsPath;
    log.info(`Target path for clone: ${targetPath}`);

    log.info(`Executing: git clone ${repoUrl} in ${targetPath}`);
    await executeGitCommand(`clone ${repoUrl}`, targetPath);
    vscode.window.showInformationMessage(`Cloned repository: ${repoUrl}`);
    log.info(`Successfully cloned repository: ${repoUrl}`);

    const repoName = path.basename(
      repoUrl.endsWith('.git') ? repoUrl.slice(0, -4) : repoUrl
    );

    const clonedFolderPath = path.join(targetPath, repoName);
    log.info(`Opening cloned repository folder: ${clonedFolderPath}`);
    const uri = vscode.Uri.file(clonedFolderPath);
    vscode.commands.executeCommand('vscode.openFolder', uri);
  } catch (error) {
    const errorMsg = `Git Clone Error: ${error}`;
    vscode.window.showErrorMessage(errorMsg);
    log.error(errorMsg);
  }
}
