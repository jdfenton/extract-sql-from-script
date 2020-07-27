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
    //var trimmedCode = codeLine[i].toLowerCase().trim();
    
    //load every text between """ and """ into queries array.
    //if code line ends in """ then treat it as the start of a query
    var strStart = codeLine[i].indexOf("\"\"\"")

    if (strStart > -1) {
      var queryName
      try {
        queryName = codeLine[i].trim().substring(0, codeLine[i].trim().indexOf("="));
        if (queryName.length == 0) {
          throw "No query name.";
        }
      } catch (error) {
        queryName = "Unnamed query"
      }      
      queries.push(new Query(queryName));

      var strEnd = codeLine[i].indexOf("\"\"\"", (strStart + 3))

      if (strEnd > -1) {
        //single line query- get text between """ and """ on same line
        queries[queries.length - 1].queryCode.push(new QueryCodeLine(codeLine[i].substring((strStart+3), strEnd) + '\n'));
        if (codeLine[i].substring((strStart+3), strEnd).toLowerCase().includes("select")) {
          queries[queries.length - 1].selectCount++;
        }
      }
      else {
        //test if query starts on first line
        if (codeLine[i].substr((strStart+3)).trim().length > 0) {
          queries[queries.length - 1].queryCode.push(new QueryCodeLine(codeLine[i].substr((strStart+3)) + '\n'));
          if (codeLine[i].substr((strStart+3)).toLowerCase().includes("select")) {
            queries[queries.length - 1].selectCount++;
          }
        }
        i++

        var loopThroughQuery = true;
        while (loopThroughQuery) {
          var strEnd = codeLine[i].indexOf("\"\"\"")
          if (strEnd > -1 || (i - 1) >= codeLine.length) {
            //add all subsequent lines to query array until """ appear in a line to mark the end of the query
            if (codeLine[i].substring(0, strEnd).trim().length > 0) {
              queries[queries.length - 1].queryCode.push(new QueryCodeLine(codeLine[i].substring(0, (strEnd)) + '\n'));
              if (codeLine[i].substring(0, (strEnd)).toLowerCase().includes("select")) {
                queries[queries.length - 1].selectCount++;
              }
            }
            loopThroughQuery = false;
          }
          else {
            queries[queries.length - 1].queryCode.push(new QueryCodeLine(codeLine[i] + '\n'));
            if (codeLine[i].toLowerCase().includes("select")) {
              queries[queries.length - 1].selectCount++;
            }
            i++;
          }
        }
      }
    }
    i++;
  }
  console.log('start queries');
  console.log(queries);
  console.log('end queries');

  //remove any array element that doesn't have the word select in it
  var validQueries = removeInvalidQueries(queries);

  console.log(validQueries);
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
