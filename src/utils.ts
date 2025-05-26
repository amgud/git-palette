import * as vscode from 'vscode';
import * as cp from 'child_process';
import { outputChannel } from './extension';

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
      const errorMsg = 'No workspace folder found';
      log.error(errorMsg);
      reject(errorMsg);
      return;
    }

    log.info(`Executing: git ${command}`);
    log.info(`Working directory: ${workspaceFolder}`);

    cp.exec(
      `git ${command}`,
      { cwd: workspaceFolder },
      (error, stdout, stderr) => {
        if (error) {
          const errorMsg = stderr || error.message;
          log.error(`Git command failed: ${errorMsg}`);
          reject(errorMsg);
          return;
        }

        // Log the output (but truncate if it's very long)
        const outputPreview =
          stdout.length > 500
            ? `${stdout.substring(0, 500)}... (truncated, ${
                stdout.length
              } chars total)`
            : stdout;

        log.info(`Command output: ${outputPreview}`);
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

  // Log to output channel
  log.error(`${message}: ${errorMessage}`);
  if (error instanceof Error && error.stack) {
    log.error(error.stack);
  }
}

/**
 * Log levels for the extension
 */
export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

/**
 * Logger object with methods for different log levels
 */
export const log = {
  /**
   * Log a debug message to the output channel
   * @param message The message to log
   */
  debug(message: string): void {
    logger(LogLevel.Debug, message);
  },

  /**
   * Log an info message to the output channel
   * @param message The message to log
   */
  info(message: string): void {
    logger(LogLevel.Info, message);
  },

  /**
   * Log a warning message to the output channel
   * @param message The message to log
   */
  warning(message: string): void {
    logger(LogLevel.Warning, message);
  },

  /**
   * Log an error message to the output channel
   * @param message The message to log
   */
  error(message: string): void {
    logger(LogLevel.Error, message);
  },
};

/**
 * Internal function to log a message to the output channel with the specified level
 * @param level The log level
 * @param message The message to log
 */
function logger(level: LogLevel, message: string): void {
  const timestamp = new Date().toISOString();
  const prefix = LogLevel[level].toUpperCase();
  outputChannel.appendLine(`[${timestamp}] [${prefix}] ${message}`);
}
