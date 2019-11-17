import * as vscode from 'vscode';

export function checkExtensionLoaded(extensionName: string) {
  return new Promise((resolve, reject) => {
    var extension = vscode.extensions.getExtension(extensionName);

    if (extension.isActive === false) {
      extension.activate().then(
        () => {
          resolve();
        },
        () => {
          reject('Extension activation failed');
        },
      );
    }
    resolve();
  });
}
