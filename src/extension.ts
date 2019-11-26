import * as vscode from 'vscode';

import {
  createIndexCommand,
  createIndexOnlyTargetCommand,
  switchTypeInterfaceCommand,
  toTsCommand,
  prettierFormatCommand,
} from './commands';
import { extensionNamespace } from './utils/extensionNamespace';
import { OutputChannel } from './utils';

export function activate(context: vscode.ExtensionContext) {
  OutputChannel.appendLine(`"${extensionNamespace}" is now active!`, false);

  context.subscriptions.push(prettierFormatCommand);
  context.subscriptions.push(toTsCommand);
  context.subscriptions.push(switchTypeInterfaceCommand);
  context.subscriptions.push(createIndexCommand);
  context.subscriptions.push(createIndexOnlyTargetCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
