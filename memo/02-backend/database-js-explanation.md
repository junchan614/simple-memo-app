# database/db.js 超わかりやすい解説 - 高校生向け

## このファイルの役割

**簡単に言うと**: 図書館の「自動化システム」を構築するファイルです！

前回の例えで言うと、今まで手作業でやっていた図書館業務を、
全自動のロボット司書さんに任せるためのプログラムを書きます。

## ファイル構成の全体像

```
📚 図書館の自動化システム構築

1. 図書館との接続設定
2. 本棚（テーブル）の設計図作成
3. ロボット司書の基本動作を準備
4. 利用者向けサービス関数の作成
```

## コード解説（順番に見ていこう）

### 1. ライブラリの読み込み
```javascript
const Database = require('better-sqlite3');
const path = require('path');
```

**身近な例**: 図書館システム導入
```
📦 「better-sqlite3」パッケージ到着
👷 「これを使って図書館システムを作ろう」

📂 「path」モジュール
🗺️ 「ファイルの場所を正確に教えてくれる案内システム」
```

### 2. データベースファイルのパス設定
```javascript
const dbPath = path.join(__dirname, 'memo_app.db');
const db = new Database(dbPath);
```

**解説**:
- `__dirname`: 今いるフォルダ（`/home/.../database/`）
- `memo_app.db`: データベースファイル名
- `path.join()`: パスを正しく結合（OS関係なく動作）

**身近な例**:
```
🏢 図書館の住所設定
「〇〇市××区の図書館ビルに、新しいデジタルシステムを設置します」

実際の場所: /home/junchan614/projects/simple-memo-app/database/memo_app.db
```

### 3. パフォーマンス設定
```javascript
db.pragma('journal_mode = WAL');
```

**WAL（Write-Ahead Logging）とは？**

**身近な例**: レストランの注文システム
```
❌ 通常モード:
お客さん → 注文 → 料理人が一時停止 → メモに記録 → 料理再開
（料理が一時的に止まる）

✅ WALモード:
お客さん → 注文 → 別のスタッフがメモ記録 → 料理人は継続
（料理が止まらない、より高速）
```

### 4. テーブル作成
```javascript
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
```

**身近な例**: 本棚の設計図
```
📋 メモ専用本棚の設計図

┌─────────────────────────────────────────────────────┐
│                メモ本棚                              │
│                                                   │
│ 棚の構造:                                           │
│ • 管理番号 (id)           : 自動採番シール            │
│ • タイトル欄 (title)      : 必須項目                │
│ • 内容欄 (content)        : 任意項目                │
│ • 作成日 (created_at)     : 自動記録                │
│ • 更新日 (updated_at)     : 自動更新                │
└─────────────────────────────────────────────────────┘
```

#### 各項目の意味
- `INTEGER PRIMARY KEY AUTOINCREMENT`: 1,2,3...と自動で番号付け
- `TEXT NOT NULL`: 文字列で、空欄禁止
- `TEXT`: 文字列で、空欄OK
- `DATETIME DEFAULT CURRENT_TIMESTAMP`: 現在時刻を自動記録

### 5. 準備済み文（テンプレート）の作成

#### なぜ準備済み文を使うの？
```
❌ 毎回一から作る方法:
司書: 「えーっと、どうやってメモを追加するんだっけ？」
（毎回手順を思い出す → 遅い）

✅ 準備済み文:
司書: 「メモ追加テンプレートNo.1を使用！」
（定型業務として効率化 → 速い）
```

#### メモ作成用テンプレート
```javascript
const insertMemo = db.prepare(`
    INSERT INTO memos (title, content) 
    VALUES (?, ?)
`);
```

**身近な例**: 新刊登録フォーム
```
📝 新刊登録フォーム（テンプレート）

タイトル: [ ? ] ← ここに実際のタイトルが入る
内容:    [ ? ] ← ここに実際の内容が入る
作成日:   [自動記録]
更新日:   [自動記録]
ID:      [自動採番]
```

#### その他のテンプレート
```javascript
const selectAllMemos = db.prepare(`...`);      // 全部見せて
const selectMemoById = db.prepare(`...`);      // ID番号○番を見せて
const updateMemo = db.prepare(`...`);          // ID番号○番を更新して
const deleteMemo = db.prepare(`...`);          // ID番号○番を削除して
```

### 6. CRUD関数の作成

#### createMemo（メモ作成）
```javascript
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
}
```

**身近な例**: 新刊受付窓口
```
👤 利用者: 「新しいメモを登録してください」
📝 タイトル: "買い物リスト"
📄 内容: "牛乳、パン、卵"

🤖 司書ロボット:
1. 新刊登録フォームを使用
2. 空いている棚を確認
3. ID番号を自動採番（例: 5番）
4. 登録完了

📋 結果報告:
✅ 成功: true
🆔 ID番号: 5
📊 変更件数: 1
```

#### try-catch構文（エラー対応）
```javascript
try {
    // 正常処理を試す
} catch (error) {
    // エラーが起きた時の対処
}
```

**身近な例**: 失敗への備え
```
🤖 司書ロボット: 
「新刊登録を試してみます」

✅ 成功した場合:
「ID番号5で登録完了しました！」

❌ 失敗した場合:
「申し訳ございません。タイトルが未記入のため登録できません」
（適切なエラーメッセージで報告）
```

## データの流れ（実際の動作）

### 1. アプリ起動時
```
1. database/db.js 読み込み
   ↓
2. memo_app.db ファイル作成（なければ）
   ↓  
3. memos テーブル作成（なければ）
   ↓
4. 準備済み文を5種類準備
   ↓
5. CRUD関数を5個作成
   ↓
6. 「図書館システム準備完了！」
```

### 2. メモ作成時の流れ
```
Express.js: createMemo("買い物", "牛乳、パン")
    ↓
db.js: insertMemo.run("買い物", "牛乳、パン")
    ↓
SQLite: INSERT INTO memos (title, content) VALUES ("買い物", "牛乳、パン")
    ↓
結果: { success: true, id: 5, changes: 1 }
    ↓
Express.js: JSON形式でフロントエンドに返送
```

## セキュリティ対策

### プレースホルダー（`?`）の使用
```javascript
// ❌ 危険な方法（SQLインジェクション攻撃の可能性）
const query = `INSERT INTO memos (title) VALUES ('${userInput}')`;

// ✅ 安全な方法（プレースホルダー使用）
const stmt = db.prepare('INSERT INTO memos (title) VALUES (?)');
stmt.run(userInput);
```

**身近な例**: 偽造防止システム
```
❌ 危険な受付:
利用者: 「『テスト'; DROP TABLE memos; --』というタイトルで登録して」
システム: 「はい」→ 全データ削除される危険

✅ 安全な受付:
利用者: 「悪意のあるコード」
システム: 「それは文字列として登録します」→ 安全
```

## エラーハンドリングの種類

### 1. データ不足エラー
```javascript
if (!memo) {
    return {
        success: false,
        error: 'Memo not found'
    };
}
```
「指定されたメモが見つかりません」

### 2. 更新失敗エラー
```javascript
if (result.changes === 0) {
    return {
        success: false,
        error: 'Memo not found'
    };
}
```
「更新対象のメモが存在しません」

### 3. システムエラー
```javascript
catch (error) {
    return {
        success: false,
        error: error.message
    };
}
```
「予期せぬエラーが発生しました」

## module.exports（輸出）

### なぜ関数を輸出するの？
```javascript
module.exports = {
    createMemo: (title, content) => { ... },
    getAllMemos: () => { ... },
    // ...
};
```

**身近な例**: サービスカウンター
```
📋 図書館の利用可能サービス一覧

受付窓口で提供するサービス:
• 新刊登録 (createMemo)
• 蔵書一覧表示 (getAllMemos)  
• 特定書籍検索 (getMemoById)
• 書籍情報更新 (updateMemo)
• 書籍廃棄 (deleteMemo)

館内システム（非公開）:
• データベース接続
• SQL文の準備
• エラー処理
```

## 他のファイルからの使用方法

### server.js での使用例
```javascript
const { createMemo, getAllMemos } = require('./database/db');

// 新しいメモを作成
const result = createMemo("タイトル", "内容");

if (result.success) {
    console.log(`メモID: ${result.id} で作成成功`);
} else {
    console.error(`エラー: ${result.error}`);
}
```

## まとめ

**database/db.js は...**

1. **図書館システムの司令塔** - SQLiteとの全ての通信を管理
2. **安全性重視** - SQLインジェクション対策済み
3. **使いやすさ** - 他のファイルから簡単に利用可能
4. **エラー対応** - 適切なエラーメッセージを提供
5. **高性能** - 準備済み文とWALモードで高速化

次はこの司書システムを、Web上のお客さん（ブラウザ）から利用できるように、
`routes/memos.js`でAPI窓口を作成します！🚀