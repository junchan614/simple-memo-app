# シンプルメモアプリ - 技術要件

## プロジェクト概要
- **目的**: データベース基礎習得 + Express.js実践
- **期間**: 3-4日間（段階的学習重視）
- **学習レベル**: レベル2（前回: OpenAI API基礎、次回: 複雑なデータ管理とAI活用）

## 技術スタック

### Backend
- **Express.js v5.1.0**
  - Node.js用Webアプリケーションフレームワーク
  - ルーティング、ミドルウェア、静的ファイル配信
  - RESTful API実装

- **better-sqlite3 v12.2.0**
  - 高速なSQLiteデータベースドライバー
  - 同期的な処理（async/await不要）
  - ファイルベースのデータベース

### Frontend
- **HTML5**
  - セマンティックマークアップ
  - レスポンシブデザイン対応

- **CSS3**
  - モバイルファーストアプローチ
  - フレックスボックス/グリッドレイアウト
  - 直感的なUI/UX

- **バニラJavaScript (ES6+)**
  - DOM操作
  - fetch API でのHTTP通信
  - async/await による非同期処理
  - エラーハンドリング

### Database
- **SQLite**
  - ファイルベースのリレーショナルデータベース
  - シンプルなテーブル設計
  - CRUD操作（Create, Read, Update, Delete）

### Deployment
- **Railway**
  - Git連携でのクラウドデプロイ
  - 環境変数管理
  - 一般的なサーバー環境

- **GitHub**
  - ソースコード管理
  - 継続的デプロイ（CD）

## データベース設計

### memos テーブル
```sql
CREATE TABLE memos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API設計（RESTful）

### エンドポイント
- `GET /api/memos` - メモ一覧取得
- `POST /api/memos` - メモ作成
- `GET /api/memos/:id` - 特定メモ取得
- `PUT /api/memos/:id` - メモ更新
- `DELETE /api/memos/:id` - メモ削除

### レスポンス形式
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "サンプルメモ",
    "content": "メモの内容",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

## ファイル構造
```
simple-memo-app/
├── server.js              # Express.jsメインサーバー
├── package.json           # 依存関係・起動コマンド
├── routes/
│   └── memos.js           # メモ関連API Routes
├── database/
│   └── db.js              # SQLite接続・設定
├── public/                # 静的ファイル
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env                   # 環境変数（ローカル用）
├── .gitignore             # 除外ファイル設定
└── memo/                  # 学習メモ（Git除外）
```

## セキュリティ要件

### データベース
- SQLインジェクション対策（プレースホルダー使用）
- 入力値バリデーション
- 適切なエラーメッセージ（内部情報非開示）

### API
- 適切なHTTPステータスコード
- エラーハンドリング
- CORS設定（必要に応じて）

## パフォーマンス要件

### データベース
- 適切なインデックス設定
- 必要最小限のデータ取得
- 効率的なクエリ設計

### フロントエンド
- リアルタイム画面更新
- ローディング状態表示
- エラーフィードバック

## 前回プロジェクトからの継承スキル

### 技術的継承
- **非同期処理**: fetch + async/await パターン
- **環境変数管理**: process.env の使用法
- **エラーハンドリング**: try-catch 構文
- **DOM操作**: バニラJSでのUI制御
- **Git/GitHub**: バージョン管理とデプロイ連携

### 新規習得技術
- **サーバーサイドアーキテクチャ**: Express.js でのMVC的な構造
- **データ永続化**: ファイルベースデータベースの仕組み
- **API設計**: RESTful原則に基づいたエンドポイント設計
- **サーバー管理**: ポート、プロセス、ログ管理

## 学習目標

### 技術面
- Express.js の基本概念とミドルウェア
- SQLite でのCRUD操作
- RESTful API設計原則
- データベース設計の基礎
- サーバーサイド開発の流れ

### プロジェクト管理面
- 段階的開発手法
- デバッグスキル（サーバーサイド）
- ドキュメント作成
- トラブルシューティング

## 成功指標

### 機能面
- ✅ メモの作成・編集・削除・一覧表示
- ✅ データの永続化（サーバー再起動後も保持）
- ✅ レスポンシブデザイン対応
- ✅ エラーハンドリング

### 技術面
- ✅ Express.js サーバーが正常に動作
- ✅ SQLite でのデータ永続化が実現
- ✅ CRUD操作がすべて正常に動作
- ✅ Railway での本番デプロイが成功

### 学習面
- ✅ Express.js の基本概念を理解
- ✅ SQL基本文法とCRUD操作をマスター
- ✅ RESTful API設計原則を把握
- ✅ データベース設計の基礎を習得

## 次回プロジェクトへの準備

### 今回で習得予定のスキル
- サーバーサイド開発の基礎
- データベース設計・操作
- RESTful API の実装
- 一般的なデプロイプロセス

### 次回に向けた発展要素
- より複雑なデータベース設計（リレーション）
- ユーザー認証・認可
- リアルタイム機能（WebSocket）
- AI機能の高度な活用
- スケーラブルなアーキテクチャ