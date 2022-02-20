import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as path from 'path';

import { IndexIgnoreOptions } from '../generator/index.generator';
import { FileContentProcessor, getFileTreeSync, OutputChannel } from '../utils';
import { validateExtPath } from '../utils';
import { RunCommandHandler } from './run-command.handler';
import {
  putComponentExportDefaultAtEnd,
  replaceRequireToImport,
} from './utils';

export class ChangeFileHandler {
  fileTree = getFileTreeSync(this.target, { onlyFolder: this.onlyFolder });

  ig = ignore();
  gitIg = ignore();

  constructor(private target: string, private onlyFolder = false) {}

  async clearEmptyFolder() {
    // that fileTree will start from deep folder, so delete directly is ok
    this.fileTree.forEach((url) => {
      const child = getFileTreeSync(url);

      if (child.length > 0) return;

      fs.removeSync(url);
      OutputChannel.appendLine(`delete dir ${url}`);
    });
  }

  /**
   * open that file and run each commands one by one
   */
  async openAndRun(commands: string[]) {
    for (const fromUrl of this.fileTree) {
      await new RunCommandHandler(fromUrl).openAndRun(commands);
    }
  }

  /**
   * open that file and run each commands one by one
   */
  async changeExt({ from: fromExt, to: toExt }: { from: string; to: string }) {
    const processor = new FileContentProcessor({
      acceptContentNotChanged: true,
      getDestination: (filepath) => {
        const ext = path.extname(filepath);

        return filepath.replace(ext, `.${toExt}`);
      },
      filter: (filePath) => {
        return validateExtPath(filePath, { includeExts: [fromExt] });
      },
      onSuccess: async (filePath) => {
        await fs.remove(filePath);

        OutputChannel.appendLine(`to ${toExt} success: ${filePath}`);
      },
      onError: (filePath) => {
        OutputChannel.appendLine(`error with ${filePath}`, { error: filePath });
      },
    });

    await processor.processFolder(this.target);
  }

  async toTs(config?: IndexIgnoreOptions) {
    const hasInclude = config?.toTs?.include && config.toTs.include.length > 0;

    if (hasInclude) {
      this.ig.add(config!.toTs!.include!);
    }

    if (config?.toTs?.exclude) {
      for (const iterator of config.toTs.exclude) {
        this.gitIg.add(iterator);
      }
    }

    const processor = new FileContentProcessor({
      acceptContentNotChanged: true,
      processor: (filepath, content) => {
        content = replaceRequireToImport(content);
        content = putComponentExportDefaultAtEnd(content);

        return content;
      },
      getDestination: (filepath, content) => {
        const ext = path.extname(filepath);

        const toExt = / React,| React |'react'/.test(content) ? '.tsx' : '.ts';

        return filepath.replace(ext, toExt);
      },
      filter: (filePath) => {
        let checkUrl = filePath;

        // ignore first / to make ignore work correct
        if (checkUrl[0] === '/') {
          checkUrl = checkUrl.substring(1);
        }

        const isInclude = hasInclude ? this.ig.ignores(checkUrl) : true;
        const isExclude = this.gitIg.ignores(checkUrl);

        return isInclude && !isExclude && /\.jsx|\.js/.test(filePath);
      },
      onSuccess: async (filePath) => {
        await fs.remove(filePath);

        OutputChannel.appendLine(`to ts success: ${filePath}`);
      },
      onError: (filePath) => {
        OutputChannel.appendLine(`error with ${filePath}`, { error: filePath });
      },
    });

    await processor.processFolder(this.target);
  }
}
