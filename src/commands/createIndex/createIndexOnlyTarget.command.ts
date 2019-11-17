import * as vscode from 'vscode';

import { extensionNamespace } from '../../utils/extensionNamespace';
import { createIndex } from './utils';

export const createIndexOnlyTargetCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.createIndexOnlyTarget`,
  async () => {
    await createIndex({ onlyTarget: true });
    vscode.window.showInformationMessage('Create index successful!', 'OK');
  },
);
