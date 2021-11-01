import chalk from 'chalk';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as path from 'path';
import * as prettier from 'prettier';
import { IndexGeneratorOptions } from './IndexGeneratorOptions';
import { IndexIgnoreOptions } from './index.generator';
import { OutputChannel } from '../utils';

export class PrettierGenerator {
  url: string;
  ignore?: IndexIgnoreOptions;
  perttierConfig: any;
  error: string[] = [];

  ig = ignore();

  constructor(target: string, options: IndexGeneratorOptions) {
    this.url = target;

    if (options.prettierConfig && fs.existsSync(options.prettierConfig)) {
      this.perttierConfig = require(options.prettierConfig);
    }

    if (options.ignore && fs.existsSync(options.ignore)) {
      this.ignore = require(options.ignore);

      if (this.ignore?.exclude) {
        this.ig.add(this.ignore.exclude);
      }
    }
  }

  createFile(dirUrl?: string) {
    if (!dirUrl) {
      dirUrl = this.url;
    }
    const filePaths = fs.readdirSync(dirUrl);

    filePaths.forEach((filePath) => {
      const absoluteFilePath = path.join(dirUrl!, filePath);
      try {
        const status = fs.statSync(absoluteFilePath);

        if (this.checkPathVariable(absoluteFilePath)) {
          return 0;
        }

        const isDir = status.isDirectory();

        if (isDir) {
          this.createFile(absoluteFilePath);
        } else {
          const content = fs.readFileSync(absoluteFilePath).toString();
          const result = this.getPrettierResult(absoluteFilePath, content);

          if (result) {
            OutputChannel.appendLine(
              `${chalk.green('prettier format with: ')} ${absoluteFilePath}`,
            );

            fs.writeFileSync(absoluteFilePath, result);
          }
        }
      } catch (error) {
        OutputChannel.appendLine(
          `${chalk.red('error with ')} ${absoluteFilePath}`,
        );
        this.error.push(absoluteFilePath);
      }
    });
    return this.error;
  }

  private getPrettierResult(absoluteFilePath: string, content: string) {
    let result = '';
    if (
      new RegExp(`\.ts$|\.tsx$`, 'gi').test(absoluteFilePath) &&
      !new RegExp(`\.d\.ts$`, 'gi').test(absoluteFilePath)
    ) {
      result = prettier.format(content, {
        parser: 'typescript',
        ...this.perttierConfig,
      });
    } else if (new RegExp(`\.js$|\.jsx$`, 'gi').test(absoluteFilePath)) {
      result = prettier.format(content, {
        parser: 'babylon',
        ...this.perttierConfig,
      });
    }
    return result;
  }

  private checkPathVariable(fileUrl: string) {
    let checkUrl = fileUrl;
    if (checkUrl[0] === '/') {
      checkUrl = checkUrl.substring(1);
    }

    return (
      this.ignore && this.ignore.exclude && this.ig.ignores(path.join(checkUrl))
    );
  }
}
