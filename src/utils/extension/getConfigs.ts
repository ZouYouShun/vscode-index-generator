import * as path from 'path';

export function getConfigs(rootPath: string) {
  const prettierConfig = path.join(rootPath, '.prettierrc.js');
  const ignore = path.join(rootPath, '.indexignore.json');
  return { prettierConfig, ignore };
}
