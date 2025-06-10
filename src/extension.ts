// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ShellToolProvider } from './providers/ShellTreeDataProvider';
import { TreeNode } from './models/entity/TreeNode';
import { CommandTreeItem } from './models/vo/CommandTreeItem';
import { TreeNodeService } from './services/TreeNodeService';
import { SHELL_MAN_FAVORITE_META, SHELL_MAN_COMMAND_META } from './utils/Constants';

// 初始化示例数据
async function initializeSampleData(context: vscode.ExtensionContext, key: string) {
	const treeNodes = context.globalState.get(key);
	if (treeNodes) {
		return;
	}
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
			nodeType: "case",
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

	await context.globalState.update(key, sampleData);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// 创建输出通道
	const outputChannel = vscode.window.createOutputChannel('Shell Man');
	context.subscriptions.push(outputChannel);

	// 初始化示例数据
	await initializeSampleData(context, SHELL_MAN_COMMAND_META.SAVE_KEY);
	await initializeSampleData(context, SHELL_MAN_FAVORITE_META.SAVE_KEY);

	// 初始化视图提供者
	const treeNodeService = new TreeNodeService(context, outputChannel);
	const providerCommand = new ShellToolProvider(SHELL_MAN_COMMAND_META, treeNodeService);
	const providerFavorite = new ShellToolProvider(SHELL_MAN_FAVORITE_META, treeNodeService);
	vscode.window.registerTreeDataProvider(SHELL_MAN_FAVORITE_META.VIEW_ID, providerCommand);
	vscode.window.registerTreeDataProvider(SHELL_MAN_COMMAND_META.VIEW_ID, providerFavorite);

	// 注册刷新命令
	const providerCommandRefresh = vscode.commands.registerCommand('shell_man_command.refresh', () => {
		providerCommand.refresh();
	});
	const providerFavoriteRefresh = vscode.commands.registerCommand('shell_man_favorite.refresh', () => {
		providerFavorite.refresh();
	});

	// 注册刷新命令
	const commandExecute = vscode.commands.registerCommand('shellManProjects.execute', (item: CommandTreeItem) => {
		treeNodeService.execute(item);
	});
	// 注册显示日志命令
	const showLogsCommand = vscode.commands.registerCommand('shellManProjects.showLogs', () => {
		outputChannel.show();
	});
	context.subscriptions.push(providerCommandRefresh, providerFavoriteRefresh, showLogsCommand, commandExecute);


}


