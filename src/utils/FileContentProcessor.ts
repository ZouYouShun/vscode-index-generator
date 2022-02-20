import * as fs from 'fs-extra';

import { getFileTreeSync } from '../utils';

export type FileContentProcessorOptions = {
  processor?: (
    filePath: string,
    sourceContent: string,
  ) => Promise<string> | string;
  filter?: (filePath: string) => boolean;
  onSuccess?: (filePath: string) => Promise<void> | void;
  onError?: (filePath: string) => void;
  /**
   * get destination of result
   */
  getDestination?: (filePath: string, sourceContent: string) => string;
  /**
   * when content not changed, also write to destination
   */
  acceptContentNotChanged?: boolean;
};

/**
 * scan folder and process file content
 *
 * 1. change file content
 * 2. change file destination(also ext.)
 */
export class FileContentProcessor {
  error: string[] = [];

  private canceled = false;

  constructor(private options: FileContentProcessorOptions) {}

  async processFolder(folderOrFilePath: string) {
    const filePaths = (await fs.lstat(folderOrFilePath)).isDirectory()
      ? getFileTreeSync(folderOrFilePath)
      : [folderOrFilePath];

    await Promise.all(
      filePaths.map(async (filePath) => {
        if (
          this.canceled ||
          (this.options.filter && !this.options.filter(filePath))
        ) {
          return;
        }

        try {
          const content = (await fs.readFile(filePath)).toString();

          const result = this.options.processor?.(filePath, content) ?? content;

          if (!this.options.acceptContentNotChanged && result === content) {
            return;
          }

          const destination = this.options.getDestination
            ? this.options.getDestination(filePath, content)
            : filePath;

          await fs.writeFile(destination, result);

          await this.options.onSuccess?.(filePath);
        } catch (error) {
          this.options.onError?.(filePath);

          this.error.push(filePath);
        }
      }),
    );

    if (this.error.length > 0) {
      throw new Error(
        `prettier those files fail:\n\n ${this.error.join('\n')}`,
      );
    }
  }

  cancel() {
    // TODO: should make that whole process cancellable
    this.canceled = true;
  }
}
