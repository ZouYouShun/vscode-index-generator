import * as vscode from 'vscode';

import {
  camelizeCommand,
  clearEmptyFolderCommand,
  createIndexCommand,
  createIndexOnlyTargetCommand,
  formatSortTsCommand,
  formatSortTsOnceCommand,
  openAndRunCommand,
  prettierFormatCommand,
  switchTypeInterfaceCommand,
  toTsCommand,
} from './commands';
import { OutputChannel } from './utils';
import { extensionNamespace } from './utils/extensionNamespace';

export function activate(context: vscode.ExtensionContext) {
  OutputChannel.appendLine(`"${extensionNamespace}" is now active!`, false);

  context.subscriptions.push(
    openAndRunCommand,
    clearEmptyFolderCommand,
    formatSortTsCommand,
    formatSortTsOnceCommand,
    prettierFormatCommand,
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
