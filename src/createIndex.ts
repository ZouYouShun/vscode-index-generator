import * as path from 'path';
import * as vscode from 'vscode';

import { IndexGenerator } from './generator';
import { IndexGeneratorOptions } from './generator/IndexGeneratorOptions';

export function createIndex(additionProps: IndexGeneratorOptions = {}) {
  const { rootPath } = vscode.workspace;
  const perttierConfig = path.join(rootPath, '.prettierrc.js');
  const ignore = path.join(rootPath, '.indexignore.json');
  const dirPath = path.dirname(
    vscode.window.activeTextEditor.document.fileName,
  );
  new IndexGenerator(dirPath, {
    force: true,
    type: 'both',
    perttierConfig,
    ignore,
    ...additionProps,
  }).createFile();
}
