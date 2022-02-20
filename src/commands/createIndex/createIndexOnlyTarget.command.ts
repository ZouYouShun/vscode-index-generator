import * as vscode from 'vscode';

import { IndexGeneratorOptions } from '../../generator/IndexGeneratorOptions';
import { extensionNamespace } from '../../utils/extensionNamespace';
import { createIndex } from './utils';

export const createIndexOnlyTargetCommand = (
  type: IndexGeneratorOptions['type'] = 'both',
) =>
  vscode.commands.registerCommand(
    `${extensionNamespace}.create${type}IndexOnlyTarget`,
    async () => {
      try {
        await createIndex(type, { onlyTarget: true });
      } catch (error) {
        vscode.window.showErrorMessage(error as string);
      }
    },
  );
