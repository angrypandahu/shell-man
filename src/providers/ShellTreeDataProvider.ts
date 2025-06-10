import * as vscode from 'vscode';
import { CommandTreeItem } from '../models/vo/CommandTreeItem';
import { TreeNode } from '../models/entity/TreeNode';
import { TreeNodeService } from '../services/TreeNodeService';
import { ShellManMeta } from '../utils/Constants';



export class ShellToolProvider implements vscode.TreeDataProvider<CommandTreeItem> {
    private outputChannel: vscode.OutputChannel;
    private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined | null | void> = new vscode.EventEmitter<CommandTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(
        private metaData: ShellManMeta,
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

    async refresh() {
        this.outputChannel.appendLine('refresh called');
        this._onDidChangeTreeData.fire();
        vscode.window.showInformationMessage(`${this.metaData.VIEW_NAME}已刷新`);
    }
}