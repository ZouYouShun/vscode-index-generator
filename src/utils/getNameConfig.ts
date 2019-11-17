import * as path from 'path';
import { camelize, firstLowerCase } from './camelize';

export const getNameConfig = (url: string) => {
  const modelName = path.basename(url);
  const camelizeName = camelize(modelName);
  const config = {
    bigName: camelizeName,
    name: firstLowerCase(camelizeName),
    dashName: modelName,
  };
  return config;
};
