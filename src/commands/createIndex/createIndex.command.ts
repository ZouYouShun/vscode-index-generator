import * as vscode from 'vscode';

import { extensionNamespace } from '../../utils/extensionNamespace';
import { createIndex } from './utils';

export const createIndexCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.createIndex`,
  async () => {
    await createIndex();
    vscode.window.showInformationMessage('Create index successful!', 'OK');
  },
);
