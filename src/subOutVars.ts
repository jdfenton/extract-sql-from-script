import * as vscode from 'vscode';
import { Query, QueryCodeLine } from './Classes';
import { loadQueryVariables, buildQuery, replaceAll } from './sharedFunctions';

export function subOutVars() {
  const editor = vscode.window.activeTextEditor;
  var query = [new Query("ActiveQuery")];
  if (!editor) {
    vscode.window.showErrorMessage("No open editor.");
    return;
  }
  else if (!editor.document.languageId.toLowerCase().includes("sql")) {
    vscode.window.showErrorMessage("This command only works on SQL documents");
    return;
  }
  const docText = editor.document.getText();
  var codeLine = docText.split("\n");
  for (var i = 0; i < codeLine.length; i++) {
    query[0].queryCode.push(new QueryCodeLine(codeLine[i] + '\n'));
  }
  var substitutedQueryVars = loadQueryVariables(query);
  if (!substitutedQueryVars) {
    return;
  }
  var sqlText = buildQuery(substitutedQueryVars[0].queryCode);
  replaceAll(editor, sqlText);
}
