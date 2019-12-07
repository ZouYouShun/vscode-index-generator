import * as vscode from 'vscode';
import * as path from 'path';

import { extensionNamespace } from '../../utils/extensionNamespace';
import {
  firstLowerCase,
  camelize,
  checkExtensionLoaded,
  executeCommand,
} from '../../utils';

export const criusPropsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.criusProps`,
  async () => {
    let editor = vscode.window.activeTextEditor;

    if (editor) {
      const { document, selections } = editor;

      const word = selections
        .map((selection) => document.getText(selection), '')
        .join('|');

      const props = word
        .match(/\w+/g)
        .map((p) => `${firstLowerCase(camelize(p))}: any;`);

      const fileName = path
        .basename(vscode.window.activeTextEditor.document.fileName)
        .split('.')[0];

      const content = `export interface ${camelize(fileName)} {
        ${props.join(`\r\n`)}
      }`;

      vscode.workspace
        .openTextDocument({
          language: 'typescript',
          content: content,
        })
        .then((doc) => vscode.window.showTextDocument(doc))
        .then(async () => {
          await checkExtensionLoaded('esbenp.prettier-vscode');
          await executeCommand('editor.action.formatDocument');
        });
    }
  },
);
