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
  const { prettierConfig, ignore } = getConfigs(rootPath);

  const dirPath = await askTargetFolder();

  new IndexGenerator(dirPath, {
    force: true,
    type,
    prettierConfig,
    ignore,
    ...additionProps,
  }).createFile();
}
