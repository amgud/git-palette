import * as vscode from 'vscode';
import * as fuzzysort from 'fuzzysort';

// Define an interface for our Git commands
export interface GitCommand extends vscode.QuickPickItem {
  command: string;
  keywords?: string[];
}

/**
 * Shows the Git command palette with fuzzy search
 */
export async function showCommandPalette() {
  // Define our Git commands
  const commands: GitCommand[] = [
    {
      label: '$(add) Add',
      description: 'Add file contents to the index',
      command: 'git-commands-toolkit.gitAdd',
      alwaysShow: true,
      keywords: ['add', 'stage', 'index', 'changes'],
    },
    {
      label: '$(check) Commit',
      description: 'Record changes to the repository',
      command: 'git-commands-toolkit.gitCommit',
      alwaysShow: true,
      keywords: ['commit', 'save', 'record', 'changes'],
    },
    {
      label: '$(checklist) Commit Amend',
      description: 'Amend the previous commit',
      command: 'git-commands-toolkit.gitCommitAmend',
      alwaysShow: true,
      keywords: ['commit', 'amend', 'edit', 'change', 'previous'],
    },
    {
      label: '$(arrow-right) Commit Force',
      description: 'Force commit changes',
      command: 'git-commands-toolkit.gitCommitForce',
      alwaysShow: true,
      keywords: ['commit', 'force', 'override'],
    },
    {
      label: '$(repo-clone) Clone',
      description: 'Clone a repository into a new directory',
      command: 'git-commands-toolkit.gitClone',
      alwaysShow: true,
      keywords: ['clone', 'download', 'repository', 'repo'],
    },
    {
      label: '$(sync) Pull',
      description: 'Fetch from and integrate with another repository',
      command: 'git-commands-toolkit.gitPull',
      alwaysShow: true,
      keywords: ['pull', 'fetch', 'download', 'update'],
    },
    {
      label: '$(cloud-upload) Push',
      description: 'Push local changes to a remote repository',
      command: 'git-commands-toolkit.gitPush',
      alwaysShow: true,
      keywords: ['push', 'upload', 'publish', 'remote'],
    },
  ];

  // Create a custom QuickPick for better fuzzy search
  const quickPick = vscode.window.createQuickPick<GitCommand>();
  quickPick.items = commands;
  quickPick.placeholder = 'Search for Git commands (fuzzy search enabled)';
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
