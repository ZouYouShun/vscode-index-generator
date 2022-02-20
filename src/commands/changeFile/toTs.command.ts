import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { IndexIgnoreOptions } from '../../generator/index.generator';
import { ChangeFileHandler } from '../../handlers/changeFile.handler';
import { askTargetFolder, getWorkspacePath } from '../../utils';
import { getConfigs } from '../../utils/extension/getConfigs';
import { extensionNamespace } from '../../utils/extensionNamespace';

function getIndexConfig(rootPath: string) {
  const { ignore } = getConfigs(rootPath);

  if (fs.existsSync(ignore)) {
    const indexConfig: IndexIgnoreOptions = fs.readJSONSync(ignore);

    if (indexConfig) {
      const excludeItems = (indexConfig.toTs?.excludeFile || [])?.map((x) =>
        fs
          .readFileSync(path.join(rootPath!, x))
          .toString()
          .replace(/diff=nodiff/g, ''),
      );

      return {
        ...indexConfig,
        toTs: {
          ...indexConfig.toTs,
          exclude: [...(indexConfig.toTs?.exclude || []), ...excludeItems],
        },
      };
    }
  }
  return undefined;
}

export const toTsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.toTs`,
  async () => {
    try {
      const rootPath = await getWorkspacePath();
      const dirPath = await askTargetFolder();
      if (!dirPath) return;

      await runToTs(rootPath, dirPath);
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);

export async function runToTs(rootPath: string, dirPath: string) {
  let indexConfig = getIndexConfig(rootPath);

  await vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title: `change file to ts ......`,
    },
    (process, token) => {
      token.onCancellationRequested(() => {
        return;
      });

      return new ChangeFileHandler(dirPath).toTs(indexConfig);
    },
  );
}
