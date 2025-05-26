// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

// Helper function to execute git commands
async function executeGitCommand(
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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  // Add this command to monitor when the command palette is opened
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.showCustomCommands',
      async () => {
        // Show our Git commands
        const commands = [
          {
            label: '$(add) Git Add',
            description: 'Add file contents to the index',
            command: 'git-commands-toolkit.gitAdd',
            alwaysShow: true,
          },
          {
            label: '$(check) Git Commit',
            description: 'Record changes to the repository',
            command: 'git-commands-toolkit.gitCommit',
            alwaysShow: true,
          },
          {
            label: '$(repo-clone) Git Clone',
            description: 'Clone a repository into a new directory',
            command: 'git-commands-toolkit.gitClone',
            alwaysShow: true,
          },
          {
            label: '$(sync) Git Pull',
            description: 'Fetch from and integrate with another repository',
            command: 'git-commands-toolkit.gitPull',
            alwaysShow: true,
          },
          {
            label: '$(cloud-upload) Git Push',
            description: 'Push local changes to a remote repository',
            command: 'git-commands-toolkit.gitPush',
            alwaysShow: true,
          },
        ];

        const selectedItem = await vscode.window.showQuickPick(commands, {
          placeHolder: 'Select a Git command to run',
          matchOnDescription: true,
          matchOnDetail: true,
        });

        if (selectedItem && selectedItem.command) {
          vscode.commands.executeCommand(selectedItem.command);
        }
      }
    )
  );

  // Git Add command
  context.subscriptions.push(
    vscode.commands.registerCommand('git-commands-toolkit.gitAdd', async () => {
      const files = await vscode.window.showInputBox({
        prompt: 'Files to add (e.g., "." for all files)',
        placeHolder: '.',
        value: '.',
      });

      if (files === undefined) {
        return; // User cancelled
      }
      try {
        await executeGitCommand(`add ${files}`);
        vscode.window.showInformationMessage(`Added files: ${files}`);
      } catch (error) {
        vscode.window.showErrorMessage(`Git Add Error: ${error}`);
      }
    })
  );

  // Git Commit command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.gitCommit',
      async () => {
        const message = await vscode.window.showInputBox({
          prompt: 'Commit message',
          placeHolder: 'Enter commit message',
        });

        if (!message) {
          return; // User cancelled or entered empty message
        }
        try {
          await executeGitCommand(`commit -m "${message}"`);
          vscode.window.showInformationMessage(`Committed: ${message}`);
        } catch (error) {
          vscode.window.showErrorMessage(`Git Commit Error: ${error}`);
        }
      }
    )
  );

  // Git Clone command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.gitClone',
      async () => {
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
    )
  );

  // Git Pull command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.gitPull',
      async () => {
        try {
          const output = await executeGitCommand('pull');
          vscode.window.showInformationMessage(
            `Pull successful: ${output.trim()}`
          );
        } catch (error) {
          vscode.window.showErrorMessage(`Git Pull Error: ${error}`);
        }
      }
    )
  );

  // Git Push command
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'git-commands-toolkit.gitPush',
      async () => {
        try {
          const output = await executeGitCommand('push');
          vscode.window.showInformationMessage(
            `Push successful: ${output.trim()}`
          );
        } catch (error) {
          vscode.window.showErrorMessage(`Git Push Error: ${error}`);
        }
      }
    )
  );
}
