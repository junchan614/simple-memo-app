const Database = require('better-sqlite3');
const path = require('path');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'memo_app.db');

// データベース接続
const db = new Database(dbPath);

// WALモードを有効化（パフォーマンス向上）
db.pragma('journal_mode = WAL');

// テーブル作成
const createTable = `
    CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

db.exec(createTable);

// CRUD操作の準備済み文を作成

// メモ作成
const insertMemo = db.prepare(`
    INSERT INTO memos (title, content) 
    VALUES (?, ?)
`);

// 全メモ取得（新しい順）
const selectAllMemos = db.prepare(`
    SELECT id, title, content, created_at, updated_at 
    FROM memos 
    ORDER BY created_at DESC
`);

// 特定メモ取得
const selectMemoById = db.prepare(`
    SELECT id, title, content, created_at, updated_at 
    FROM memos 
    WHERE id = ?
`);

// メモ更新
const updateMemo = db.prepare(`
    UPDATE memos 
    SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
`);

// メモ削除
const deleteMemo = db.prepare(`
    DELETE FROM memos 
    WHERE id = ?
`);

// CRUD関数をエクスポート
module.exports = {
    // メモ作成
    createMemo: (title, content) => {
        try {
            const result = insertMemo.run(title, content);
            return {
                success: true,
                id: result.lastInsertRowid,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    // 全メモ取得
    getAllMemos: () => {
        try {
            const memos = selectAllMemos.all();
            return {
                success: true,
                data: memos
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    // 特定メモ取得
    getMemoById: (id) => {
        try {
            const memo = selectMemoById.get(id);
            if (!memo) {
                return {
                    success: false,
                    error: 'Memo not found'
                };
            }
            return {
                success: true,
                data: memo
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    // メモ更新
    updateMemo: (id, title, content) => {
        try {
            const result = updateMemo.run(title, content, id);
            if (result.changes === 0) {
                return {
                    success: false,
                    error: 'Memo not found'
                };
            }
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    // メモ削除
    deleteMemo: (id) => {
        try {
            const result = deleteMemo.run(id);
            if (result.changes === 0) {
                return {
                    success: false,
                    error: 'Memo not found'
                };
            }
            return {
                success: true,
                changes: result.changes
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    // データベース接続を閉じる（アプリ終了時）
    close: () => {
        db.close();
    }
};