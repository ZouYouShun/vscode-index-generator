import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

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
    cb?: (fromUrl: string) => Promise<{ content: string; ext: string }>,
  ) {
    for (const fromUrl of this.fileTree) {
      const regex = new RegExp(`\.${this.options.from}$`, 'gi');

      if (regex.test(fromUrl)) {
        let toUrl = fromUrl.replace(regex, `.${this.options.to}`);

        if (cb) {
          const result = await cb(fromUrl);
          toUrl = fromUrl.replace(regex, `.${result.ext}`);

          if (result.content) {
            fs.writeFileSync(toUrl, result.content);

            if (fs.existsSync(fromUrl)) {
              fs.unlinkSync(fromUrl);
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

  async toTs() {
    this.options.from = '\\.jsx|\\.js';

    return await this.changeExt(async (fromUrl) => {
      let content = replaceRequireToImport(fs.readFileSync(fromUrl).toString());
      let ext = 'ts';

      if (content.includes('React')) {
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
