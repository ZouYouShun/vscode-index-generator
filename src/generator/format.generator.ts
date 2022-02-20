import { formatSourceFromFile } from 'format-imports';
import * as fs from 'fs-extra';
import ignore from 'ignore';
import * as prettier from 'prettier';

import { FileContentProcessor, OutputChannel } from '../utils';
import { IndexIgnoreOptions } from './index.generator';
import { IndexGeneratorOptions } from './IndexGeneratorOptions';

export class FormatGenerator {
  ignore?: IndexIgnoreOptions;
  prettierConfig: any;

  ig = ignore();

  contentProcessor = new FileContentProcessor({
    processor: (filepath, content) => {
      const firstStepResult = this.options?.withImportSort
        ? this.sortContentImport(filepath, content)
        : content;

      return this.prettierContent(filepath, firstStepResult);
    },
    filter: (filePath) => {
      let checkUrl = filePath;
      if (checkUrl[0] === '/') {
        checkUrl = checkUrl.substring(1);
      }

      return !(this.ignore && this.ignore.exclude && this.ig.ignores(checkUrl));
    },
    onSuccess: (filePath) => {
      OutputChannel.appendLine(`prettier format with: ${filePath}`);
    },
    onError: (filePath) => {
      OutputChannel.appendLine(`error with ${filePath}`, { error: filePath });
    },
  });

  constructor(
    private url: string,
    private options: IndexGeneratorOptions & { withImportSort?: boolean },
  ) {
    if (options.prettierConfig && fs.existsSync(options.prettierConfig)) {
      this.prettierConfig = require(options.prettierConfig);
    }

    if (options.ignore && fs.existsSync(options.ignore)) {
      this.ignore = require(options.ignore);

      if (this.ignore?.exclude) {
        this.ig.add(this.ignore.exclude);
      }
    }
  }

  private prettierContent(filepath: string, content: string) {
    return prettier.format(content, {
      filepath,
      ...this.prettierConfig,
    });
  }

  private sortContentImport(filepath: string, content: string) {
    try {
      // FIXME: should move to config
      // when have url-loader that sort will meet problem with that
      return (
        (content.includes('!url-loader')
          ? content
          : formatSourceFromFile(content, filepath, {
              keepUnused: ['react'],
            })) || content
      );
    } catch (error) {
      console.log('!!', error);
      return content;
    }
  }

  async createFile(dirUrl = this.url) {
    await this.contentProcessor.processFolder(dirUrl);
  }

  cancel() {
    // TODO: should make that whole process cancellable
    this.contentProcessor.cancel();
  }
}
