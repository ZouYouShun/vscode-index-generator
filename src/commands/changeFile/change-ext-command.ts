import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers';
import { askTargetFolder, getWorkspacePath, showInputBox } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';
import { runToTs } from './toTs.command';

const fromMessage = 'from ext:';
const defaultFrom = 'js';
const toMessage = 'to ext:';
const defaultTo = 'ts';

export const changeExtCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.changeExt`,
  async () => {
    try {
      const rootPath = await getWorkspacePath();
      const dirPath = await askTargetFolder();
      if (!dirPath) return;

      const from = await vscode.window.showInputBox({
        title: fromMessage,
        placeHolder: fromMessage,
        value: defaultFrom,
      });

      const to = await vscode.window.showInputBox({
        title: toMessage,
        placeHolder: toMessage,
        value: defaultTo,
      });

      if (!from || !to || from === to) return;

      if (from === defaultFrom && to === defaultTo) {
        return runToTs(rootPath, dirPath);
      }

      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: `change extname at ${dirPath} ${from} to ${to} ......`,
        },
        async (process, token) => {
          token.onCancellationRequested(() => {
            return;
          });

          return new ChangeFileHandler(dirPath, true).changeExt({ from, to });
        },
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
