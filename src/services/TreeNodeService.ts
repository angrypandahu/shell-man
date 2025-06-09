import * as vscode from 'vscode';
import { CommandTreeItem } from '../models/vo/CommandTreeItem';
import { TreeNode } from '../models/entity/TreeNode';

export class TreeNodeService {
    private terminal: vscode.Terminal | null = null;
    constructor(private _context: vscode.ExtensionContext, public outputChannel: vscode.OutputChannel) {
        this._context = _context;
        this.outputChannel = outputChannel;
    }
    async getChildren(key: string, element?: CommandTreeItem): Promise<CommandTreeItem[]> {
        const nodes = this._context.globalState.get<TreeNode[]>(key, []);
        this.outputChannel.appendLine(`getChildren - all nodes: ${JSON.stringify(nodes, null, 2)}`);

        if (element) {
            this.outputChannel.appendLine(`getChildren - parent element: ${element.label}, id: ${element.id}`);
            // 如果是文件夹，返回其子节点
            const childNodes = nodes.filter(node => node.parentId === parseInt(element.id || ''))
                .sort((a, b) => a.sortOrder - b.sortOrder);
            this.outputChannel.appendLine(`getChildren - child nodes: ${JSON.stringify(childNodes, null, 2)}`);
            return childNodes.map(node => this.createTreeItem(node));
        } else {
            // 返回根节点
            const rootNodes = nodes.filter(node => !node.parentId)
                .sort((a, b) => a.sortOrder - b.sortOrder);
            this.outputChannel.appendLine(`getChildren - root nodes: ${JSON.stringify(rootNodes, null, 2)}`);
            return rootNodes.map(node => this.createTreeItem(node));
        }
    }

    private createTreeItem(node: TreeNode): CommandTreeItem {
        this.outputChannel.appendLine(`createTreeItem: ${JSON.stringify(node, null, 2)}`);
        return new CommandTreeItem(
            node
        );
    }

    async saveNode(node: TreeNode, key: string): Promise<void> {
        const nodes = this._context.globalState.get<TreeNode[]>(key, []);
        const existingNodeIndex = nodes.findIndex(n => n.id === node.id);

        if (existingNodeIndex >= 0) {
            nodes[existingNodeIndex] = {
                ...node,
                updatedAt: new Date().toISOString()
            };
        } else {
            nodes.push({
                ...node,
                id: nodes.length + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        await this._context.globalState.update(key, nodes);
    }
    async deleteNode(nodeId: number, key: string): Promise<void> {
        const nodes = this._context.globalState.get<TreeNode[]>(key, []);
        const updatedNodes = nodes.filter(node => node.id !== nodeId);
        await this._context.globalState.update(key, updatedNodes);
    }

    private getOrCreateTerminal() {
        if (!this.terminal) {
            this.terminal = vscode.window.createTerminal(`Shell Man`);
        }
        this.terminal.show();
        return this.terminal;
    }

    execute(node: CommandTreeItem) {
        this.outputChannel.appendLine(`execute: ${node.label}, id: ${node.id}`);
        if (node && node.shellCommand) {
            const terminal = this.getOrCreateTerminal();
            terminal.sendText(node.shellCommand.command);
        }
    }
}