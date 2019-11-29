import * as vscode from 'vscode';

import { extensionNamespace } from '../../utils/extensionNamespace';
import { createIndex } from './utils';
import { IndexGeneratorOptions } from '../../generator/IndexGeneratorOptions';

export const createIndexOnlyTargetCommand = (
  type: IndexGeneratorOptions['type'] = 'both',
) =>
  vscode.commands.registerCommand(
    `${extensionNamespace}.create${type}IndexOnlyTarget`,
    async () => {
      await createIndex(type, { onlyTarget: true });
      vscode.window.showInformationMessage('Create index successful!', 'OK');
    },
  );
