export class ShellCommand {
    constructor(
        public name: string,
        public command: string,
        public type :string,
        public parentCommand: ShellCommand | null,
    ) {}
}