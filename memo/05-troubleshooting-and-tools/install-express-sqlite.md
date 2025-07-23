# npm install express better-sqlite3 コマンド解説

## コマンド概要
```bash
npm install express better-sqlite3
```

## 各パッケージの役割

### express
- **用途**: Node.js用のWebアプリケーションフレームワーク
- **機能**: 
  - HTTPサーバーの構築
  - ルーティング（URL別の処理分岐）
  - ミドルウェア（リクエスト処理の共通機能）
  - 静的ファイル配信
- **このプロジェクトでの使用目的**: メモアプリのバックエンドサーバー構築

### better-sqlite3
- **用途**: SQLiteデータベースのNode.js用ドライバー
- **特徴**:
  - 同期的な処理（async/awaitが不要）
  - 高速なパフォーマンス
  - ファイルベースのデータベース
- **このプロジェクトでの使用目的**: メモデータの永続化

## インストール後の変化

### package.json への追加
```json
{
  "dependencies": {
    "express": "^4.x.x",
    "better-sqlite3": "^8.x.x"
  }
}
```

### node_modules フォルダの作成
- 依存関係のパッケージが自動的にダウンロード・インストールされる
- 実際のライブラリファイルが格納される

### package-lock.json の生成
- 依存関係の正確なバージョンを記録
- チーム開発での環境統一に重要

## 次のステップ
1. server.js でExpressサーバーを構築
2. database/db.js でSQLite接続設定
3. routes/memos.js でAPI実装