import * as vscode from 'vscode';

import { CommandTreeItem } from '../models/vo/CommandTreeItem';

export class ShellToolProvider implements vscode.TreeDataProvider<CommandTreeItem> {

    constructor(
        private _context: vscode.ExtensionContext,
    ) {
        this._context = _context;
    }


    onDidChangeTreeData?: vscode.Event<void | CommandTreeItem | CommandTreeItem[] | null | undefined> | undefined;
    getTreeItem(element: CommandTreeItem): CommandTreeItem{
       return element;
    }
    getChildren(element?: CommandTreeItem) {
        if (element) {
            return element.children;
        }
        return [];
    }

    async refresh() {
        vscode.window.showInformationMessage('项目列表已刷新');
    }

}