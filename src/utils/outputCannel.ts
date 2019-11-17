import * as vscode from 'vscode';

import { extensionNamespace } from './extensionNamespace';

export class OutputChannel {
  private static instance: OutputChannel;

  private channel = vscode.window.createOutputChannel(extensionNamespace);

  static getInstance(): OutputChannel {
    if (!OutputChannel.instance) {
      OutputChannel.instance = new OutputChannel();
    }
    return OutputChannel.instance;
  }

  static appendLine(message: string | string[]) {
    const { channel } = OutputChannel.getInstance();

    if (message instanceof Array) {
      message.forEach((m) => channel.appendLine(m));
    } else {
      channel.appendLine(message);
    }

    channel.show(true);
  }
}
