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

      vscode.window.showInformationMessage('format and sort complete!', 'OK');
    } catch (error) {
      vscode.window.showErrorMessage(error);
    }
  },
);
