# API テスト用 cURLコマンド解説 - 高校生向け

## cURLって何？

**簡単に言うと**: コマンドラインから「ウェブサイトにお客として訪問する」ツールです！

ブラウザの代わりに、ターミナルからAPIサーバーにリクエストを送信できます。

## 身近な例で理解

### ブラウザでのアクセス（普通の方法）
```
👤 あなた: ブラウザを開く
🌐 ブラウザ: アドレスバーにURLを入力
📱 ブラウザ: 「このページを表示して」とサーバーに依頼
🏪 サーバー: HTMLページを送信
📱 ブラウザ: 綺麗に画面表示
```

### cURLでのアクセス（開発者の方法）
```
👤 あなた: ターミナルでcurlコマンド実行
💻 curl: 「データをください」とサーバーに依頼
🏪 サーバー: JSON データを送信
💻 curl: 生データをそのまま表示（見た目の装飾なし）
```

## なぜcURLでテストするの？

### 1. APIの純粋な動作確認
```
🎭 ブラウザ = 「お化粧した状態」
• HTML, CSS, JavaScriptで装飾
• 見た目は綺麗だが、データの中身が見えにくい

🔬 curl = 「すっぴん状態」  
• サーバーから送信された生データそのまま
• APIが正しく動いているか直接確認可能
```

### 2. フロントエンドに依存しない
```
👥 チーム開発の例:

デザイナー: 「画面のデザインまだ未完成...」
フロントエンド: 「JavaScript書いてる途中...」
バックエンド: 「APIは完成した！テストしよう」

→ curl使用で即座にAPIテスト可能 🚀
```

## 今回テストするAPI一覧

```
📋 メモ管理API テストメニュー

1. GET    /api/health        - サーバー生存確認
2. GET    /api/memos         - 全メモ一覧取得
3. POST   /api/memos         - 新メモ作成
4. GET    /api/memos/1       - 特定メモ取得  
5. PUT    /api/memos/1       - メモ更新
6. DELETE /api/memos/1       - メモ削除
```

## テストコマンド詳細解説

### 1. ヘルスチェック（ウォーミングアップ）
```bash
curl http://localhost:8080/api/health
```

**意味**: 「お店開いてますか？」
**期待する結果**:
```json
{"status":"OK","message":"Server is running"}
```

### 2. 空のメモ一覧取得（初期状態確認）
```bash
curl http://localhost:8080/api/memos
```

**意味**: 「メモ一覧見せてください（初回なので空のはず）」
**期待する結果**:
```json
{"success":true,"data":[]}
```

### 3. 新メモ作成（データ挿入テスト）
```bash
curl -X POST http://localhost:8080/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"初回テストメモ","content":"cURLからの作成テスト"}'
```

#### コマンドの詳細解説
- `-X POST`: POSTメソッドを指定（お店で「注文します」宣言）
- `-H "Content-Type: application/json"`: 「JSONデータを送信します」宣言
- `-d '...'`: 送信するデータ本体

**身近な例**: レストランでの注文
```
👤 お客さん: 「注文お願いします」(-X POST)
👤 お客さん: 「メニュー表見て注文します」(-H Content-Type)
👤 お客さん: 「ハンバーガー1個ください」(-d データ)
```

**期待する結果**:
```json
{"success":true,"data":{"id":1,"message":"Memo created successfully"}}
```

### 4. メモ一覧再取得（作成確認）
```bash
curl http://localhost:8080/api/memos
```

**期待する結果**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "初回テストメモ",
      "content": "cURLからの作成テスト",
      "created_at": "2024-01-XX XX:XX:XX",
      "updated_at": "2024-01-XX XX:XX:XX"
    }
  ]
}
```

### 5. 特定メモ取得
```bash
curl http://localhost:8080/api/memos/1
```

**意味**: 「ID番号1のメモだけ見せて」
**期待する結果**: 上記と同じメモデータが1件

### 6. メモ更新
```bash
curl -X PUT http://localhost:8080/api/memos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"更新テストメモ","content":"内容も更新しました"}'
```

**意味**: 「ID番号1のメモを新しい内容に変更して」
**期待する結果**:
```json
{"success":true,"data":{"message":"Memo updated successfully"}}
```

### 7. 更新確認
```bash
curl http://localhost:8080/api/memos/1
```

**期待する結果**: updated_atが新しい時刻に変更されている

### 8. メモ削除
```bash
curl -X DELETE http://localhost:8080/api/memos/1
```

**意味**: 「ID番号1のメモを削除して」
**期待する結果**:
```json
{"success":true,"data":{"message":"Memo deleted successfully"}}
```

### 9. 削除確認
```bash
curl http://localhost:8080/api/memos
```

**期待する結果**: 再び空の配列 `{"success":true,"data":[]}`

## エラーパターンのテスト

### 1. 無効なIDでアクセス
```bash
curl http://localhost:8080/api/memos/999
```
**期待する結果**: 404 Not Found

### 2. タイトル無しでメモ作成
```bash
curl -X POST http://localhost:8080/api/memos \
  -H "Content-Type: application/json" \
  -d '{"content":"タイトルなしテスト"}'
```
**期待する結果**: 400 Bad Request "Title is required"

### 3. 不正なJSON送信
```bash
curl -X POST http://localhost:8080/api/memos \
  -H "Content-Type: application/json" \
  -d '{"title":"不完全なJSON"'
```
**期待する結果**: 400 Bad Request またはJSON Parse Error

## レスポンスの見方

### 成功時のパターン
```json
{
  "success": true,
  "data": { /* 実際のデータ */ }
}
```

### エラー時のパターン  
```json
{
  "success": false,
  "error": "エラーの説明文"
}
```

### HTTPステータスコード確認
```bash
curl -i http://localhost:8080/api/memos
```
`-i` オプションで、レスポンスヘッダーも表示（ステータスコード確認可能）

## トラブルシューティング

### よくある問題と対処法

#### 1. "Connection refused"
```
原因: サーバーが起動していない
対処: node server.js を実行
```

#### 2. "Empty reply from server"  
```
原因: ポート番号間違い
対処: localhost:8080 を確認
```

#### 3. JSON Parse Error
```
原因: JSON形式が正しくない
対処: ダブルクォート、カンマ、括弧を確認
```

#### 4. 404 Not Found
```
原因: URLパスが間違っている
対処: /api/memos のスペルを確認
```

## 実行順序

### 推奨テスト手順
```
1. ヘルスチェック（サーバー確認）
2. 空の一覧取得（初期状態確認）  
3. メモ作成（POST）
4. 一覧取得（作成確認）
5. 特定メモ取得（GET）
6. メモ更新（PUT）
7. 更新確認（GET）
8. メモ削除（DELETE）
9. 削除確認（GET）
```

## 実際の開発での活用

### 1. 自動テストスクリプト作成
```bash
#!/bin/bash
echo "API テスト開始..."
curl http://localhost:8080/api/health
# ... 他のテストコマンド
echo "API テスト完了"
```

### 2. CI/CDでの活用
```
開発者がコード更新
→ 自動でcurlテスト実行  
→ 全テスト成功したらデプロイ
→ 問題があれば通知
```

### 3. APIドキュメント作成
```
各エンドポイントの期待動作を記録
→ チームメンバーが理解しやすい
→ 新メンバーの学習に活用
```

これでAPIが正しく動作するか、一つずつ確認していきましょう！🚀