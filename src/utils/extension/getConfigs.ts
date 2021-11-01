import * as path from 'path';

export function getConfigs(rootPath: string) {
  const prettierConfig = path.join(rootPath, '.prettierrc.js');
  const ignore = path.join(rootPath, '.indexignore.json');
  const gitignore = path.join(rootPath, '.gitignore');
  return { prettierConfig, ignore, gitignore };
}
