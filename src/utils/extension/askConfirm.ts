import * as vscode from 'vscode';

type AskConfirmParams = {
  message?: string;
};

export function askConfirm({
  message = 'Confirm to continue(Yes).',
}: AskConfirmParams = {}) {
  return new Promise<boolean>((resolve, reject) => {
    vscode.window
      .showQuickPick(
        [
          { label: 'yes', value: true, picked: true },
          { label: 'no', value: false },
        ],
        {
          title: message,
          placeHolder: 'yes ore no?',
        },
      )
      .then(
        (result) => {
          if (!result) {
            reject(false);
            return;
          }

          resolve(result.value);
        },
        () => {
          reject(false);
        },
      );
  });
}
