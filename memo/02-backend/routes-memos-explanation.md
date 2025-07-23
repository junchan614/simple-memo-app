# routes/memos.js 超わかりやすい解説 - 高校生向け

## このファイルの役割

**簡単に言うと**: 図書館の「受付窓口」を作るファイルです！

前回作った司書ロボット（database/db.js）は図書館の奥で働いていますが、
お客さん（ブラウザ）からは直接話しかけることができません。
そこで、受付カウンターを設置して、お客さんの要求を司書に伝える役割を作ります。

## 全体の仕組み

```
🌐 お客さん（ブラウザ）
    ↓ HTTP リクエスト
📞 受付カウンター（routes/memos.js）
    ↓ 関数呼び出し
🤖 司書ロボット（database/db.js）
    ↓ SQL実行
📚 図書館倉庫（SQLite）
```

### 身近な例: コンビニの店員さん

```
👤 お客さん: 「おにぎり1個ください」
👩 店員さん: 「はい、在庫を確認します」
📦 倉庫: 「おにぎりあります」
👩 店員さん: 「こちらおにぎりです。150円です」
👤 お客さん: 「ありがとうございます」

今回作るAPI:
👤 ブラウザ: 「メモ一覧ください」
🏪 API Routes: 「はい、データベースを確認します」  
📚 database/db: 「メモデータあります」
🏪 API Routes: 「こちらメモ一覧です（JSON形式）」
👤 ブラウザ: 「ありがとうございます」
```

## RESTful API設計

### REST = 「標準的な接客ルール」

**身近な例**: レストランのメニュー注文
```
📋 標準的な注文方法

GET（取得）: 「メニューを見せて」
POST（作成）: 「ハンバーガーを1個注文」  
PUT（更新）: 「さっきの注文、チーズバーガーに変更」
DELETE（削除）: 「さっきの注文キャンセル」
```

### 今回作るAPI エンドポイント

```
🏪 メモ管理店のサービスメニュー

┌─────────────────────────────────────────────────┐
│                API サービス一覧                  │
├─────────────────────────────────────────────────┤
│ GET    /api/memos     │ 全メモ一覧表示         │
│ POST   /api/memos     │ 新しいメモ作成         │  
│ GET    /api/memos/123 │ ID123のメモだけ表示    │
│ PUT    /api/memos/123 │ ID123のメモを更新      │
│ DELETE /api/memos/123 │ ID123のメモを削除      │
└─────────────────────────────────────────────────┘
```

## 実際のコード構造

### 1. 基本設定
```javascript
const express = require('express');
const router = express.Router();
const { createMemo, getAllMemos, /* ... */ } = require('../database/db');
```

**身近な例**: 店舗の開店準備
```
🏪 新しい支店を開店

1. Express社のフランチャイズ契約（express）
2. 受付カウンター設置（router）
3. 本社システムと連携（database/db から関数を取得）
```

### 2. GET /api/memos（全メモ取得）
```javascript
router.get('/', async (req, res) => {
    try {
        const result = getAllMemos();
        
        if (result.success) {
            res.json({
                success: true,
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false, 
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
```

**実際の接客シーン**:
```
👤 ブラウザ: 「GET /api/memos」
🏪 受付: 「全メモ一覧ですね、確認します」

🤖 司書: getAllMemos() 実行
📚 結果: [メモ1, メモ2, メモ3]

🏪 受付: 「こちら全メモ一覧です」
📄 レスポンス: 
{
  "success": true,
  "data": [
    {"id": 1, "title": "買い物", "content": "牛乳、パン"},
    {"id": 2, "title": "勉強", "content": "数学宿題"},
    {"id": 3, "title": "予定", "content": "映画鑑賞"}
  ]
}
```

### 3. POST /api/memos（新メモ作成）
```javascript
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // バリデーション（入力チェック）
        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const result = createMemo(title, content);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                data: { id: result.id }
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
```

**実際の接客シーン**:
```
👤 ブラウザ: 「POST /api/memos」
📄 データ: {"title": "映画メモ", "content": "アクション映画"}

🏪 受付: 「新メモ作成ですね」
🔍 チェック: タイトルが入力されているか確認
✅ OK: 「司書さん、新規登録お願いします」

🤖 司書: createMemo("映画メモ", "アクション映画") 実行
📚 結果: ID = 4 で登録成功

🏪 受付: 「ID4で作成完了です」
📄 レスポンス:
{
  "success": true,
  "data": {"id": 4}
}
```

### 4. PUT /api/memos/:id（メモ更新）
```javascript
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content } = req.body;
        
        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const result = updateMemo(id, title, content);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Memo updated successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
```

**実際の接客シーン**:
```
👤 ブラウザ: 「PUT /api/memos/3」
📄 データ: {"title": "修正版映画メモ", "content": "アクション＋コメディ"}

🏪 受付: 「ID3の更新ですね」
🔍 チェック: ID=3, タイトル入力OK
🤖 司書: updateMemo(3, "修正版映画メモ", "アクション＋コメディ") 実行

📚 結果: 更新成功
🏪 受付: 「更新完了しました」
```

### 5. DELETE /api/memos/:id（メモ削除）
```javascript
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = deleteMemo(id);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Memo deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
```

## HTTPステータスコードの意味

### よく使うステータスコード
```
📋 受付対応結果の報告コード

✅ 200 OK: 「正常に処理しました」
✅ 201 Created: 「新規作成しました」  
❌ 400 Bad Request: 「入力内容に問題があります」
❌ 404 Not Found: 「指定されたメモが見つかりません」
❌ 500 Internal Server Error: 「システム内部でエラーが発生しました」
```

**身近な例**: 銀行の窓口
```
👤 お客様: 「口座から10万円引き出したいです」

✅ 200: 「10万円お渡ししました」
❌ 400: 「通帳をお忘れです」
❌ 404: 「そちらの口座番号は存在しません」  
❌ 500: 「システムメンテナンス中です」
```

## エラーハンドリング（失敗への対応）

### try-catch構文
```javascript
try {
    // 正常な処理を試す
    const result = getAllMemos();
} catch (error) {
    // エラーが起きた時の対処
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
}
```

### バリデーション（入力チェック）
```javascript
if (!title) {
    return res.status(400).json({
        success: false,
        error: 'Title is required'
    });
}
```

**身近な例**: 図書館の入館チェック
```
👤 利用者: 「本を借りたいです」

🔍 受付チェック:
❌ 「図書カードをお持ちですか？」
❌ 「期限切れの返却本はありませんか？」
✅ 「問題ありません、どうぞ」
```

## レスポンス形式の統一

### 成功時のレスポンス
```json
{
  "success": true,
  "data": { /* 実際のデータ */ }
}
```

### エラー時のレスポンス
```json
{
  "success": false,
  "error": "エラーの説明"
}
```

**なぜ統一するの？**

**身近な例**: コンビニの接客統一
```
❌ 店員によってバラバラ:
店員A: 「150円です」
店員B: 「おにぎり1個で150円になります」
店員C: 「お会計150円、ありがとうございました」

✅ マニュアル統一:
全員: 「こちら150円です。ありがとうございます」

→ お客さんが混乱しない、システムが理解しやすい
```

## module.exports（店舗の営業開始）

```javascript
module.exports = router;
```

**身近な例**: 支店の営業許可
```
🏪 新支店準備完了
📋 サービス一覧:
• メモ一覧表示サービス
• メモ作成サービス  
• メモ更新サービス
• メモ削除サービス

📤 本社に報告: 「営業開始準備完了しました」
🏢 本社: 「了解、営業開始許可します」
```

## server.jsとの連携

### server.js での使用
```javascript
const memosRouter = require('./routes/memos');
app.use('/api/memos', memosRouter);
```

**身近な例**: 店舗チェーンの運営
```
🏢 本社（server.js）:
「/api/memos で始まるお客さんは、メモ管理支店に案内して」

👤 お客さん: 「GET /api/memos/123 をお願いします」
🏢 本社: 「メモ管理支店さん、お客様です」
🏪 支店: 「ID123のメモをお調べします」
```

## 実際のAPI使用例

### JavaScript からのアクセス
```javascript
// メモ一覧取得
const response = await fetch('/api/memos');
const data = await response.json();

// 新メモ作成  
const newMemo = await fetch('/api/memos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'テストメモ',
        content: 'テスト内容'
    })
});
```

### curlコマンドでのテスト
```bash
# 全メモ取得
curl http://localhost:8080/api/memos

# 新メモ作成
curl -X POST http://localhost:8080/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"テストメモ","content":"内容"}'
```

## まとめ

**routes/memos.js は...**

1. **API受付窓口** - ブラウザからの要求を受け付ける
2. **RESTful設計** - 標準的なAPI設計ルールに従う
3. **エラーハンドリング** - 適切なエラー対応とステータスコード
4. **データベース連携** - database/db.js の関数を使用
5. **レスポンス統一** - 一貫したJSON形式で返答

これで図書館に立派な受付カウンターができます！
次はこのAPIが正常に動作するかテストしましょう🧪