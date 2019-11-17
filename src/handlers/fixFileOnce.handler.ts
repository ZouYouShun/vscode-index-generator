import {
  checkExtensionLoaded,
  executeCommand,
  openDocument,
  sleep,
} from '../utils';

export class FixFileOnceHandler {
  constructor(private target: string) {}

  async fixFile() {
    await checkExtensionLoaded(
      'mohsen1.react-javascript-to-typescript-transform-vscode',
    );

    await executeCommand('extension.convertReactToTypeScript');

    const regex = new RegExp(`\.js$`, 'gi');
    const toUrl = this.target.replace(regex, `.tsx`);
    await openDocument(toUrl);

    await checkExtensionLoaded('rbbit.typescript-hero');
    await executeCommand('typescriptHero.imports.organize');

    // await sleep(300);

    await checkExtensionLoaded('esbenp.prettier-vscode');
    await executeCommand('editor.action.formatDocument');
    await executeCommand('workbench.action.files.saveAll');

    // await sleep(500);
  }
}
