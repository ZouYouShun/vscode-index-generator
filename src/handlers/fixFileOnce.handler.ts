import {
  checkExtensionLoaded,
  executeCommand,
  openDocument,
  sleep,
} from '../utils';

export class FixFileOnceHandler {
  get tsxFileName() {
    const regex = new RegExp(`\.js$`, 'gi');
    const toUrl = this.target.replace(regex, `.tsx`);
    return toUrl;
  }

  constructor(private target: string) {}

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

  async openFileAndFormat(target?: string) {
    await openDocument(target || this.target);
    await checkExtensionLoaded('rbbit.typescript-hero');
    await executeCommand('typescriptHero.imports.organize');
    await sleep(100);

    await checkExtensionLoaded('dbaeumer.vscode-eslint');
    await executeCommand('eslint.executeAutofix');
    await sleep(300);

    await checkExtensionLoaded('esbenp.prettier-vscode');
    await executeCommand('editor.action.formatDocument');
    await sleep(100);

    await executeCommand('workbench.action.files.saveAll');
  }
}
