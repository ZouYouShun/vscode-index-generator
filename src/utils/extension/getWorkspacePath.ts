import * as vscode from 'vscode';

export const getWorkspacePath = () =>
  new Promise<string>((resolve, reject) => {
    if (
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders?.length > 1
    ) {
      vscode.window.showWorkspaceFolderPick().then(
        (dirPath) => {
          if (dirPath) {
            resolve(dirPath?.uri.path);
          }
        },
        () => {
          reject(null);
        },
      );
      return;
    } else if (vscode.workspace.workspaceFolders?.length === 1) {
      resolve(vscode.workspace.workspaceFolders[0].uri.path);
      return;
    }

    reject(null);
  });
