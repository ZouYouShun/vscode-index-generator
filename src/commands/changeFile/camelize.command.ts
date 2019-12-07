import * as vscode from 'vscode';

import { camelize, uncamelize, firstLowerCase } from '../../utils';
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

      editor.edit((editBuilder) => {
        selections.forEach((selection) => {
          let word = document.getText(selection);
          try {
            if (word.includes('_')) {
              word = camelize(word);
              if (isFirstLowerCase) {
                word = firstLowerCase(word);
              }
            } else {
              word = uncamelize(word);
            }

            editBuilder.replace(selection, word);
          } catch (error) {
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