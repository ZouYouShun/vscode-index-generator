import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';

import { IndexIgnoreOptions } from '../../generator/index.generator';
import { ChangeFileHandler } from '../../handlers/changeFile.handler';
import { askTargetFolder } from '../../utils';
import { getConfigs } from '../../utils/extension/getConfigs';
import { extensionNamespace } from '../../utils/extensionNamespace';

export const toTsCommand = vscode.commands.registerCommand(
  `${extensionNamespace}.toTs`,
  async () => {
    try {
      const { rootPath } = vscode.workspace;
      const { ignore } = getConfigs(rootPath!);

      let indexConfig: IndexIgnoreOptions | undefined = undefined;

      if (fs.existsSync(ignore)) {
        indexConfig = fs.readJSONSync(ignore);

        if (indexConfig) {
          const excludeItems = (indexConfig.toTs?.excludeFile || [])?.map((x) =>
            fs
              .readFileSync(path.join(rootPath!, x))
              .toString()
              .replace(/diff=nodiff/g, ''),
          );

          indexConfig = {
            ...indexConfig,
            toTs: {
              ...indexConfig.toTs,
              exclude: [...(indexConfig.toTs?.exclude || []), ...excludeItems],
            },
          };
        }
      }

      const dirPath = await askTargetFolder();
      await new ChangeFileHandler(dirPath).toTs(indexConfig);

      vscode.window.showInformationMessage(
        'change to typescript successful!',
        'OK',
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  },
);
