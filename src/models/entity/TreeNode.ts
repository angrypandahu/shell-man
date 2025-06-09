import { ShellCommand } from "./ShellCommand";
import { Tag } from "./Tag";

export class TreeNode {
    constructor(
        public id: number,
        public name: string,
        public icon: string,
        public hierarchy: string,
        public sortOrder: number,
        public parentId: number,
        public isLeaf = false,
        public shellCommand: ShellCommand | null,
        public tags: Tag[],
        public nodeType: string,
        public createdAt: string,
        public updatedAt: string,
    ) {}    
}
