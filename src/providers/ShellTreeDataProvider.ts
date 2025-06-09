import * as vscode from 'vscode';
import { CommandTreeItem } from '../models/vo/CommandTreeItem';
import { TreeNode } from '../models/entity/TreeNode';
import { TreeNodeService } from '../services/TreeNodeService';



export class ShellToolProvider implements vscode.TreeDataProvider<CommandTreeItem> {
    private outputChannel: vscode.OutputChannel;
    private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined | null | void> = new vscode.EventEmitter<CommandTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(
        private saveKey: string,
        private treeNodeService: TreeNodeService
    ) {
        this.outputChannel = treeNodeService.outputChannel;
        this.saveKey = saveKey;
    }

    getTreeItem(element: CommandTreeItem): CommandTreeItem {
        this.outputChannel.appendLine(`getTreeItem: ${element.label}, id: ${element.id}`);
        return element;
    }

    async getChildren(element?: CommandTreeItem): Promise<CommandTreeItem[]> {
        return this.treeNodeService.getChildren(this.saveKey, element);
    }

    async saveNode(node: TreeNode): Promise<void> {
        await this.treeNodeService.saveNode(node, this.saveKey);
        this._onDidChangeTreeData.fire();
    }

    async deleteNode(nodeId: number): Promise<void> {
        await this.treeNodeService.deleteNode(nodeId, this.saveKey);
        this._onDidChangeTreeData.fire();
    }

    async refresh() {
        this.outputChannel.appendLine('refresh called');
        this._onDidChangeTreeData.fire();
        vscode.window.showInformationMessage('项目列表已刷新');
    }
}