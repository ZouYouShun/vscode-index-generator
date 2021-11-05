import {
  checkExtensionLoaded,
  executeCommand,
  openDocument,
  sleep,
} from '../utils';

export class FixFileOnceHandler {
  get tsxFileName() {
    if (!this.target) {
      return;
    }
    const regex = new RegExp(`${this.replaceRegex}$`, 'gi');
    const toUrl = this.target.replace(regex, `.tsx`);
    return toUrl;
  }

  constructor(private target?: string, private replaceRegex: string = 'js') {}

  async toTs() {
    if (!this.target) {
      return;
    }
    await openDocument(this.target);

    try {
      await checkExtensionLoaded(
        'mohsen1.react-javascript-to-typescript-transform-vscode',
      );
      await executeCommand('extension.convertReactToTypeScript');
    } catch (error) {
      console.log(`convert to ts has problem but convert success.`);
    }

    // await this.openFileAndFormat({ target: this.tsxFileName });
  }

  async openAndRun(commands: string[]) {
    if (!this.target) {
      return;
    }
    await openDocument(this.target);
    for (const command of commands) {
      await executeCommand(command);
      await sleep(300);
    }
  }

  async openFileAndFormat({
    target,
    sort = true,
  }: { target?: string; sort?: boolean } = {}) {
    await openDocument(target || this.target!);
    try {
      if (sort) {
        await this.formatAndSort();
      } else {
        await this.format();
      }
    } catch (error) {
      console.log(`format and sort file error: ${target || this.target!}`);
    }
  }

  async format() {
    await checkExtensionLoaded('esbenp.prettier-vscode');
    await executeCommand('editor.action.formatDocument');
  }

  async formatAndSort() {
    await checkExtensionLoaded('dozerg.tsimportsorter');
    await executeCommand('tsImportSorter.command.sortImports');
    // await sleep(300);

    await this.format();
  }
}
