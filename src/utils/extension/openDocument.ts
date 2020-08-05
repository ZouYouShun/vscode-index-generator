import * as vscode from 'vscode';

export function openDocument(fromUrl: string) {
  return new Promise<vscode.TextDocument>((resolve, reject) => {
    vscode.workspace.openTextDocument(fromUrl).then((doc) =>
      vscode.window.showTextDocument(doc).then(() => {
        resolve(doc);
      }),
    );
  });
}
