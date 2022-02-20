import * as vscode from 'vscode';

import { ChangeFileHandler } from '../../handlers';
import { askTargetFolder, showInputBox } from '../../utils';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const openAndRunCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.openAndRun`,
  async () => {
    try {
      const [dirPath, vscodeCommands] = await Promise.all([
        askTargetFolder(),
        vscode.commands.getCommands(true),
      ]);

      if (!dirPath) return;

      const message =
        'Please enter command you want to run for below each files, use ; to separate commands';

      const cmd = await vscode.window.showQuickPick(
        ['editor.action.formatDocument', ...vscodeCommands],
        {
          title: message,
          placeHolder: message,
        },
      );

      if (!cmd) return;

      const commands = cmd
        .split(';')
        .map((x) => x.trim())
        .filter((x) => !!x);

      if (commands.length === 0) return;

      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: `open all file under folder ${dirPath} run ${cmd} ......`,
        },
        async (process, token) => {
          token.onCancellationRequested(() => {
            return;
          });

          await new ChangeFileHandler(dirPath).openAndRun(commands);
        },
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
