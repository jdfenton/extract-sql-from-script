import * as vscode from 'vscode';
import { extractSQL } from './extractSQL';
import { subOutVars } from './subOutVars';
import { subInVars } from './subInVars';

export function activate(context: vscode.ExtensionContext) {

	console.log("extract-sql-from-script is now active.");

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//let disposable = vscode.commands.registerCommand('extract-sql-from-script.extractSQL', extractSQL);
  context.subscriptions.push(vscode.commands.registerCommand('extract-sql-from-script.extractSQL', extractSQL));
  context.subscriptions.push(vscode.commands.registerCommand('extract-sql-from-script.subInVars', subInVars));
  context.subscriptions.push(vscode.commands.registerCommand('extract-sql-from-script.subOutVars', subOutVars));
}

// this method is called when your extension is deactivated
export function deactivate() {}


