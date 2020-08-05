import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers/changeFile.handler';
import { askTargetFolder } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const toTsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.toTs`,
  async () => {
    try {
      const dirPath = await askTargetFolder();
      new ChangeFileHandler(dirPath).toTs();

      vscode.window.showInformationMessage(
        'change to typescript successful!',
        'OK',
      );
    } catch (error) {
      vscode.window.showErrorMessage(error);
    }
  },
);
