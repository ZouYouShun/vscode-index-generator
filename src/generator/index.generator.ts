import { formatSourceFromFile } from 'format-imports';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as os from 'os';
import * as path from 'path';
import * as prettier from 'prettier';

import { camelize, OutputChannel, validateExtPath } from '../utils';
import { IndexGeneratorOptions } from './IndexGeneratorOptions';

export interface IndexIgnoreOptions {
  exclude?: string[];
  toTs?: { include?: string[]; exclude?: string[]; excludeFile?: string[] };
}

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

  async createFile(dirUrl: string = this.target) {
    const filePaths = await fs.readdir(dirUrl);

    const exportAllSet = new Set<string>();
    const exportAsDefaultSet = new Set<string>();

    const checkExportCount = ({
      content,
      filename,
    }: {
      content: string;
      filename: string;
    }) => {
      let count = 0;
      if (this.hasExportDefault(content)) {
        exportAsDefaultSet.add(filename);
        count++;
      }

      if (this.hasOtherExport(content)) {
        exportAllSet.add(filename);
        count++;
      }

      if (count > 0) exportCount++;
    };

    const ext = this.options.type === 'js' ? 'js' : 'ts';

    const targetIndexPath = path.join(dirUrl, `index.${ext}`);

    const isIndexExist = await fs.pathExists(targetIndexPath);

    if (isIndexExist && !this.options.force) {
      OutputChannel.appendLine(`existed ${targetIndexPath}`);

      return 0;
    }

    const dirName = path.basename(dirUrl);

    let exportCount = 0;

    for (const filename of filePaths) {
      const absoluteFilePath = path.join(dirUrl, filename);

      if (this.validatePath(absoluteFilePath)) continue;

      const status = await fs.stat(absoluteFilePath);
      const isDir = status.isDirectory();

      if (isDir) {
        if (!this.options.onlyTarget) {
          exportCount += await this.createFile(absoluteFilePath);
        }

        const childrenFolderIndexPath = path.join(
          absoluteFilePath,
          `index.${ext}`,
        );

        // * check children folder index have export
        if (await fs.pathExists(childrenFolderIndexPath)) {
          const content = (
            await fs.readFile(childrenFolderIndexPath)
          ).toString();

          checkExportCount({ content, filename });
        }
      } else {
        const validateFileExt = this.validateExtPath([ext], filename);
        if (!validateFileExt) continue;

        const content = (await fs.readFile(absoluteFilePath)).toString();
        if (content.trim() === '') continue;

        const fileParsedPath = path.parse(filename);

        const currFileName = fileParsedPath.name;

        if (currFileName === 'index') {
          // * if there has index and the index has content, and have export create an file with current dir
          if (
            /(function )|(const )|(let )|(class )/.test(content) ||
            (/export default/.test(content) && content.includes('(')) ||
            /export default {/.test(content)
          ) {
            const folderMainFilePath = path.join(
              dirUrl,
              `${dirName}${fileParsedPath.ext}`,
            );

            await fs.move(absoluteFilePath, folderMainFilePath);

            checkExportCount({ content, filename: dirName });
          }
        } else {
          checkExportCount({ content, filename: currFileName });
        }
      }
    }

    if (exportCount === 0) return exportCount;

    try {
      let importDefaultThenExportContent = '';

      const exportDefaultChildrenLength = exportAsDefaultSet.size;
      // when bigger than 1, should import then export all
      if (exportDefaultChildrenLength > 0) {
        // ignore dir export
        const importPaths = [...exportAsDefaultSet].filter(
          (x) => x !== dirName,
        );

        importDefaultThenExportContent = importPaths
          .map((x) => `export { default as ${camelize(x)} } from './${x}';`)
          .join(os.EOL);
      }

      const exportAllContent = [...exportAllSet]
        .map((x) => `export * from './${x}';`)
        .join(os.EOL);

      const shouldExportDefaultFolder = [...exportAsDefaultSet].some(
        (x) => x === dirName,
      );

      const exportAsDefaultContent = shouldExportDefaultFolder
        ? `export { ${camelize(dirName)} as default } from './${dirName}';`
        : '';

      const template = `
          ${exportAllContent}
          ${os.EOL}
          ${os.EOL}
          ${importDefaultThenExportContent}
          ${os.EOL}
          ${os.EOL}
          ${exportAsDefaultContent}`;

      const sortResult =
        formatSourceFromFile(template, targetIndexPath, {
          keepUnused: ['react'],
        }) || template;

      const result = prettier.format(sortResult, {
        filepath: targetIndexPath,
        ...(await this.getPrettierConfig()),
      });

      await fs.writeFile(targetIndexPath, result);

      OutputChannel.appendLine(
        `${isIndexExist ? 'update' : 'create'} ${targetIndexPath}`,
      );
    } catch (error) {
      OutputChannel.appendLine(`fail: ${targetIndexPath}`, { error });
      throw error;
    }

    return exportCount;
  }

  private async getPrettierConfig() {
    if (
      this.options.prettierConfig &&
      (await fs.pathExists(this.options.prettierConfig))
    ) {
      return require(this.options.prettierConfig);
    }

    return {};
  }

  private hasExportDefault(content: string) {
    return /export default | as default /.test(content);
  }

  private hasOtherExport(content: string) {
    return content
      .replace(/export default| as default /, '')
      .includes('export ');
  }

  private validateExtPath(exts: string[], filePath: string) {
    if (this.options.type === 'both' || !this.options.type) {
      exts = ['js', 'ts'];
    }

    const includeExts = exts.reduce((acc, curr) => {
      acc.push(curr, `${curr}x`);
      return acc;
    }, [] as string[]);

    const excludeExts = exts.reduce(
      (acc, curr) => {
        acc.push(
          `test.${curr}`,
          `test.${curr}x`,
          `spec.${curr}`,
          `spec.${curr}x`,
        );
        return acc;
      },
      ['.d.ts'],
    );

    return validateExtPath(filePath, {
      includeExts,
      excludeExts,
      excludePrivatePrefix: ['_'],
    });
  }

  private validatePath(filePath: string) {
    let checkUrl = filePath;
    if (checkUrl[0] === '/') {
      checkUrl = checkUrl.substring(1);
    }

    return (
      (this.ignore &&
        this.ignore.exclude &&
        this.ig.ignores(path.join(checkUrl))) ||
      filePath === 'scss'
    );
  }
}
