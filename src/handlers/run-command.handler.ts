import {
  checkExtensionLoaded,
  executeCommand,
  openDocument,
  sleep,
} from '../utils';

export class RunCommandHandler {
  constructor(private target?: string) {}

  async openAndRun(commands: string[], timer = 300) {
    if (!this.target) {
      return;
    }
    await openDocument(this.target);
    for (const command of commands) {
      await executeCommand(command);

      if (timer > 0) await sleep(timer);
    }
  }

  async openFileAndFormat({ sort = true }: { sort?: boolean } = {}) {
    if (this.target) {
      await openDocument(this.target);
    }

    try {
      if (sort) {
        await this.sort();
      }

      await this.format();
    } catch (error) {
      console.log(`format and sort file error: ${this.target}`);
    }
  }

  private async format() {
    await checkExtensionLoaded('esbenp.prettier-vscode');
    await executeCommand('editor.action.formatDocument');
  }

  private async sort() {
    await checkExtensionLoaded('dozerg.tsimportsorter');
    await executeCommand('tsImportSorter.command.sortImports');
  }
}
