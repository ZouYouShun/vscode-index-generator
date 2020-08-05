import * as vscode from 'vscode';

import { PrettierGenerator } from '../../generator/prettier.generator';
import { askTargetFolder } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';
import { getConfigs } from '../../utils/extension/getConfigs';

export const prettierFormatCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.prettier`,
  async () => {
    try {
      const dirPath = await askTargetFolder();
      const { rootPath } = vscode.workspace;

      const { prettierConfig, ignore } = getConfigs(rootPath);

      new PrettierGenerator(dirPath, { prettierConfig, ignore }).createFile();

      vscode.window.showInformationMessage('prettier run complete!', 'OK');
    } catch (error) {
      vscode.window.showErrorMessage(error);
    }
  },
);
