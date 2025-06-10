// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ShellToolProvider } from './providers/ShellTreeDataProvider';
import { TreeNode } from './models/entity/TreeNode';
import { CommandTreeItem } from './models/vo/CommandTreeItem';
import { TreeNodeService } from './services/TreeNodeService';
import { SHELL_MAN_FAVORITE_META, SHELL_MAN_COMMAND_META, SHELL_MAN_LAST_RUN_META } from './utils/Constants';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// 初始化示例数据
async function initializeSampleData(context: vscode.ExtensionContext, key: string) {
	try {
		const shellmanDir = path.join(os.homedir(), '.shellman');
		const dataFile = path.join(shellmanDir, 'shellman_data.json');
		
		if (fs.existsSync(dataFile)) {
			const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
			let nodes: TreeNode[] = [];
			
			switch (key) {
				case SHELL_MAN_COMMAND_META.SAVE_KEY:
					nodes = data.command_nodes || [];
					break;
				case SHELL_MAN_FAVORITE_META.SAVE_KEY:
					nodes = data.favorite_nodes || [];
					break;
				case SHELL_MAN_LAST_RUN_META.SAVE_KEY:
					nodes = data.last_run_nodes || [];
					break;
			}

			if (nodes.length >= 0) {
				await context.globalState.update(key, nodes);
				return;
			}
		}
	} catch (error) {
		console.error('Failed to load data from file:', error);
	}

	// 如果文件不存在或加载失败，使用默认数据
	const sampleData: TreeNode[] = [
		{
			uid: '1',
			name: "常用命令",
			icon: "folder",
			hierarchy: "0.1.",
			sortOrder: 0,
			nodeType: "folder",
			parentUid: "",
			shellCommand: null,
			isLeaf: false,
			tags: [],
			createdAt: "",
			updatedAt: ""
		},
		{
			uid: '2',
			name: "Git 命令",
			icon: "git-branch",
			hierarchy: "0.2.",
			sortOrder: 1,
			nodeType: "folder",
			parentUid: "",
			shellCommand: null,
			isLeaf: false,
			tags: [],
			createdAt: "",
			updatedAt: ""
		},
		{
			uid: '3',
			name: "查看当前分支",
			icon: "git-branch",
			hierarchy: "0.2.3.",
			sortOrder: 0,
			isLeaf: true,
			parentUid: "2",
			nodeType: "command",
			shellCommand: {
				command: "git branch",
				parentCommand: null,
				name: "",
				type: ""
			},
			tags: [],
			createdAt: "",
			updatedAt: ""
		},
		{
			uid: '4',
			name: "查看文件列表",
			icon: "files",
			hierarchy: "0.1.4.",
			isLeaf: false,
			sortOrder: 0,
			parentUid: "1",
			nodeType: "command",
			shellCommand: {
				command: "ls -la",
				parentCommand: null,
				name: "",
				type: ""
			},
			tags: [],
			createdAt: "",
			updatedAt: ""
		},
		{
			uid: '5',
			name: "用例1",
			icon: "files",
			hierarchy: "0.1.4.5.",
			isLeaf: true,
			sortOrder: 0,
			parentUid: "4",
			nodeType: "case",
			shellCommand: {
				command: "ls -la",
				parentCommand: null,
				name: "",
				type: ""
			},
			tags: [],
			createdAt: "",
			updatedAt: ""
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
	await initializeSampleData(context, SHELL_MAN_LAST_RUN_META.SAVE_KEY);

	// 初始化视图提供者
	const treeNodeService = new TreeNodeService(context, outputChannel);
	const providerCommand = new ShellToolProvider(SHELL_MAN_COMMAND_META, treeNodeService);
	const providerFavorite = new ShellToolProvider(SHELL_MAN_FAVORITE_META, treeNodeService);
	const providerLastRun = new ShellToolProvider(SHELL_MAN_LAST_RUN_META, treeNodeService);
	vscode.window.registerTreeDataProvider(SHELL_MAN_COMMAND_META.VIEW_ID, providerCommand);
	vscode.window.registerTreeDataProvider(SHELL_MAN_FAVORITE_META.VIEW_ID, providerFavorite);
	vscode.window.registerTreeDataProvider(SHELL_MAN_LAST_RUN_META.VIEW_ID, providerLastRun);

	// 注册刷新命令
	const providerCommandRefresh = vscode.commands.registerCommand('shell_man_command.refresh', () => {
		providerCommand.refresh();
	});
	const providerFavoriteRefresh = vscode.commands.registerCommand('shell_man_favorite.refresh', () => {
		providerFavorite.refresh();
	});
	const providerLastRunRefresh = vscode.commands.registerCommand('shell_man_last_run.refresh', () => {
		providerLastRun.refresh();
	});

	// 注册刷新命令
	const commandExecute = vscode.commands.registerCommand('shell_man_common.execute', (item: CommandTreeItem) => {
		treeNodeService.execute(item);
	});
	// 注册显示日志命令
	const showLogsCommand = vscode.commands.registerCommand('shell_man_common.showLogs', () => {
		outputChannel.show();
	});
	context.subscriptions.push(providerCommandRefresh, providerFavoriteRefresh, providerLastRunRefresh, showLogsCommand, commandExecute);
}


