import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers';
import { askTargetFolder } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const formatSortTsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.formatSortTs`,
  async () => {
    try {
      const dirPath = await askTargetFolder();

      await new ChangeFileHandler(dirPath).formatTsCode();

      vscode.window.showInformationMessage('format and sort complete!', 'OK');
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
