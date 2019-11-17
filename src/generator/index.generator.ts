import chalk from 'chalk';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as os from 'os';
import * as path from 'path';
import * as prettier from 'prettier';
import { IndexGeneratorOptions } from './IndexGeneratorOptions';
import { Lib } from '../utils/lib';
import { checkExtPath } from '../utils/checkExtPath';
import { OutputChannel } from '../utils';

export interface IndexIgnoreOptions {
  exclude: string[];
}

const commont = `/* Generated by cli, you can modify but don't remove this comment */`;
const hasCode = /function|const|let|class/;
// const space = `${os.EOL}${os.EOL}`;

type ConvertOptions = {
  dirUrl: string;
  dirName: string;
  ext: string;
  template: string;
  absoluteFilePath: string;
};

export class IndexGenerator {
  ig = ignore();
  ignore: IndexIgnoreOptions;

  constructor(private target: string, private options: IndexGeneratorOptions) {
    if (options.ignore && fs.existsSync(options.ignore)) {
      this.ignore = require(options.ignore);

      this.ig.add(this.ignore.exclude);
    }
  }

  createFile(dirUrl?: string) {
    if (!dirUrl) {
      dirUrl = this.target;
    }
    const filePaths = fs.readdirSync(dirUrl);

    const exportDefaultContentObj = new Set();
    const exportObjectContentObj = new Set();
    const importContentObj = new Set();

    const ext = this.options.type === 'js' ? 'js' : 'ts';

    const targetUrl = path.join(dirUrl, `index.${ext}`);

    const dirName = path.basename(dirUrl);

    let exportCount = 0;

    filePaths.forEach((filePath) => {
      const absoluteFilePath = path.join(dirUrl, filePath);

      if (this.checkPathVariable(absoluteFilePath) || filePath === 'scss') {
        return 0;
      }

      const status = fs.statSync(absoluteFilePath);
      const isDir = status.isDirectory();

      let currentDirCount = 0;

      // check is dir
      if (isDir && !this.options.onlyTarget) {
        currentDirCount = this.createFile(absoluteFilePath);
        exportCount += currentDirCount;

        if (exportCount > 0) {
          const dirIndex = path.join(absoluteFilePath, `index.${ext}`);

          if (fs.existsSync(dirIndex)) {
            const content = fs.readFileSync(dirIndex).toString();

            if (this.hasDefault(content)) {
              importContentObj.add(`import ${filePath} from './${filePath}';`);
              exportObjectContentObj.add(filePath);
            }

            if (this.checkHasOtherExport(content)) {
              exportDefaultContentObj.add(`export * from './${filePath}';`);
            }
          }
        }
      } else {
        if (this.skipInvalidFiles([ext], filePath)) {
          return 0;
        }

        const fileExt = Lib.extname(filePath);

        filePath = filePath.replace(
          new RegExp(`.${fileExt}$|.${fileExt}x$`, 'gi'),
          '',
        );

        const content = fs.readFileSync(absoluteFilePath).toString();
        if (!content) {
          return 0;
        }

        if (filePath === 'index') {
          // if there has index and the index has content, create an file with current dir and
          // if (!content.includes(commont)) {
          if (
            hasCode.test(content) ||
            (/export default/.test(content) && content.includes('(')) ||
            /export default {/.test(content)
          ) {
            if (
              this.convertIndexToFile({
                dirUrl,
                dirName,
                ext: fileExt,
                template: content,
                absoluteFilePath,
              })
            ) {
              let count = 0;
              if (this.hasDefault(content)) {
                importContentObj.add(`import ${dirName} from './${dirName}';`);
                exportDefaultContentObj.add(`export default ${dirName};`);
                count++;
              }

              if (this.checkHasOtherExport(content)) {
                exportDefaultContentObj.add(`export * from './${dirName}';`);
                count++;
              }
              if (count > 0) {
                exportCount++;
              }
            }
          }
          return exportCount;
        }

        let count = 0;
        if (this.hasDefault(content)) {
          importContentObj.add(`import ${filePath} from './${filePath}';`);

          if (filePath === dirName) {
            exportDefaultContentObj.add(`export default ${filePath};`);
          } else {
            exportObjectContentObj.add(filePath);
          }
          count++;
        }

        if (this.checkHasOtherExport(content)) {
          exportDefaultContentObj.add(`export * from './${filePath}';`);
          count++;
        }

        if (count > 0) {
          exportCount++;
        }
      }
    });

    if (exportCount > 0) {
      if (fs.existsSync(targetUrl)) {
        if (!this.options.force) {
          OutputChannel.appendLine(`${chalk.red('existed ')} ${targetUrl}`);

          return 0;
        }
        OutputChannel.appendLine(`${chalk.yellow('update ')} ${targetUrl}`);
      } else {
        OutputChannel.appendLine(`${chalk.green('create ')} ${targetUrl}`);
      }

      let perttierConfig = {};
      if (
        this.options.perttierConfig &&
        fs.existsSync(this.options.perttierConfig)
      ) {
        perttierConfig = require(this.options.perttierConfig);
      }

      try {
        const result = prettier.format(
          // commont +
          os.EOL +
            [...importContentObj].join(os.EOL) +
            os.EOL +
            os.EOL +
            exportObject(exportObjectContentObj) +
            os.EOL +
            [...exportDefaultContentObj].join(os.EOL),
          {
            parser: 'babel',
            ...perttierConfig,
          },
        );
        fs.writeFileSync(targetUrl, result);
      } catch (error) {
        OutputChannel.appendLine(`${chalk.red('fail: ')} ${targetUrl}`);
      }
    }

    return exportCount;
  }

  private hasDefault(content: string) {
    return content.includes('export default') || content.includes('as default');
  }

  private checkHasOtherExport(content: string) {
    return content
      .replace(/export default|as default/gi, '')
      .includes('export ');
  }

  private convertIndexToFile({
    dirUrl,
    dirName,
    ext,
    template,
    absoluteFilePath,
  }: ConvertOptions) {
    const dirTargetUrl = path.join(dirUrl, `${dirName}.${ext}`);

    Lib.deleteFile(absoluteFilePath);

    if (!fs.existsSync(dirTargetUrl)) {
      fs.writeFileSync(dirTargetUrl, template);
      OutputChannel.appendLine(
        `${chalk.yellow(
          'rename file: ',
        )} ${absoluteFilePath} => ${dirTargetUrl}`,
      );
      return true;
    } else {
      return false;
    }
  }

  private skipInvalidFiles(exts: string[], filePath: string) {
    if (this.options.type === 'both' || !this.options.type) {
      exts = ['js', 'ts'];
    }

    return checkExtPath(exts, filePath);
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

function exportObject(exportObjectContentObj: Set<unknown>) {
  return exportObjectContentObj.size > 0
    ? `export {
  ${[...exportObjectContentObj].join(',' + os.EOL + '  ')}
}`
    : '';
}
