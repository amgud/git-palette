// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fuzzysort from 'fuzzysort';

// Define an interface for our Git commands
interface GitCommand extends vscode.QuickPickItem {
  command: string;
  keywords?: string[];
}

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
        const commands: GitCommand[] = [
          {
            label: '$(add) Git Add',
            description: 'Add file contents to the index',
            command: 'git-commands-toolkit.gitAdd',
            alwaysShow: true,
            keywords: ['add', 'stage', 'index', 'changes'],
          },
          {
            label: '$(check) Git Commit',
            description: 'Record changes to the repository',
            command: 'git-commands-toolkit.gitCommit',
            alwaysShow: true,
            keywords: ['commit', 'save', 'record', 'changes'],
          },
          {
            label: '$(checklist) Git Commit Amend',
            description: 'Amend the previous commit',
            command: 'git-commands-toolkit.gitCommitAmend',
            alwaysShow: true,
            keywords: ['commit', 'amend', 'edit', 'change', 'previous'],
          },
          {
            label: '$(arrow-right) Git Commit Force',
            description: 'Force commit changes',
            command: 'git-commands-toolkit.gitCommitForce',
            alwaysShow: true,
            keywords: ['commit', 'force', 'override'],
          },
          {
            label: '$(repo-clone) Git Clone',
            description: 'Clone a repository into a new directory',
            command: 'git-commands-toolkit.gitClone',
            alwaysShow: true,
            keywords: ['clone', 'download', 'repository', 'repo'],
          },
          {
            label: '$(sync) Git Pull',
            description: 'Fetch from and integrate with another repository',
            command: 'git-commands-toolkit.gitPull',
            alwaysShow: true,
            keywords: ['pull', 'fetch', 'download', 'update'],
          },
          {
            label: '$(cloud-upload) Git Push',
            description: 'Push local changes to a remote repository',
            command: 'git-commands-toolkit.gitPush',
            alwaysShow: true,
            keywords: ['push', 'upload', 'publish', 'remote'],
          },
        ];

        // Create a custom QuickPick for better fuzzy search
        const quickPick = vscode.window.createQuickPick<GitCommand>();
        quickPick.items = commands;
        quickPick.placeholder =
          'Search for Git commands (fuzzy search enabled)';
        quickPick.matchOnDescription = true;
        quickPick.matchOnDetail = true;

        // Implement custom fuzzy search
        quickPick.onDidChangeValue((value) => {
          if (!value) {
            quickPick.items = commands;
            return;
          }

          // Prepare search targets
          const searchTargets = commands.map((cmd) => {
            // Create a combined search string from label, description, and keywords
            const labelNoIcons = cmd.label.replace(/\$\([^)]+\)\s*/, ''); // Remove icon
            const searchText = [
              labelNoIcons,
              cmd.description || '',
              ...(cmd.keywords || []),
            ]
              .join(' ')
              .toLowerCase();

            return {
              searchText,
              original: cmd,
            };
          });

          // Perform fuzzy search
          const results = fuzzysort.go(value.toLowerCase(), searchTargets, {
            key: 'searchText',
            limit: 7, // Show all matches but limit if there are too many
            threshold: -10000, // Set a very permissive threshold to catch most matches
          });

          // Update QuickPick with sorted results
          quickPick.items = results.map((result) => result.obj.original);
        });

        // Handle command selection
        quickPick.onDidAccept(() => {
          const selectedItem = quickPick.selectedItems[0];
          if (selectedItem && selectedItem.command) {
            vscode.commands.executeCommand(selectedItem.command);
            quickPick.hide();
          }
        });

        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
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
                placeHolder:
                  'No remote origin found. Would you like to add one?',
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
                  placeHolder:
                    'Do you want to set upstream for the current branch?',
                }
              );

              if (setUpstreamChoice && setUpstreamChoice.label === 'Yes') {
                // Get current branch name
                const branchOutput = await executeGitCommand(
                  'branch --show-current'
                );
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
            vscode.window.showInformationMessage(
              `Push successful: ${output.trim()}`
            );
          } catch (error) {
            // Check if the error is due to no upstream branch
            if (
              error?.toString().includes('no upstream') ||
              error?.toString().includes('set upstream')
            ) {
              const branchOutput = await executeGitCommand(
                'branch --show-current'
              );
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
    )
  );
}
