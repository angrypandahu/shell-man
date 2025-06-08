-- 创建文件夹表
CREATE TABLE IF NOT EXISTS tree_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,                    -- 文件夹名称
    icon TEXT,                             -- 文件夹图标
    hierarchy TEXT,                         -- 层级
    sort_order INTEGER DEFAULT 0,          -- 排序顺序
    parent_id INTEGER,                     -- 父文件夹ID
    tags TEXT,                             -- 标签
    node_type TEXT,                         -- 节点类型（folder/command/case）
    command TEXT,                         -- 命令信息
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
