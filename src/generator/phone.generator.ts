// (use.*)+(},)
import * as path from 'path';
import * as prettier from 'prettier';

import { Lib } from '../utils/lib';
import { IndexGeneratorOptions } from './IndexGeneratorOptions';

export class PhoneGenerator {
  dirs: string[];
  importObj: string[] = [];
  exportObj: string[] = [];

  constructor(private target: string, private options: IndexGeneratorOptions) {
    this.dirs = Lib.getFileTree(target, true);
  }

  createFile() {
    const modules = this.dirs.forEach(dir => {
      const dirName = path.basename(dir);
      this.importObj.push(`import { ${dirName} } from './${dirName}';`);
      this.exportObj.push(`${Lib.firstLowerCase(dirName)}: ${dirName};`);
    });
    // console.log(modules);

    let perttierConfig = {};
    if (this.options.perttierConfig) {
      perttierConfig = require(this.options.perttierConfig);
    }

    const result = prettier.format(
      `import { DefineType } from 'foundation-module/lib';

      ${this.importObj.join('')}

      export type Phone = DefineType<{
        ${this.exportObj.join('')}
      }>;
      `,
      {
        parser: 'typescript',
        ...perttierConfig
      }
    );

    Lib.writeFile(path.join(this.target, 'Phone.type.ts'), result);
  }
}
