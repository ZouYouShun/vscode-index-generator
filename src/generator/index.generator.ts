import chalk from 'chalk';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as os from 'os';
import * as path from 'path';
import * as prettier from 'prettier';

import { OutputChannel } from '../utils';
import { checkExtPath } from '../utils/checkExtPath';
import { Lib } from '../utils/lib';
import { IndexGeneratorOptions } from './IndexGeneratorOptions';

export interface IndexIgnoreOptions {
  exclude?: string[];
  toTs?: { include?: string[]; exclude?: string[]; excludeFile?: string[] };
}

type ConvertOptions = {
  dirUrl: string;
  dirName: string;
  ext: string;
  template: string;
  absoluteFilePath: string;
};

export class IndexGenerator {
  ig = ignore();
  ignore?: IndexIgnoreOptions;

  constructor(private target: string, private options: IndexGeneratorOptions) {
    if (options.ignore && fs.existsSync(options.ignore)) {
      this.ignore = fs.readJSONSync(options.ignore);

      if (this.ignore?.exclude) {
        this.ig.add(this.ignore.exclude);
      }
    }
  }

  createFile(dirUrl?: string) {
    if (!dirUrl) {
      dirUrl = this.target;
    }
    const filePaths = fs.readdirSync(dirUrl);

    let dirDefaultName: string | undefined = undefined;
    const exportAllSet = new Set();
    const exportAsDefaultSet = new Set();

    const ext = this.options.type === 'js' ? 'js' : 'ts';

    const targetUrl = path.join(dirUrl, `index.${ext}`);

    const dirName = path.basename(dirUrl);

    let exportCount = 0;

    filePaths.forEach((filePath) => {
      const absoluteFilePath = path.join(dirUrl!, filePath);

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

          // * check current index have export
          if (fs.existsSync(dirIndex)) {
            const content = fs.readFileSync(dirIndex).toString();

            if (this.hasDefault(content)) {
              exportAsDefaultSet.add(filePath);
            }

            if (this.checkHasOtherExport(content)) {
              exportAllSet.add(filePath);
            }
          }
        }
      } else {
        if (this.skipInvalidFiles([ext], filePath)) {
          return 0;
        }

        const content = fs.readFileSync(absoluteFilePath).toString();
        if (content === '') {
          return 0;
        }

        const fileParsedPath = path.parse(filePath);

        const fileExt = fileParsedPath.ext.replace('.', '');
        const fileName = fileParsedPath.name;

        if (fileName === 'index') {
          // * if there has index and the index has content, and have export create an file with current dir
          if (
            /(function )|(const )|(let )|(class )/.test(content) ||
            (/export default/.test(content) && content.includes('(')) ||
            /export default {/.test(content)
          ) {
            if (
              this.convertIndexToFile({
                dirUrl: dirUrl!,
                dirName,
                ext: fileExt,
                template: content,
                absoluteFilePath,
              })
            ) {
              let count = 0;
              if (this.hasDefault(content)) {
                exportAsDefaultSet.add(fileName);
                count++;
              }

              if (this.checkHasOtherExport(content)) {
                exportAllSet.add(dirName);
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
          // * if that file is same as current dir reexport default that
          if (fileName === dirName) {
            dirDefaultName = fileName;
          } else {
            exportAsDefaultSet.add(fileName);
          }
          count++;
        }

        if (this.checkHasOtherExport(content)) {
          exportAllSet.add(fileName);
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

      try {
        const exportAsContent = [...exportAsDefaultSet]
          .map((x) => `export { default as ${x} } from './${x}';`)
          .join(os.EOL);

        const exportAllContent = [...exportAllSet]
          .map((x) => `export * from './${x}';`)
          .join(os.EOL);

        const { defaultExportContent, importContent } = (() => {
          if (dirDefaultName) {
            return {
              importContent:
                `import ${dirDefaultName} from './${dirDefaultName}';` +
                os.EOL +
                os.EOL,
              defaultExportContent:
                exportObject(new Set([dirDefaultName])) +
                os.EOL +
                `export default ${dirDefaultName};`,
            };
          }
          return {
            importContent: '',
            defaultExportContent: '',
          };
        })();

        const result = prettier.format(
          importContent +
            exportAsContent +
            os.EOL +
            exportAllContent +
            os.EOL +
            defaultExportContent,
          {
            parser: 'babel',
            ...this.getPrettierConfig(),
          },
        );

        fs.writeFileSync(targetUrl, result);
      } catch (error) {
        OutputChannel.appendLine(`${chalk.red('fail: ')} ${targetUrl}`);
      }
    }

    return exportCount;
  }

  private getPrettierConfig() {
    if (
      this.options.prettierConfig &&
      fs.existsSync(this.options.prettierConfig)
    ) {
      return require(this.options.prettierConfig);
    }

    return {};
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

function exportObject(exportSet: Set<unknown>) {
  return exportSet.size > 0
    ? `export {
  ${[...exportSet].join(`,${os.EOL}  `)}
}`
    : '';
}
