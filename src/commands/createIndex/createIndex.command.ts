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
      await createIndex();
      vscode.window.showInformationMessage('Create index successful!', 'OK');
    },
  );
