// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ShellToolProvider } from './providers/ShellTreeDataProvider';
import { TreeNode } from './models/entity/TreeNode';
import { CommandTreeItem } from './models/vo/CommandTreeItem';

// 初始化示例数据
async function initializeSampleData(context: vscode.ExtensionContext) {
	const sampleData: TreeNode[] = [
		{
			id: 1,
			name: "常用命令",
			icon: "folder",
			hierarchy: "0.1.",
			sortOrder: 0,
			nodeType: "folder",
			parentId: 0,
			shellCommand: null,
			isLeaf: false,
			tags: [],
			createdAt: '',
			updatedAt: ''
		},
		{
			id: 2,
			name: "Git 命令",
			icon: "git-branch",
			hierarchy: "0.2.",
			sortOrder: 1,
			nodeType: "folder",
			parentId: 0,
			shellCommand: null,
			isLeaf: false,
			tags: [],
			createdAt: '',
			updatedAt: ''
		},
		{
			id: 3,
			name: "查看当前分支",
			icon: "git-branch",
			hierarchy: "0.2.3.",
			sortOrder: 0,
			isLeaf: true,
			parentId: 2,
			nodeType: "command",
			shellCommand: {
				command: "git branch",
				parentCommand: null,
				name: '',
				type: ''
			},
			tags: [],
			createdAt: '',
			updatedAt: ''
		},
		{
			id: 4,
			name: "查看文件列表",
			icon: "files",
			hierarchy: "0.1.4.",
			isLeaf: false,
			sortOrder: 0,
			parentId: 1,
			nodeType: "command",
			shellCommand: {
				command: "ls -la",
				parentCommand: null,
				name: '',
				type: ''
			},
			tags: [],
			createdAt: '',
			updatedAt: ''
		},
		{
			id: 5,
			name: "用例1",
			icon: "files",
			hierarchy: "0.1.4.5.",
			isLeaf: true,
			sortOrder: 0,
			parentId: 4,
			nodeType: "command",
			shellCommand: {
				command: "ls -la",
				parentCommand: null,
				name: '',
				type: ''
			},
			tags: [],
			createdAt: '',
			updatedAt: ''
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


	// 注册刷新命令
	const commandExecute = 	vscode.commands.registerCommand('shellManProjects.execute', (item: CommandTreeItem) => {
		provider.execute(item);
	});
	// 注册显示日志命令
	const showLogsCommand = vscode.commands.registerCommand('shellManProjects.showLogs', () => {
		outputChannel.show();
	});

	context.subscriptions.push(disposable, showLogsCommand, commandExecute);

	// 立即加载数据
	provider.refresh();
}


