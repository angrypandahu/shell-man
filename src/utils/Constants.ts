export const SHELL_MAN_COMMAND_META: ShellManMeta = {
    SAVE_KEY: 'command_nodes',
    VIEW_ID: 'shell_man_command',
    VIEW_NAME: 'Shell 命令',
    VIEW_ICON: '$(terminal-bash)',
};

export const SHELL_MAN_FAVORITE_META: ShellManMeta = {
    SAVE_KEY: 'favorite_nodes',
    VIEW_ID: 'shell_man_favorite',
    VIEW_NAME: 'Shell 收藏',
    VIEW_ICON: '$(star)',
};

export const SHELL_MAN_LAST_RUN_META: ShellManMeta = {
    SAVE_KEY: 'last_run_nodes',
    VIEW_ID: 'shell_man_last_run',
    VIEW_NAME: '最近执行',
    VIEW_ICON: '$(history)',
};

export interface ShellManMeta {
    SAVE_KEY: string;
    VIEW_ID: string;
    VIEW_NAME: string;
    VIEW_ICON: string;
}