import * as vscode from 'vscode';
import { ShellCommand } from '../entity/ShellCommand';

export class CommandTreeItem extends vscode.TreeItem {
    public parent: CommandTreeItem | null = null;
    public children: CommandTreeItem[] = [];
    public description?: string;
    public shellCommand?: ShellCommand;

    constructor(
        public readonly id: string,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        children: CommandTreeItem[] = [],
        public readonly iconPath?: vscode.ThemeIcon,
        public readonly contextValue?: string,
        description?: string,
        shellCommand?: ShellCommand
    ) {
        super(label, collapsibleState);
        this.children = children;
        if (iconPath) {
            this.iconPath = iconPath;
        }
        if (contextValue) {
            this.contextValue = contextValue;
        }
        if (description) {
            this.description = description;
        }
        if (shellCommand) {
            this.shellCommand = shellCommand;
        }
        this.id = id;
    }
} 