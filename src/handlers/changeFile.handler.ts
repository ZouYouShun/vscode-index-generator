import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

import {
  checkExtensionLoaded,
  executeCommand,
  extensionNamespace,
  openDocument,
  OutputChannel,
  sleep,
} from '../utils';
import { Lib } from '../utils/lib';
import { replaceRequireToImport } from './utils';

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

  async changeExt(
    cb?: (fromUrl: string) => Promise<{ content: string; ext: string }>,
  ) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async formatTsCode() {
    try {
      for (const fromUrl of this.fileTree) {
        if (new RegExp(`\.ts$|\.tsx$`, 'gi').test(fromUrl)) {
          await openDocument(fromUrl);
          sleep(100);

          await checkExtensionLoaded('rbbit.typescript-hero');
          await executeCommand('typescriptHero.imports.organize');
          sleep(300);

          await checkExtensionLoaded('esbenp.prettier-vscode');
          await executeCommand('editor.action.formatDocument');
          sleep(300);

          await executeCommand('workbench.action.files.saveAll');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async toTs() {
    this.options.from = 'js';

    return await this.changeExt(async (fromUrl) => {
      let content = replaceRequireToImport(fs.readFileSync(fromUrl).toString());
      let ext = 'ts';

      if (content.includes('React')) {
        ext = 'tsx';
        await openDocument(fromUrl);

        await checkExtensionLoaded(
          'mohsen1.react-javascript-to-typescript-transform-vscode',
        );

        await executeCommand('extension.convertReactToTypeScript');

        const regex = new RegExp(`\.${this.options.from}$`, 'gi');
        const toUrl = fromUrl.replace(regex, `.tsx`);
        await openDocument(toUrl);

        await checkExtensionLoaded('rbbit.typescript-hero');
        await executeCommand('typescriptHero.imports.organize');

        // TODO: change type to interface, and add config to do this.

        await checkExtensionLoaded('esbenp.prettier-vscode');
        await executeCommand('editor.action.formatDocument');

        await checkExtensionLoaded('dbaeumer.vscode-eslint');
        await executeCommand('eslint.executeAutofix');

        // await sleep(500);
        // await executeCommand('editor.action.selectAll');
        // await executeCommand(`${extensionNamespace}.switchTypeInterface`);

        await executeCommand('workbench.action.files.saveAll');

        content = undefined;
      }

      return {
        content,
        ext,
      };
    });
  }
}
