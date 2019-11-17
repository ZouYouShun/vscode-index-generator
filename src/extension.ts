import * as vscode from 'vscode';

import { createIndexCommand, createIndexOnlyTargetCommand } from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('"index-generator" is now active!');
  
  context.subscriptions.push(toTsCommand);
  context.subscriptions.push(createIndexCommand);
  context.subscriptions.push(createIndexOnlyTargetCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
