import * as vscode from 'vscode';
import { CommandTreeItem } from '../models/vo/CommandTreeItem';

interface TreeNode {
    id: number;
    name: string;
    icon?: string;
    hierarchy: string;
    sort_order: number;
    parent_id?: number;
    tags?: string;
    node_type: string;
    command?: string;
    created_at: string;
    updated_at: string;
}

export class ShellToolProvider implements vscode.TreeDataProvider<CommandTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined | null | void> = new vscode.EventEmitter<CommandTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(
        private _context: vscode.ExtensionContext,
        private outputChannel: vscode.OutputChannel
    ) {
        this._context = _context;
    }

    getTreeItem(element: CommandTreeItem): CommandTreeItem {
        this.outputChannel.appendLine(`getTreeItem: ${element.label}, id: ${element.id}`);
        return element;
    }

    async getChildren(element?: CommandTreeItem): Promise<CommandTreeItem[]> {
        const nodes = this._context.globalState.get<TreeNode[]>('tree_nodes', []);
        this.outputChannel.appendLine(`getChildren - all nodes: ${JSON.stringify(nodes, null, 2)}`);
        
        if (element) {
            this.outputChannel.appendLine(`getChildren - parent element: ${element.label}, id: ${element.id}`);
            // 如果是文件夹，返回其子节点
            const childNodes = nodes.filter(node => node.parent_id === parseInt(element.id))
                .sort((a, b) => a.sort_order - b.sort_order);
            this.outputChannel.appendLine(`getChildren - child nodes: ${JSON.stringify(childNodes, null, 2)}`);
            return childNodes.map(node => this.createTreeItem(node));
        } else {
            // 返回根节点
            const rootNodes = nodes.filter(node => !node.parent_id)
                .sort((a, b) => a.sort_order - b.sort_order);
            this.outputChannel.appendLine(`getChildren - root nodes: ${JSON.stringify(rootNodes, null, 2)}`);
            return rootNodes.map(node => this.createTreeItem(node));
        }
    }

    private createTreeItem(node: TreeNode): CommandTreeItem {
        this.outputChannel.appendLine(`createTreeItem: ${JSON.stringify(node, null, 2)}`);
        const collapsibleState = node.node_type === 'folder' 
            ? vscode.TreeItemCollapsibleState.Collapsed 
            : vscode.TreeItemCollapsibleState.None;

        const iconPath = node.icon 
            ? new vscode.ThemeIcon(node.icon)
            : undefined;

        return new CommandTreeItem(
            node.id.toString(),
            node.name,
            collapsibleState,
            [],
            iconPath,
            node.node_type,
            node.command
        );
    }

    async saveNode(node: TreeNode): Promise<void> {
        const nodes = this._context.globalState.get<TreeNode[]>('tree_nodes', []);
        const existingNodeIndex = nodes.findIndex(n => n.id === node.id);
        
        if (existingNodeIndex >= 0) {
            nodes[existingNodeIndex] = {
                ...node,
                updated_at: new Date().toISOString()
            };
        } else {
            nodes.push({
                ...node,
                id: nodes.length + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        await this._context.globalState.update('tree_nodes', nodes);
        this._onDidChangeTreeData.fire();
    }

    async deleteNode(nodeId: number): Promise<void> {
        const nodes = this._context.globalState.get<TreeNode[]>('tree_nodes', []);
        const updatedNodes = nodes.filter(node => node.id !== nodeId);
        await this._context.globalState.update('tree_nodes', updatedNodes);
        this._onDidChangeTreeData.fire();
    }

    async refresh() {
        this.outputChannel.appendLine('refresh called');
        this._onDidChangeTreeData.fire();
        vscode.window.showInformationMessage('项目列表已刷新');
    }
}