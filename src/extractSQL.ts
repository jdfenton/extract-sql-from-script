import * as vscode from 'vscode';
import { Query, QueryCodeLine } from './Classes';
import { removeInvalidQueries, numberQueryNames, loadQueryVariables, buildQuery, printTextToNewFile } from './sharedFunctions';

export async function extractSQL() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No open editor.");
    return;
  }
  else if (!editor.document.languageId.toLowerCase().includes("python")) {
    vscode.window.showErrorMessage("This command only works on Python documents");
    return;
  }
  const docText = editor.document.getText();
  var codeLine = docText.split(/(?:\r\n|\r|\n)/g);
  var i = 0;
  var queries = [];
  //loop though all lines of code
  while (i < codeLine.length) {
    var trimmedCode = codeLine[i].toLowerCase().trim();
    //load every text between f""" and """ into queries array.
    //if code line ends in f""" then treat it as the start of a query
    if (trimmedCode.substr(trimmedCode.length - 4) === "f\"\"\"") {
      var queryName = codeLine[i].trim().substr(0, codeLine[i].trim().indexOf("="));
      queries.push(new Query(queryName));
      i++;
      var loopThroughQuery = true;
      while (loopThroughQuery) {
        queries[queries.length - 1].queryCode.push(new QueryCodeLine(codeLine[i] + '\n'));
        if (codeLine[i].toLowerCase().includes("select")) {
          queries[queries.length - 1].selectCount++;
        }
        i++;
        if (codeLine[i].trim() === "\"\"\"" || (i - 1) >= codeLine.length) {
          //add all subsequent lines to query array until """ appear in a line to mark the end of the query
          loopThroughQuery = false;
        }
      }
    }
    i++;
  }
  //remove any array element that doesn't have the word select in it
  var validQueries = removeInvalidQueries(queries);
  //number selections using the array index. Input box only seems to return selected text
  //could duplicate if queries have the same variable name
  var numberedQueries = numberQueryNames(validQueries);
  //load variables from document and sub in values to the rest of th query
  var substitutedQueryVars = loadQueryVariables(numberedQueries);
  if (!substitutedQueryVars) {
    return;
  }
  //if only one query is identified in the document, open it in a new untitled window
  if (substitutedQueryVars.length === 1) {
    var sqlText = buildQuery(substitutedQueryVars[0].queryCode);
    printTextToNewFile(sqlText);
  }
  //if the script document has multiple queries, list them in an input box for the user to select.
  else if (substitutedQueryVars.length > 1) {
    var queryToExtract;
    var queryList = [];
    for (i = 0; i < substitutedQueryVars.length; i++) {
      queryList.push(substitutedQueryVars[i].queryName);
    }
    queryToExtract = vscode.window.showQuickPick(queryList, {
      placeHolder: "Select a query to extract from the script:"
    });
    for (i = 0; i < substitutedQueryVars.length; i++) {
      if (await queryToExtract === substitutedQueryVars[i].queryName) {
        //printQueryToFile(substitutedQueryVars[i].queryCode.codeText.join(""));
        var sqlText = buildQuery(substitutedQueryVars[i].queryCode);
        printTextToNewFile(sqlText);
      }
    }
  }
  else {
    vscode.window.showErrorMessage("No query found in the active text editor.");
    return;
  }
}
