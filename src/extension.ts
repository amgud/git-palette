// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'getting-started-sample.runCommand',
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        vscode.commands.executeCommand(
          'getting-started-sample.sayHello',
          vscode.Uri.joinPath(context.extensionUri, 'sample-folder')
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'getting-started-sample.changeSetting',
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        vscode.workspace
          .getConfiguration('getting-started-sample')
          .update('sampleSetting', true);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'getting-started-sample.setContext',
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        vscode.commands.executeCommand(
          'setContext',
          'gettingStartedContextKey',
          true
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('getting-started-sample.sayHello', () => {
      vscode.window.showInformationMessage('Hello');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'getting-started-sample.viewSources',
      () => {
        return { openFolder: vscode.Uri.joinPath(context.extensionUri, 'src') };
      }
    )
  );

  // Register custom command to show quick pick with 'g' prefix
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'getting-started-sample.showCustomCommands',
      async () => {
        const commands = [
          {
            label: '$(sparkle) Say Hello',
            description: 'Display a hello world message',
            command: 'getting-started-sample.sayHello',
            alwaysShow: true,
          },
          {
            label: '$(settings-gear) Change Sample Setting',
            description: 'Toggle the sample setting value',
            command: 'getting-started-sample.changeSetting',
            alwaysShow: true,
          },
          {
            label: '$(play) Run Command',
            description: 'Run a sample command',
            command: 'getting-started-sample.runCommand',
            alwaysShow: true,
          },
          {
            label: '$(key) Set Context',
            description: 'Set a context key',
            command: 'getting-started-sample.setContext',
            alwaysShow: true,
          },
          {
            label: '$(folder) View Sources',
            description: 'Open the extension source folder',
            command: 'getting-started-sample.viewSources',
            alwaysShow: true,
          },
        ];

        const selectedItem = await vscode.window.showQuickPick(commands, {
          placeHolder: 'Select a command to run',
          matchOnDescription: true,
          matchOnDetail: true,
        });

        if (selectedItem && selectedItem.command) {
          vscode.commands.executeCommand(selectedItem.command);
        }
      }
    )
  );
}
