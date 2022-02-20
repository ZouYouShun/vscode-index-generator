import * as vscode from 'vscode';

import { FormatGenerator } from '../../generator/format.generator';
import {
  askConfirm,
  askTargetFolder,
  extensionNamespace,
  getConfigs,
} from '../../utils';
import { getWorkspacePath } from '../../utils/extension/getWorkspacePath';

export const formatCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.format`,
  async () => {
    try {
      const rootPath = await getWorkspacePath();
      const dirPath = await askTargetFolder();

      if (!dirPath) return;

      const withImportSort = await askConfirm({
        message: 'Do you want to run import sort before format?',
      });

      const { prettierConfig, ignore } = getConfigs(rootPath);

      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: `formatting folder ${dirPath} ......`,
        },
        async (process, token) => {
          const formatGenerator = new FormatGenerator(dirPath, {
            withImportSort,
            prettierConfig,
            ignore,
          });

          token.onCancellationRequested(() => {
            formatGenerator.cancel();
            return;
          });

          return formatGenerator.createFile();
        },
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
