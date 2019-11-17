import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

import { Lib } from '../utils/lib';
import { replaceRequireToImport } from './utils';
import { OutputChannel } from '../utils';

export interface ChangeFileHandlerOptions {
  from: string;
  to: string;
}

export class ChangeFileHandler {
  fileTree = Lib.getFileTree(this.target);

  constructor(
    private target: string,
    private options: ChangeFileHandlerOptions = {} as any,
  ) {}

  async clearEmpty() {
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

  async changeExt(cb?: (fromUrl: string) => { content: string; ext: string }) {
    this.fileTree.forEach((fromUrl) => {
      const regex = new RegExp(`\.${this.options.from}$`, 'gi');

      if (regex.test(fromUrl)) {
        let toUrl = fromUrl.replace(regex, `.${this.options.to}`);

        if (cb) {
          const result = cb(fromUrl);
          toUrl = fromUrl.replace(regex, `.${result.ext}`);

          fs.writeFileSync(toUrl, result.content);
          fs.unlinkSync(fromUrl);
        } else {
          fs.moveSync(fromUrl, toUrl, { overwrite: true });
        }

        OutputChannel.appendLine(
          `${chalk.green(`To ${path.extname(toUrl)}: `)} ${toUrl}`,
        );
      }
    });
  }

  async toTs() {
    this.options.from = 'js';

    return await this.changeExt((fromUrl) => {
      let content = replaceRequireToImport(fs.readFileSync(fromUrl).toString());
      let ext = 'ts';

      if (content.includes('React')) {
        ext = 'tsx';
      }

      return {
        content,
        ext,
      };
    });
  }
}
