// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import * as vscode from "vscode";
import { IndexGenerator } from "./generator";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "index-generator" is now active!'
  );

  const { rootPath } = vscode.workspace;

  const dirPath = path.dirname(
    vscode.window.activeTextEditor.document.fileName
  );

  let disposable = vscode.commands.registerCommand(
    "extension.helloWorld",
    () => {
      new IndexGenerator(dirPath, {
        force: true,
        type: "both",
        perttierConfig: path.join(rootPath, ".prettierrc.js"),
        ignore: path.join(rootPath, ".indexignore.json")
      }).createFile();

      vscode.window.showInformationMessage("Create index successful!");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
