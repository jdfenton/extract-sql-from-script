import * as vscode from 'vscode';
import { Query, QueryCodeLine, QueryVariable } from './Classes';

export function buildQuery(queryCode: QueryCodeLine[]) {
  var queryTextArray = [];
  for (var i = 0; i < queryCode.length; i++) {
    queryTextArray.push(queryCode[i].codeText);
  }
  var queryText = queryTextArray.join("");
  return queryText;
}


export function numberQueryNames(queries: Query[]) {
  for (var i=0; i<queries.length; i++)  {
    queries[i].queryName = (i+1) + ".  " + queries[i].queryName;
  } 
  return queries;
}

export function loadQueryVariables(queries: Query[]) {
  for (var j=0; j<queries.length; j++)  {
    var codeLine = queries[j].queryCode;
    var origCodeLine = [];

    //clone code lines for comparison to see which were modified.
    for (var a=0; a<codeLine.length; a++) {
      origCodeLine.push(codeLine[a].codeText);
    }
       
    //scan all query lines for variables
    var i=0;
    while (i<codeLine.length) {
      var trimmedCode = codeLine[i].codeText.trim();
      
      //if code line ends in f""" then treat it as the start of a query
      if (trimmedCode === "/* test variables for substitution")  {
        i++;
        var loopThroughVars = true;
        try{
          while (loopThroughVars)  {
            queries[j].queryVariables.push(new QueryVariable(codeLine[i].codeText.split(":")[0].trim(), codeLine[i].codeText.split(":")[1].trim()));
            codeLine[i].eligibleForSub=false;
            i++;
            if (codeLine[i].codeText.trim() === "end test variables */" || !(i < codeLine.length))  {
              //add all subsequent lines in query variables, or until the end of the code.
              loopThroughVars = false;
            }
          }
        }
        catch (err) {
          vscode.window.showErrorMessage("Failure reading test variables, check they are inserted correctly.");
          return;
        }
      }

      if (codeLine[i].codeText.includes("  --Substituted from: ")) {
        codeLine[i].eligibleForSub=false;
      }
      i++;
    }

    //replace variable names with values
    for (var i=0; i<codeLine.length; i++)  {
      for (var k=0; k<queries[j].queryVariables.length; k++) {
        if(codeLine[i].codeText.includes(queries[j].queryVariables[k].varName) && codeLine[i].eligibleForSub) {
          codeLine[i].codeText = codeLine[i].codeText.replace(queries[j].queryVariables[k].varName, queries[j].queryVariables[k].varValue).replace("\n", "");
        }
      }
      //if variables replaced, append original (can't happen in the first loop as some lines have multiple variables and will duplicate)
      if (!(codeLine[i].codeText === origCodeLine[i])) {
        codeLine[i].codeText += "  --Substituted from: " + origCodeLine[i].trim() + "\n";
      }

    }
  }
  return queries;
}


export function replaceAll(editor: vscode.TextEditor, newText: string) {
  let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
  let fullRange = editor.document.validateRange(invalidRange);
  editor.edit(edit => edit.replace(fullRange, newText));
}

export async function printTextToNewFile(sql: string) {
  // Create untitled file with language set and content
  const options ={
    content: sql,
    language: "sql-bigquery, sql"
  };
  var newEd = await vscode.workspace.openTextDocument(options);
  vscode.window.showTextDocument(newEd);
}

export function removeInvalidQueries(queries: Query[]) {
  for (var i=0; i<queries.length; i++)  {
    if (queries[i].selectCount === 0) {
      queries.splice(i, 1);
    }
  }  
  return queries;
}