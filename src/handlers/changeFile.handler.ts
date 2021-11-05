import chalk from 'chalk';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as path from 'path';
import { IndexIgnoreOptions } from '../generator/index.generator';

import { OutputChannel } from '../utils';
import { Lib } from '../utils/lib';
import { FixFileOnceHandler } from './fixFileOnce.handler';
import { replaceRequireToImport } from './utils';

export interface ChangeFileHandlerOptions {
  from: string;
  to: string;
}

export class ChangeFileHandler {
  fileTree = Lib.getFileTree(this.target, this.isDir);

  noInclude = true;

  ig = ignore();
  gitIg = ignore();

  constructor(
    private target: string,
    private options: ChangeFileHandlerOptions = {} as any,
    private isDir: boolean = false,
  ) {}

  async clearEmptyFolder() {
    this.fileTree.forEach((url) => {
      const stats = fs.statSync(url);
      const file = path.parse(url);
      if (stats.isDirectory() && !file.ext) {
        const child = Lib.getFileTree(url);
        if (child.length === 0) {
          Lib.deleteDir(url);
          OutputChannel.appendLine(`${chalk.green('delete dir ')} ${url}`);
        }
      }
    });
  }

  async changeExt(
    cb?: (
      fromUrl: string,
    ) => Promise<{ content: string | undefined; ext: string }>,
  ) {
    for (const fromUrl of this.fileTree) {
      const regex = new RegExp(`\.${this.options.from}$`, 'gi');

      let checkUrl = fromUrl;
      if (checkUrl[0] === '/') {
        checkUrl = checkUrl.substring(1);
      }

      const isInclude = this.noInclude || this.ig.ignores(checkUrl);
      const isExclude = this.gitIg.ignores(checkUrl);

      if (regex.test(fromUrl) && isInclude && !isExclude) {
        let toUrl = fromUrl.replace(regex, `.${this.options.to}`);

        if (cb) {
          const result = await cb(fromUrl);
          toUrl = fromUrl.replace(regex, `.${result.ext}`);

          // when have content mean that change from own script, others call from toTs extension, so do nothing
          if (result.content) {
            if (fs.existsSync(fromUrl)) {
              fs.moveSync(fromUrl, toUrl);
              fs.writeFileSync(toUrl, result.content);
              //
              // await new FixFileOnceHandler(toUrl).openFileAndFormat({
              //   // sort: false,
              // });
            }
          }
        } else {
          fs.moveSync(fromUrl, toUrl, { overwrite: true });
        }

        OutputChannel.appendLine(
          `${chalk.green(`To ${path.extname(toUrl)}: `)} ${toUrl}`,
        );
      }
    }
  }

  async openAndRun(commands: string[]) {
    for (const fromUrl of this.fileTree) {
      await new FixFileOnceHandler(fromUrl).openAndRun(commands);
    }
  }

  async formatTsCode() {
    for (const fromUrl of this.fileTree) {
      if (new RegExp(`\.ts$|\.tsx$`, 'gi').test(fromUrl)) {
        await new FixFileOnceHandler(fromUrl).openFileAndFormat();
      }
    }
  }

  async toTs(config?: IndexIgnoreOptions) {
    this.options.from = '\\.jsx|\\.js';

    if (config?.toTs?.include && config.toTs.include.length > 0) {
      this.ig.add(config.toTs.include);
      this.noInclude = false;
    }

    if (config?.toTs?.exclude) {
      for (const iterator of config.toTs.exclude) {
        this.gitIg.add(iterator);
      }
    }

    return await this.changeExt(async (fromUrl) => {
      let content: string | undefined = replaceRequireToImport(
        fs.readFileSync(fromUrl).toString(),
      );
      let ext = 'ts';

      if (content.includes(' React ') || content.includes(' React,')) {
        ext = 'tsx';

        await new FixFileOnceHandler(fromUrl, this.options.from).toTs();

        content = undefined;
      }

      return {
        content,
        ext,
      };
    });
  }
}
