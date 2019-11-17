import * as vscode from 'vscode';

import {
  createIndexCommand,
  createIndexOnlyTargetCommand,
  toTsCommand,
} from './commands';
import { extensionNamespace } from './utils/extensionNamespace';

export function activate(context: vscode.ExtensionContext) {
  console.log(`"${extensionNamespace}" is now active!`);

  context.subscriptions.push(toTsCommand);
  context.subscriptions.push(createIndexCommand);
  context.subscriptions.push(createIndexOnlyTargetCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
