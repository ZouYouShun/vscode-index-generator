import * as path from 'path';
import * as vscode from 'vscode';

export function askTargetFolder(message: string = 'target folder:') {
  return new Promise<string>((resolve, reject) => {
    const { rootPath } = vscode.workspace;
    const dirPath = vscode.window.activeTextEditor
      ? path.dirname(vscode.window.activeTextEditor.document.fileName)
      : rootPath;

    vscode.window
      .showInputBox({
        placeHolder: message,
        value: dirPath,
      })
      .then(
        (dirPath) => {
          resolve(dirPath);
        },
        () => {
          reject();
        },
      );
  });
}
