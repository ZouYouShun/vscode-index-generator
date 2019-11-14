import * as program from 'commander';

import { IndexGenerator } from './index.generator';
import { PrettierGenerator } from './prettier.generator';
import { PhoneGenerator } from './phone.generator';

export class GeneratorEntry {
  static init() {
    program
      .command('g')
      .description('deploy the given env')
      .option('-f, --force [force]', 'Is run update force')
      .option('-i, --ignore [ignorePath]', 'Is run update force')
      .option('-p, --perttier-config [perttierConfig]', 'perttier config path')
      .option('-js, --js', 'Is js mode')
      .option('-t, --type', 'file type')
      .option('-c, --color', 'color')
      .action((action, target, options) => {
        switch (action) {
          case 'i':
          case 'index':
            new IndexGenerator(target, options).createFile();

            break;

          case 'p':
          case 'perttier':
            const errors = new PrettierGenerator(target, options).createFile();

            console.log(JSON.stringify(errors, undefined, 2));

            break;

          case 'pt':
          case 'phone-type':
            new PhoneGenerator(target, options).createFile();
            break;

          default:
            break;
        }
      });
  }
}
