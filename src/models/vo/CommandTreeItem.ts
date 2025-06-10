import * as vscode from 'vscode';
import { ShellCommand } from '../entity/ShellCommand';
import { TreeNode } from '../entity/TreeNode';

export class CommandTreeItem extends vscode.TreeItem {
    public parent: CommandTreeItem | null = null;
    public children: CommandTreeItem[] = [];
    public description?: string;
    public shellCommand?: ShellCommand | null;
    constructor(node: TreeNode) {
        super(node.name, vscode.TreeItemCollapsibleState.None);
        this.id = node.uid;
        this.label = node.name;
        this.collapsibleState = !node.isLeaf ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        this.iconPath = node.icon ? new vscode.ThemeIcon(node.icon) : undefined;
        this.contextValue = node.nodeType;
        this.shellCommand = node.shellCommand;
    }


} 