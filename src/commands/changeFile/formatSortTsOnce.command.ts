import * as vscode from 'vscode';

import { FixFileOnceHandler } from '../../handlers';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const formatSortTsOnceCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.formatSortTsOnce`,
  async () => {
    try {
      await new FixFileOnceHandler().formatAndSort();
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
