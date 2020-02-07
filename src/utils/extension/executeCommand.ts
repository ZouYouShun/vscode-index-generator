import * as vscode from 'vscode';

export function executeCommand(cmdName: string) {
  return new Promise((resolve, reject) => {
    vscode.commands.executeCommand(cmdName).then(
      () => {
        resolve();
      },
      (error) => {
        reject({ message: `Extension ${cmdName} execute failed`, error });
      },
    );
  });
}
