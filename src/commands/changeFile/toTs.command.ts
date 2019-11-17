import * as path from 'path';
import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers/changeFile.handler';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const toTsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.toTs`,
  async () => {
    const { rootPath } = vscode.workspace;
    const dirPath = vscode.window.activeTextEditor
      ? path.dirname(vscode.window.activeTextEditor.document.fileName)
      : rootPath;

    try {
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
