import * as path from 'path';
import * as vscode from 'vscode';

import { createIndex } from './createIndex';

export function activate(context: vscode.ExtensionContext) {
  console.log('"index-generator" is now active!');

  const disposable = vscode.commands.registerCommand(
    'index-generator.createIndex',
    () => {
      createIndex();
      vscode.window.showInformationMessage('Create index successful!', 'OK');
    },
  );

  const disposableOnlyTarget = vscode.commands.registerCommand(
    'index-generator.createIndexOnlyTarget',
    () => {
      createIndex({ onlyTarget: true });
      vscode.window.showInformationMessage('Create index successful!', 'OK');
    },
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableOnlyTarget);
}

// this method is called when your extension is deactivated
export function deactivate() {}
