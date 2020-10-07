import * as vscode from 'vscode';

type AnyfiddleJSON = {
  defaultCommand?: string;
  port?: number;
  openFiles?: string[];
};

let runCommandStatusBarItem: vscode.StatusBarItem;
let portMappingStatusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
  if (vscode.workspace.workspaceFolders) {
    /**
     * Get Anyfiddle JSON
     */
    const folder = vscode.workspace.workspaceFolders[0];
    const anyfiddleJsonUri = vscode.Uri.joinPath(folder.uri, 'anyfiddle.json');

    const anyfiddleJsonDocument = await vscode.workspace.openTextDocument(
      anyfiddleJsonUri
    );
    const anyfiddleJsonText = anyfiddleJsonDocument.getText();
    let anyfiddleJson: AnyfiddleJSON = {};
    try {
      anyfiddleJson = JSON.parse(anyfiddleJsonText);
    } catch (e) {}
    console.log('Anyfiddle JSON', anyfiddleJson);

    /**
     * Get port mapping and show status bar item
     */
    if (anyfiddleJson.port) {
      portMappingStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        2
      );
      portMappingStatusBarItem.text = `Port ${anyfiddleJson.port} => https://dev-123213.anyfiddle.run`;
      portMappingStatusBarItem.show();

      const openPreviewCommandId = 'anyfiddle.openPreview';
      vscode.commands.registerCommand(openPreviewCommandId, () => {
        if (anyfiddleJson.port) {
          vscode.env.openExternal(
            vscode.Uri.parse('https://dev-123213.anyfiddle.run')
          );
        }
      });
      portMappingStatusBarItem.command = openPreviewCommandId;
    }

    /**
     * Get Default command and show status bar item
     */
    if (anyfiddleJson.defaultCommand) {
      runCommandStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        1
      );
      runCommandStatusBarItem.text = 'RUN';
      runCommandStatusBarItem.show();

      const runCommandId = 'anyfiddle.runCommand';
      vscode.commands.registerCommand(runCommandId, () => {
        if (anyfiddleJson.defaultCommand) {
          vscode.window.terminals[0].sendText(anyfiddleJson.defaultCommand);
          vscode.window.terminals[0].show();
        }
      });
      runCommandStatusBarItem.command = runCommandId;
    }

    /**
     * Open files as per anyfiddle json
     */
    const rootUri = vscode.workspace.workspaceFolders[0].uri;
    if (anyfiddleJson.openFiles) {
      anyfiddleJson.openFiles.forEach(async (filename) => {
        const document = await vscode.workspace.openTextDocument(
          vscode.Uri.joinPath(rootUri, filename)
        );
        vscode.window.showTextDocument(document);
      });
    }
  }

  /**
   * Open first terminal
   */
  const terminals = vscode.window.terminals;
  if (terminals.length === 0) {
    const terminal = vscode.window.createTerminal();
    terminal.show();
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
