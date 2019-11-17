import * as vscode from 'vscode';

import { extensionNamespace } from '../../utils/extensionNamespace';

export const toTsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.toTs`,
  () => {
    vscode.window.showInformationMessage('change to typescript successful!', 'OK');
  },
);
