import * as vscode from 'vscode';

export function checkExtensionLoaded(extensionName: string) {
  return new Promise((resolve, reject) => {
    const extension = vscode.extensions.getExtension(extensionName);

    if (extension && extension.isActive === false) {
      extension.activate().then(
        () => {
          resolve(undefined);
        },
        () => {
          reject(`Extension ${extensionName} activation failed`);
        },
      );
    }
    resolve(undefined);
  });
}
