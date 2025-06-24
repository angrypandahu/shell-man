import * as vscode from 'vscode';
import { CommandTreeItem } from '../models/vo/CommandTreeItem';
import { TreeNode } from '../models/entity/TreeNode';
import { TreeNodeService } from '../services/TreeNodeService';
import { ShellManMeta } from '../utils/Constants';
import { AddNodePanel } from '../webview/AddNodePanel';



export class ShellToolProvider implements vscode.TreeDataProvider<CommandTreeItem> {
    private outputChannel: vscode.OutputChannel;
    private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined | null | void> = new vscode.EventEmitter<CommandTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(
        public metaData: ShellManMeta,
        private treeNodeService: TreeNodeService
    ) {
        this.outputChannel = treeNodeService.outputChannel;
        this.metaData = metaData;
    }

    getTreeItem(element: CommandTreeItem): CommandTreeItem {
        this.outputChannel.appendLine(`getTreeItem: ${element.label}, id: ${element.id}`);
        return element;
    }

    async getChildren(element?: CommandTreeItem): Promise<CommandTreeItem[]> {
        return this.treeNodeService.getChildren(this.metaData.SAVE_KEY, element);
    }

    async saveNode(node: TreeNode): Promise<void> {
        await this.treeNodeService.saveNode(node, this.metaData.SAVE_KEY);
        this._onDidChangeTreeData.fire();
    }

    async deleteNode(nodeId: string): Promise<void> {
        await this.treeNodeService.deleteNode(nodeId, this.metaData.SAVE_KEY);
        this._onDidChangeTreeData.fire();
    }
    async clear() {
        await this.treeNodeService.context.globalState.update(this.metaData.SAVE_KEY, []);
        this._onDidChangeTreeData.fire();
    }

    async refresh() {
        this.outputChannel.appendLine('refresh called');
        this._onDidChangeTreeData.fire();
        vscode.window.showInformationMessage(`${this.metaData.VIEW_NAME}已刷新`);
    }

    addFolder(item: CommandTreeItem) {
        AddNodePanel.createOrShow(this.treeNodeService.context.extensionUri, this.treeNodeService, this, item);
    }

    async importSettings() {
        const uri = await vscode.window.showOpenDialog({
            filters: {
                'JSON': ['json']
            },
            canSelectMany: false
        });

        if (uri && uri[0]) {
            try {
                const content = await vscode.workspace.fs.readFile(uri[0]);
                const settings = JSON.parse(content.toString()) as TreeNode[];
                await this.treeNodeService.saveNodes(settings, this.metaData.SAVE_KEY);
                this._onDidChangeTreeData.fire();
                vscode.window.showInformationMessage('配置已导入');
            } catch (error) {
                vscode.window.showErrorMessage(`导入配置失败: ${error}`);
            }
        }
    }


    async exportSettings() {
        const nodes = this.treeNodeService.context.globalState.get<TreeNode[]>(this.metaData.SAVE_KEY, []);
        const content = JSON.stringify(nodes, null, 2);
        const uri = await vscode.window.showSaveDialog({
            filters: {
                'JSON': ['json']
            },
            defaultUri: vscode.Uri.file('shell-man-commands.json'),
            saveLabel: '导出配置',
            title: '导出 shell-man 命令'
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
            vscode.window.showInformationMessage('配置已成功导出');
        }
    }
}