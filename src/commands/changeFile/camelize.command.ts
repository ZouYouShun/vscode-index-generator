import * as vscode from 'vscode';

import {
  camelize,
  uncamelize,
  firstLowerCase,
  showInputBox,
} from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const camelizeCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.switchCamelize`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      const { document, selections } = editor;

      const isFirstLowerCase = vscode.workspace
        .getConfiguration(extensionNamespace)
        .get<boolean>('firstLowerCase');

      const camelizeSeparator = await showInputBox({
        placeHolder: 'Please enter char of camelize separator',
        value: vscode.workspace
          .getConfiguration(extensionNamespace)
          .get<string>('camelizeSeparator'),
      });

      editor.edit((editBuilder) => {
        selections.forEach(async (selection) => {
          let word = document.getText(selection);
          try {
            if (word.includes('_') || word.includes('-')) {
              word = camelize(word);
              if (isFirstLowerCase) {
                word = firstLowerCase(word);
              }
            } else {
              word = uncamelize(word, camelizeSeparator);
            }

            editBuilder.replace(selection, word);
          } catch (error: any) {
            vscode.window.showErrorMessage(error);
          }
        });
      });
    }
  },
);
// vscode.workspace
//       .openTextDocument({ language: 'typescript', content: 'eewq' })
//       .then((doc) => vscode.window.showTextDocument(doc));
