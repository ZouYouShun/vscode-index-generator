import * as path from 'path';

export function getConfigs(rootPath: string) {
  const perttierConfig = path.join(rootPath, '.prettierrc.js');
  const ignore = path.join(rootPath, '.indexignore.json');
  return { perttierConfig, ignore };
}
