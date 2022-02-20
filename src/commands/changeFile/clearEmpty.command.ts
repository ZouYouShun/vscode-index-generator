import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers';
import { askTargetFolder } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const clearEmptyFolderCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.clearEmptyFolder`,
  async () => {
    try {
      const dirPath = await askTargetFolder();
      if (!dirPath) return;

      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: `clear empty folder ${dirPath} ......`,
        },
        async (process, token) => {
          token.onCancellationRequested(() => {
            return;
          });

          return new ChangeFileHandler(dirPath, true).clearEmptyFolder();
        },
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
