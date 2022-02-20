import * as vscode from 'vscode';

import { SwitchHandler } from '../../handlers';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const switchTypeInterfaceCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.switchTypeInterface`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (!editor) return;

    const { document, selection } = editor;

    editor.edit((editBuilder) => {
      try {
        const selectionText = document.getText(selection);

        const text = new SwitchHandler(selectionText).switchTypeInterface();

        if (!text) return;

        editBuilder.replace(selection, text);
      } catch (error: any) {
        vscode.window.showErrorMessage(error);
      }
    });
  },
);
