import * as path from 'path';
import * as vscode from 'vscode';
import { showInputBox } from './showInputBox';

export function askTargetFolder(message: string = 'target folder:') {
  const { rootPath } = vscode.workspace;
  const dirPath = vscode.window.activeTextEditor
    ? path.dirname(vscode.window.activeTextEditor.document.fileName)
    : rootPath;

  return showInputBox({
    placeHolder: message,
    value: dirPath,
  });
}


