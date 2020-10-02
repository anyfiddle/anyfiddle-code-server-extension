import * as vscode from 'vscode';

type AnyfiddleJSON = {
  defaultCommand?: string;
  port?: number;
  openFiles?: string[];
};

let runCommandStatusBarItem: vscode.StatusBarItem;
let portMappingStatusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
  // Run Command
  // Preview Command
  // Open files and folders

  // /**
  //  * Run command
  //  */
  // vscode.window.terminals[0].sendText('npm start');
  // vscode.window.showTextDocument(vscode.);
  // /**
  //  * Open preview
  //  */
  // vscode.env.openExternal(vscode.Uri.parse('https://localhost'));
  // /**
  //  * Open file
  //  */
  // const document = await vscode.workspace.openTextDocument(
  //   '/Users/joji/Work/Anyfiddle/code/runner-proxy/package.json'
  // );
  // vscode.window.showTextDocument(document);
  if (vscode.workspace.workspaceFolders) {
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

    if (anyfiddleJson.defaultCommand) {
      runCommandStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        1
      );
      runCommandStatusBarItem.text = 'Run';
      runCommandStatusBarItem.show();

      const runCommandId = 'anyfiddle.runCommand';
      vscode.commands.registerCommand(runCommandId, () => {
        if (anyfiddleJson.defaultCommand) {
          vscode.window.terminals[0].sendText(anyfiddleJson.defaultCommand);
        }
      });
      runCommandStatusBarItem.command = runCommandId;
    }

    if (anyfiddleJson.port) {
      portMappingStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        1
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
}

// this method is called when your extension is deactivated
export function deactivate() {}
