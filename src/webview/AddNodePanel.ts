import * as vscode from 'vscode';
import { TreeNode } from '../models/entity/TreeNode';
import { CommandTreeItem } from '../models/vo/CommandTreeItem';

export class AddNodePanel {
    public static currentPanel: AddNodePanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, private parentItem?: CommandTreeItem) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'submit':
                        { const node: TreeNode = {
                            uid: Date.now().toString(),
                            name: message.name,
                            icon: message.type === 'folder' ? 'folder' : 'file',
                            hierarchy: '',
                            sortOrder: 0,
                            nodeType: message.type,
                            parentUid: this.parentItem?.id || '',
                            shellCommand: message.type !== 'folder' ? {
                                command: message.command || '',
                                parentCommand: null,
                                name: message.name,
                                type: message.type
                            } : null,
                            isLeaf: message.type !== 'folder',
                            tags: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        console.log('#####node: ', node);
                        vscode.commands.executeCommand('shell_man_command.refresh');
                        this._panel.dispose();
                        break; }
                }
            },
            null,
            this._disposables
        );

        console.log('webview js loaded');
    }

    public static createOrShow(extensionUri: vscode.Uri, parentItem?: CommandTreeItem) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (AddNodePanel.currentPanel) {
            AddNodePanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'addNode',
            '添加节点',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        AddNodePanel.currentPanel = new AddNodePanel(panel, extensionUri, parentItem);
    }

    public dispose() {
        AddNodePanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        console.log('#####webview: ', webview);
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>添加节点</title>
            <style>
                body {
                    padding: 20px;
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                }
                input, select {
                    width: 100%;
                    padding: 5px;
                    margin-bottom: 10px;
                    background: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                }
                button {
                    background: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    padding: 8px 15px;
                    cursor: pointer;
                }
                button:hover {
                    background: var(--vscode-button-hoverBackground);
                }
                #commandGroup {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="form-group">
                <label for="name">名称:</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="type">类型:</label>
                <select id="type" onchange="toggleCommandGroup()">
                    <option value="folder">文件夹</option>
                    <option value="command">命令</option>
                    <option value="case">用例</option>
                </select>
            </div>
            <div id="commandGroup" class="form-group">
                <label for="command">命令:</label>
                <input type="text" id="command">
            </div>
            <button id="submitBtn">提交</button>

            <script>
                const vscode = acquireVsCodeApi();
                console.log('webview js loaded');

                document.getElementById('submitBtn').addEventListener('click', submit);

                function toggleCommandGroup() {
                    const type = document.getElementById('type').value;
                    const commandGroup = document.getElementById('commandGroup');
                    commandGroup.style.display = type === 'folder' ? 'none' : 'block';
                }

                function submit() {
                    const name = document.getElementById('name').value;
                    const type = document.getElementById('type').value;
                    const command = document.getElementById('command').value;

                    console.log('submit called', { name, type, command });

                    if (!name) {
                        alert('请输入名称');
                        return;
                    }
                    if (type !== 'folder' && !command) {
                        alert('请输入命令');
                        return;
                    }
                    vscode.postMessage({
                        command: 'submit',
                        name: name,
                        type: type,
                        command: command
                    });
                }
            </script>
        </body>
        </html>`;
    }
} 