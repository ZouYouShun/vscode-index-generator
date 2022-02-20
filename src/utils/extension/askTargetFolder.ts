import * as path from 'path';
import * as vscode from 'vscode';

import { showInputBox } from './showInputBox';

type AskTargetFolderParams = {
  message?: string;
  rootPath: string;
};

export function askTargetFolder(
  {
    message = 'target folder:',
    rootPath = vscode.window.activeTextEditor
      ? path.dirname(vscode.window.activeTextEditor.document.fileName)
      : '',
  }: AskTargetFolderParams = {} as any,
) {
  return vscode.window.showInputBox({
    title: message,
    placeHolder: message,
    value: rootPath,
  });
}
