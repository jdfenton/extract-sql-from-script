import * as vscode from 'vscode';
import { replaceAll } from './sharedFunctions';


export function subInVars() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No open editor.");
    return;
  }
  else if (!editor.document.languageId.toLowerCase().includes("sql")) {
    vscode.window.showErrorMessage("This command only works on SQL documents");
    return;
  }
  const docText = editor.document.getText();
  var codeLine = docText.split(/(?:\r\n|\r|\n)/g);
  //loop though all lines of code
  for (var i = 0; i < codeLine.length; i++) {
    //if code line ends in f""" then treat it as the start of a query
    if (codeLine[i].includes("--Substituted from:")) {
      codeLine[i] = codeLine[i].split("--Substituted from:")[0].trimRight().replace(codeLine[i].split("--Substituted from:")[0].trim(), codeLine[i].split("--Substituted from:")[1].trim());
    }
  }
  replaceAll(editor, codeLine.join("\n"));
}
