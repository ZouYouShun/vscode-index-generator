import * as vscode from 'vscode';

import {
  camelizeCommand,
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

  context.subscriptions.push(openAndRunCommand);
  context.subscriptions.push(formatSortTsCommand);
  context.subscriptions.push(formatSortTsOnceCommand);
  context.subscriptions.push(prettierFormatCommand);
  context.subscriptions.push(toTsCommand);
  context.subscriptions.push(camelizeCommand);
  context.subscriptions.push(switchTypeInterfaceCommand);

  context.subscriptions.push(createIndexCommand('js'));
  context.subscriptions.push(createIndexOnlyTargetCommand('js'));
  context.subscriptions.push(createIndexCommand('both'));
  context.subscriptions.push(createIndexOnlyTargetCommand('both'));
}

// this method is called when your extension is deactivated
export function deactivate() {}
