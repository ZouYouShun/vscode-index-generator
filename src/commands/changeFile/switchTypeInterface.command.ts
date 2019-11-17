import * as path from 'path';
import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers/changeFile.handler';
import { extensionNamespace } from '../../utils/extensionNamespace';
import { SwitchHandler } from '../../handlers';

export const switchTypeInterfaceCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.switchTypeInterface`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      const { document, selection } = editor;

      let word = document.getText(selection);

      editor.edit((editBuilder) => {
        try {
          word = new SwitchHandler(word).switchTypeInterface();

          editBuilder.replace(selection, word);
        } catch (error) {
          vscode.window.showErrorMessage(error);
        }
      });
    }
  },
);
