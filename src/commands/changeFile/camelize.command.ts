import * as vscode from 'vscode';

import {
  camelize,
  escapeRegExp,
  transformFirstCharacter,
  uncamelize,
} from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const camelizeCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.switchCamelize`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (!editor) return;

    const { document, selections } = editor;

    const defaultCamelizeSeparator = vscode.workspace
      .getConfiguration(extensionNamespace)
      .get<string>('camelizeSeparator');

    const message = 'Please enter char of camelize separator';

    const pickList = ['-', '_'].map((label) => ({
      label,
      picked: label === defaultCamelizeSeparator,
    }));

    const camelizeSeparator = await vscode.window.showQuickPick(pickList, {
      title: message,
      placeHolder: message,
    });

    if (!camelizeSeparator) return;

    const regExp = new RegExp(escapeRegExp(camelizeSeparator.label));

    const doCamelize = selections.some((x) => regExp.test(document.getText(x)));

    let isFirstLowerCaseValue = false;

    if (doCamelize) {
      const defaultFirstLowerCase = vscode.workspace
        .getConfiguration(extensionNamespace)
        .get<boolean>('firstLowerCase');

      const isFirstLowerCase = await vscode.window.showQuickPick(
        [
          {
            label: 'uppercase',
            value: false,
            picked: !defaultFirstLowerCase,
          },
          {
            label: 'lowercase',
            value: true,
            picked: defaultFirstLowerCase,
          },
        ],
        {
          title: 'First character format',
        },
      );

      if (!isFirstLowerCase) return;

      isFirstLowerCaseValue = isFirstLowerCase.value;
    }

    editor.edit((editBuilder) => {
      for (const selection of selections) {
        let word = document.getText(selection);

        try {
          if (doCamelize) {
            word = camelize(word);

            word = transformFirstCharacter(word, (s: string): string =>
              isFirstLowerCaseValue ? s.toLocaleLowerCase() : s.toUpperCase(),
            );
          } else {
            word = uncamelize(word, camelizeSeparator.label);
          }

          editBuilder.replace(selection, word);
        } catch (error: any) {
          vscode.window.showErrorMessage(error);
        }
      }
    });
  },
);
