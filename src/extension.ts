// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ShellToolProvider } from './providers/ShellTreeDataProvider';

// 初始化示例数据
async function initializeSampleData(context: vscode.ExtensionContext) {
	const sampleData = [
		{
			id: 1,
			name: "常用命令",
			icon: "folder",
			hierarchy: "root",
			sort_order: 0,
			node_type: "folder",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: 2,
			name: "Git 命令",
			icon: "git-branch",
			hierarchy: "root",
			sort_order: 1,
			node_type: "folder",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: 3,
			name: "查看当前分支",
			icon: "git-branch",
			hierarchy: "root/git",
			sort_order: 0,
			parent_id: 2,
			node_type: "command",
			command: "git branch",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: 4,
			name: "查看文件列表",
			icon: "files",
			hierarchy: "root/common",
			sort_order: 0,
			parent_id: 1,
			node_type: "command",
			command: "ls -la",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	];

	await context.globalState.update('tree_nodes', sampleData);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// 创建输出通道
	const outputChannel = vscode.window.createOutputChannel('Shell Man');
	context.subscriptions.push(outputChannel);

	// 初始化示例数据
	await initializeSampleData(context);

	// 初始化视图提供者
	const provider = new ShellToolProvider(context, outputChannel);
	vscode.window.registerTreeDataProvider('shellManProjects', provider);
	
	// 注册刷新命令
	const disposable = vscode.commands.registerCommand('shellManProjects.refresh', () => {
		provider.refresh();
	});

	// 注册显示日志命令
	const showLogsCommand = vscode.commands.registerCommand('shellManProjects.showLogs', () => {
		outputChannel.show();
	});

	context.subscriptions.push(disposable, showLogsCommand);
	
	// 立即加载数据
	provider.refresh();
}


