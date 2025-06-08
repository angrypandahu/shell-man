// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ShellToolProvider } from './providers/ShellTreeDataProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
		// 初始化视图提供者
		const provider = new ShellToolProvider(context);
		vscode.window.registerTreeDataProvider('shellManProjects', provider);
			// 立即加载数据
		provider.refresh();	
}


