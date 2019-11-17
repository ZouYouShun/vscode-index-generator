import * as path from 'path';
import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers/changeFile.handler';
import { extensionNamespace } from '../../utils/extensionNamespace';
import { askTargetFolder } from '../../utils';

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
