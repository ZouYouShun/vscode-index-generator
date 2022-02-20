import { OutputChannel } from './../../../utils/outputCannel';
import * as vscode from 'vscode';
import { IndexGenerator } from '../../../generator';
import { IndexGeneratorOptions } from '../../../generator/IndexGeneratorOptions';
import { askTargetFolder, getWorkspacePath } from '../../../utils';
import { getConfigs } from '../../../utils/extension/getConfigs';

export async function createIndex(
  type: IndexGeneratorOptions['type'] = 'both',
  additionProps: IndexGeneratorOptions = {},
) {
  const rootPath = await getWorkspacePath();
  const { prettierConfig, ignore } = getConfigs(rootPath);

  const dirPath = await askTargetFolder();
  if (!dirPath) return;

  // TODO: should implement onlyTarget folder option

  await vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title: `Index files are creating ${dirPath} ......`,
    },
    async (process, token) => {
      token.onCancellationRequested(() => {
        return;
      });

      const indexGenerator = new IndexGenerator(dirPath, {
        force: true,
        type,
        prettierConfig,
        ignore,
        ...additionProps,
      });

      return indexGenerator.createFile();
    },
  );

  OutputChannel.appendLine('Create index successfully');
}
