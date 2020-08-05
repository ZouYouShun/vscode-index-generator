import * as vscode from 'vscode';

export function executeCommand(cmdName: string, ...args: any) {
  return new Promise((resolve, reject) => {
    vscode.commands.executeCommand(cmdName, ...args).then(
      (e) => {
        resolve(e);
      },
      (error) => {
        reject({ message: `Extension ${cmdName} execute failed`, error });
      },
    );
  });
}
