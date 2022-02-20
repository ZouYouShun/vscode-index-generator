import * as vscode from 'vscode';

import {
  camelizeCommand,
  changeExtCommand,
  clearEmptyFolderCommand,
  createIndexCommand,
  createIndexOnlyTargetCommand,
  formatCommand,
  formatSortTsOnceCommand,
  openAndRunCommand,
  switchTypeInterfaceCommand,
  toTsCommand,
} from './commands';
import { OutputChannel } from './utils';
import { extensionNamespace } from './utils/extensionNamespace';

export function activate(context: vscode.ExtensionContext) {
  OutputChannel.appendLine(`"${extensionNamespace}" is now active!`);

  context.subscriptions.push(
    openAndRunCommand,
    changeExtCommand,
    clearEmptyFolderCommand,
    formatSortTsOnceCommand,
    formatCommand,
    toTsCommand,
    camelizeCommand,
    switchTypeInterfaceCommand,
    createIndexCommand('js'),
    createIndexOnlyTargetCommand('js'),
    createIndexCommand('both'),
    createIndexOnlyTargetCommand('both'),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
