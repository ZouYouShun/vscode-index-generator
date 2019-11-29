import * as vscode from 'vscode';

import { IndexGenerator } from '../../../generator';
import { IndexGeneratorOptions } from '../../../generator/IndexGeneratorOptions';
import { askTargetFolder } from '../../../utils';
import { getConfigs } from '../../../utils/extension/getConfigs';

export async function createIndex(
  type: IndexGeneratorOptions['type'] = 'both',
  additionProps: IndexGeneratorOptions = {},
) {
  const { rootPath } = vscode.workspace;
  const { perttierConfig, ignore } = getConfigs(rootPath);

  const dirPath = await askTargetFolder();
  try {
    new IndexGenerator(dirPath, {
      force: true,
      type,
      perttierConfig,
      ignore,
      ...additionProps,
    }).createFile();
  } catch (error) {}
}
