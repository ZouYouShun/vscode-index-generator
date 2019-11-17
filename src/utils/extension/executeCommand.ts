import * as vscode from 'vscode';

export function executeCommand(extensionName: string) {
  return new Promise((resolve, reject) => {
    vscode.commands.executeCommand(extensionName).then(
      () => {
        resolve();
      },
      () => {
        reject('Extension activation failed');
      },
    );
  });
}
