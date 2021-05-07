import * as vscode from 'vscode';

export function showInputBox(
  options?: vscode.InputBoxOptions,
  token?: vscode.CancellationToken,
) {
  return new Promise<string>((resolve, reject) => {
    vscode.window.showInputBox(options, token).then(
      (dirPath) => {
        if (!dirPath) {
          reject('');
        } else {
          resolve(dirPath);
        }
      },
      () => {
        reject();
      },
    );
  });
}
