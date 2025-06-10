import { CommandTreeItem } from "../vo/CommandTreeItem";
import { ShellCommand } from "./ShellCommand";
import { Tag } from "./Tag";

export class TreeNode {
    constructor(
        public uid: string,
        public name: string,
        public icon: string,
        public hierarchy: string,
        public sortOrder: number,
        public parentUid: string,
        public isLeaf = false,
        public shellCommand: ShellCommand | null,
        public tags: Tag[],
        public nodeType: string,
        public createdAt: string,
        public updatedAt: string,
    ) { }
    public static fromCommandTreeItem(commandTreeItem: CommandTreeItem): TreeNode {
        const uid = commandTreeItem.id?.toString() || '';
        const name = commandTreeItem.label?.toString() || '';
        const hierarchy = '0.' + uid + '.';
        const sortOrder = new Date().getTime();
        return new TreeNode(uid, name, 'symbol-event', hierarchy, sortOrder, '', true, commandTreeItem.shellCommand || null, [], 'case', '', '');
    }
}
