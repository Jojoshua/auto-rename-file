import * as vscode from "vscode";
export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidCreateFiles((event) => {
    const config = vscode.workspace.getConfiguration("autoRenameFile").get("config") as Mapping[];
    if (!config.length) {
      return;
    }

    const currentFileURI = vscode.Uri.file(event.files[0].path);

    const resultMapping = isTargetFile(config, currentFileURI);

    if (resultMapping) {
      performRename(currentFileURI, resultMapping);
    }
  });

  async function performRename(currentFileURI: vscode.Uri, resultMapping: Mapping) {
    const wsedit = new vscode.WorkspaceEdit();

    const newFileURI = vscode.Uri.file(currentFileURI.path.replace(resultMapping.from, resultMapping.to));

    if (await doesFileExist(newFileURI)) {
      vscode.window.showErrorMessage(`Auto Rename File: ${newFileURI.path} already exists`);
      return;
    }

    wsedit.renameFile(currentFileURI, newFileURI);

    checkInsertText(resultMapping, wsedit, newFileURI);

    vscode.workspace.applyEdit(wsedit);
  }

  async function doesFileExist(testURI: vscode.Uri): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(testURI);
    } catch {
      return false;
    }

    return true;
  }

  function isTargetFile(config: Mapping[], currentFileURI: vscode.Uri): Mapping | null {
    let result: Mapping | null = null;

    config.forEach((mapping) => {
      if (currentFileURI.path.endsWith(mapping.from)) {
        result = mapping;
        return;
      }
    });

    return result;
  }

  function checkInsertText(resultMapping: Mapping, wsedit: vscode.WorkspaceEdit, newFileURI: vscode.Uri) {
    if (resultMapping.insertText) {
      wsedit.insert(newFileURI, new vscode.Position(0, 0), resultMapping.insertText);
    }
  }
}

export function deactivate() {}

interface Mapping {
  from: string;
  to: string;
  insertText?: string;
}
