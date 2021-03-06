import {
  checkExtensionLoaded,
  executeCommand,
  openDocument,
  sleep,
} from '../utils';

export class FixFileOnceHandler {
  get tsxFileName() {
    const regex = new RegExp(`${this.replaceRegex}$`, 'gi');
    const toUrl = this.target.replace(regex, `.tsx`);
    return toUrl;
  }

  constructor(private target?: string, private replaceRegex: string = 'js') {}

  async toTs() {
    await openDocument(this.target);

    await checkExtensionLoaded(
      'mohsen1.react-javascript-to-typescript-transform-vscode',
    );

    try {
      await executeCommand('extension.convertReactToTypeScript');
    } catch (error) {
      console.log(`convert to ts has problem but convert success.`);
    }

    await this.openFileAndFormat(this.tsxFileName);
  }

  async openAndRun(commands: string[]) {
    await openDocument(this.target);
    for (const command of commands) {
      await executeCommand(command);
      await sleep(300);
    }
  }

  async openFileAndFormat(target?: string) {
    await openDocument(target || this.target);
    await this.formatAndSort();
  }

  async formatAndSort() {
    await checkExtensionLoaded('rbbit.typescript-hero');
    await executeCommand('typescriptHero.imports.organize');
    await sleep(300);

    await checkExtensionLoaded('esbenp.prettier-vscode');
    await executeCommand('editor.action.formatDocument');
  }
}
