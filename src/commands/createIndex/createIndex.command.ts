import * as vscode from 'vscode';

import { IndexGeneratorOptions } from '../../generator/IndexGeneratorOptions';
import { extensionNamespace } from '../../utils/extensionNamespace';
import { createIndex } from './utils';

export const createIndexCommand = (
  type: IndexGeneratorOptions['type'] = 'both',
) =>
  vscode.commands.registerCommand(
    `${extensionNamespace}.create${type}Index`,
    async () => {
      try {
        await createIndex(type);
        vscode.window.showInformationMessage('Create index successful!', 'OK');
      } catch (error: any) {
        vscode.window.showErrorMessage(error);
      }
    },
  );
