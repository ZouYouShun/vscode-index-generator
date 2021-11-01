import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers';
import { askTargetFolder } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const clearEmptyFolderCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.clearEmptyFolder`,
  async () => {
    try {
      const dirPath = await askTargetFolder();

      await new ChangeFileHandler(dirPath, undefined, true).clearEmptyFolder();

      vscode.window.showInformationMessage(
        'clear empty folder complete!',
        'OK',
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
