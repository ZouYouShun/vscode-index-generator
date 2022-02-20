import * as vscode from 'vscode';

import { RunCommandHandler } from '../../handlers/run-command.handler';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const formatSortTsOnceCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.formatSortTsOnce`,
  async () => {
    try {
      await new RunCommandHandler().openFileAndFormat();
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
