# server.js の解説 - Express.js基礎

## ファイルの役割
`server.js` は Express.js アプリケーションのメインファイル（エントリーポイント）です。
Webサーバーの設定、ルーティング、ミドルウェアの設定を行います。

## コード解説（行ごと）

### 1. ライブラリの読み込み
```javascript
const express = require('express');
const path = require('path');
```
- `express`: Webアプリケーションフレームワーク
- `path`: ファイルパスを扱うNode.js標準モジュール

### 2. アプリケーションの初期化
```javascript
const app = express();
const PORT = process.env.PORT || 3000;
```
- `app = express()`: Expressアプリケーションを作成
- `PORT`: サーバーが動作するポート番号（環境変数または3000番）

### 3. ミドルウェアの設定
```javascript
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
```

#### `express.json()`
- **用途**: JSON形式のリクエストボディを解析
- **必要な理由**: フロントエンドからのAJAXリクエスト（POST/PUT）でJSONデータを受け取るため
- **例**: `{ "title": "メモタイトル", "content": "メモ内容" }`

#### `express.static()`
- **用途**: 静的ファイル（HTML, CSS, JS, 画像など）の配信
- **設定**: `public` フォルダ内のファイルを直接アクセス可能にする
- **例**: `http://localhost:3000/style.css` → `public/style.css`

### 4. ルーティング設定

#### メインページのルート
```javascript
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```
- **URL**: `http://localhost:3000/`
- **動作**: `public/index.html` ファイルを送信
- **req**: リクエスト情報
- **res**: レスポンス操作用オブジェクト

#### ヘルスチェック用API
```javascript
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
```
- **URL**: `http://localhost:3000/api/health`
- **動作**: サーバーの稼働状況をJSON形式で返す
- **用途**: サーバーが正常に動作しているかの確認

### 5. サーバー起動
```javascript
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```
- **動作**: 指定されたポートでHTTPサーバーを起動
- **コールバック**: サーバー起動後にコンソールにメッセージ表示

### 6. モジュールエクスポート
```javascript
module.exports = app;
```
- **用途**: テスト用にアプリケーションをエクスポート
- **将来**: 他のファイルからサーバーをインポートできる

## HTTP リクエストの流れ

### 1. ブラウザからのアクセス
```
ブラウザ: http://localhost:3000/ にアクセス
```

### 2. Expressでの処理
```
1. ミドルウェア実行（express.json, express.static）
2. ルート照合（'/' にマッチ）
3. コールバック関数実行
4. index.html ファイル送信
```

### 3. ブラウザでの表示
```
ブラウザ: HTML ファイルを受信・表示
CSS/JS: 静的ファイルとして自動読み込み
```

## ミドルウェアとは？

### 概念
リクエストとレスポンスの間で実行される処理のこと。
複数のミドルウェアを連鎖的に実行できる。

### 実行順序
```
リクエスト
    ↓
express.json() ← JSONデータの解析
    ↓
express.static() ← 静的ファイルチェック
    ↓
ルート処理 ← app.get('/', ...)
    ↓
レスポンス
```

## 開発用コマンド

### サーバー起動
```bash
npm start
# または
npm run dev
```

### 動作確認
- **ブラウザ**: http://localhost:3000/
- **API確認**: http://localhost:3000/api/health

### 停止方法
- **コンソール**: `Ctrl + C`

## 今後の拡張ポイント

### 1. データベース接続
```javascript
// database/db.js を読み込み
const db = require('./database/db');
```

### 2. API Routes 分離
```javascript
// routes/memos.js を読み込み
const memosRouter = require('./routes/memos');
app.use('/api/memos', memosRouter);
```

### 3. エラーハンドリング
```javascript
// 404エラー処理
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
```

## 重要なポイント

### セキュリティ
- 環境変数でポート設定（`process.env.PORT`）
- 静的ファイル配信は `public` フォルダのみに限定

### パフォーマンス
- ミドルウェアの実行順序が重要
- 静的ファイルは Express が効率的に配信

### 保守性
- 機能ごとにファイル分割（今後 `routes/` フォルダを使用）
- 設定値は定数として定義（`PORT`）

## 次のステップ
1. `public/` フォルダ作成
2. `index.html` 作成
3. サーバー起動・動作確認
4. データベース設定（`database/db.js`）
5. API Routes 実装（`routes/memos.js`）