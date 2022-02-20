import * as vscode from 'vscode';

import { extensionNamespace } from './extensionNamespace';

type AppendLineOptions = {
  show?: boolean;
  error?: any;
};

export class OutputChannel {
  private static instance: OutputChannel;

  private channel = vscode.window.createOutputChannel(extensionNamespace);

  static getInstance(): OutputChannel {
    if (!OutputChannel.instance) {
      OutputChannel.instance = new OutputChannel();
    }
    return OutputChannel.instance;
  }

  static appendLine(
    message: string,
    { error, show = error }: AppendLineOptions = {},
  ) {
    const { channel } = OutputChannel.getInstance();

    channel.appendLine(message);

    if (show) channel.show(show);

    if (error) {
      vscode.window.showErrorMessage(message[0]);

      if (error?.message) {
        channel.appendLine(error.message);
      }
    }

    console.log(message);
  }
}
