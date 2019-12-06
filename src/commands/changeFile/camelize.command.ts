import * as vscode from 'vscode';

import { camelize, uncamelize } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const camelizeCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.switchCamelize`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      const { document, selection } = editor;

      let word = document.getText(selection);

      editor.edit((editBuilder) => {
        try {
          if (word.includes('_')) {
            word = camelize(word);
          } else {
            word = uncamelize(word);
          }

          editBuilder.replace(selection, word);
        } catch (error) {
          vscode.window.showErrorMessage(error);
        }
      });
    }
  },
);
