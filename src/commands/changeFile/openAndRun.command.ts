import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers';
import { askTargetFolder, showInputBox } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const openAndRunCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.openAndRun`,
  async () => {
    try {
      const dirPath = await askTargetFolder();

      const cmd = await showInputBox({
        placeHolder:
          'Please enter command you want to run for below each files, use ; to separate commands',
        value: '',
      });

      if (cmd) {
        const commands = cmd
          .split(';')
          .map((x) => x.trim())
          .filter((x) => !!x);

        if (commands.length > 0) {
          await new ChangeFileHandler(dirPath).openAndRun(commands);
        }
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
