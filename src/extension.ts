import * as vscode from 'vscode';

import {
  createIndexCommand,
  createIndexOnlyTargetCommand,
  switchTypeInterfaceCommand,
  toTsCommand,
  prettierFormatCommand,
  camelizeCommand,
  criusPropsCommand,
  formatSortTsCommand,
} from './commands';
import { extensionNamespace } from './utils/extensionNamespace';
import { OutputChannel } from './utils';

export function activate(context: vscode.ExtensionContext) {
  OutputChannel.appendLine(`"${extensionNamespace}" is now active!`, false);

  context.subscriptions.push(formatSortTsCommand);
  context.subscriptions.push(prettierFormatCommand);
  context.subscriptions.push(toTsCommand);
  context.subscriptions.push(camelizeCommand);
  context.subscriptions.push(switchTypeInterfaceCommand);
  context.subscriptions.push(criusPropsCommand);

  context.subscriptions.push(createIndexCommand('js'));
  context.subscriptions.push(createIndexOnlyTargetCommand('js'));
  context.subscriptions.push(createIndexCommand('both'));
  context.subscriptions.push(createIndexOnlyTargetCommand('both'));
}

// this method is called when your extension is deactivated
export function deactivate() {}
