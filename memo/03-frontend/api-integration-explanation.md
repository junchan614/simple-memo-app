# フロントエンドとAPI連携 超わかりやすい解説 - 高校生向け

## 現在の状況

### 今の状態 = 「2つの別々のお店が並行営業」
```
🏪 ローカルストレージ店         🏪 SQLite API店
（フロントエンドが使用中）      （curlでテスト済み）

👤 お客さん（ユーザー）           👤 開発者（curl）
↓                            ↓
🍔 メモをローカル保存           🍔 メモをDB保存
```

### 目標 = 「1つの統合店舗」
```
👤 お客さん（ユーザー）
↓
🏪 統合メモ管理店
├── 📱 綺麗な店舗（フロントエンド）
└── 📦 しっかりした倉庫（SQLite）
```

## なぜ連携が必要？

### 現在の問題点

#### 1. データが別々の場所に保存
```
❌ 分離状態:
フロントエンド → ローカルストレージ（ブラウザ内）
API → SQLiteデータベース（サーバー内）

問題:
• ブラウザ変更で消える
• 他の人と共有不可
• サーバー再起動でも消える可能性
```

#### 2. 機能の重複
```
❌ 無駄な重複:
フロントエンド: メモ作成・取得・更新・削除機能
API: メモ作成・取得・更新・削除機能

→ 2つのシステムを維持する手間
```

### 連携後の利点

#### 1. データの一元管理
```
✅ 統合状態:
フロントエンド → API → SQLiteデータベース

利点:
• データが永続化される
• 複数ブラウザで共有可能
• サーバー管理で安全
```

#### 2. 役割分担の明確化
```
✅ 効率的な分業:
フロントエンド: UI/UX（見た目・使いやすさ）
API: データ処理（保存・取得・検証）
データベース: データ保管（永続化・検索）
```

## 変更する部分

### script.js の主要変更点

#### Before（ローカルストレージ版）
```javascript
// データ保存
localStorage.setItem('memos', JSON.stringify(memos));

// データ取得
const memos = JSON.parse(localStorage.getItem('memos') || '[]');

// データ削除
const filteredMemos = memos.filter(m => m.id != id);
localStorage.setItem('memos', JSON.stringify(filteredMemos));
```

#### After（API連携版）
```javascript
// データ保存
const response = await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
});

// データ取得
const response = await fetch('/api/memos');
const result = await response.json();

// データ削除
const response = await fetch(`/api/memos/${id}`, {
    method: 'DELETE'
});
```

## 変更する関数一覧

### 1. createMemo() 関数
```javascript
// Before: ローカルストレージに追加
const memo = { id: Date.now(), title, content, ... };
existingMemos.unshift(memo);
localStorage.setItem('memos', JSON.stringify(existingMemos));

// After: APIサーバーに送信
const response = await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
});
```

### 2. loadMemos() 関数
```javascript
// Before: ローカルストレージから取得
const memos = JSON.parse(localStorage.getItem('memos') || '[]');

// After: APIサーバーから取得
const response = await fetch('/api/memos');
const result = await response.json();
const memos = result.data;
```

### 3. editMemo() 関数
```javascript
// Before: ローカルストレージで更新
const memos = JSON.parse(localStorage.getItem('memos') || '[]');
// ... 配列を編集
localStorage.setItem('memos', JSON.stringify(memos));

// After: APIサーバーで更新
const response = await fetch(`/api/memos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
});
```

### 4. deleteMemo() 関数
```javascript
// Before: ローカルストレージから削除
const filteredMemos = memos.filter(m => m.id != id);
localStorage.setItem('memos', JSON.stringify(filteredMemos));

// After: APIサーバーで削除
const response = await fetch(`/api/memos/${id}`, {
    method: 'DELETE'
});
```

## fetch API の基本パターン

### GET リクエスト（データ取得）
```javascript
try {
    const response = await fetch('/api/memos');
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
        // 成功時の処理
        return data.data;
    } else {
        // エラー時の処理
        throw new Error(data.error);
    }
} catch (error) {
    console.error('取得エラー:', error);
    showMessage('データの取得に失敗しました', 'error');
}
```

### POST リクエスト（データ作成）
```javascript
try {
    const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: titleValue,
            content: contentValue
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
        // 成功時の処理
        showMessage('メモを作成しました', 'success');
        loadMemos(); // 一覧を再読み込み
    } else {
        throw new Error(data.error);
    }
} catch (error) {
    console.error('作成エラー:', error);
    showMessage('メモの作成に失敗しました', 'error');
}
```

## エラーハンドリングの改善

### HTTP ステータスコードの対応
```javascript
if (response.status === 400) {
    showMessage('入力内容に問題があります', 'error');
} else if (response.status === 404) {
    showMessage('メモが見つかりません', 'error');
} else if (response.status === 500) {
    showMessage('サーバーエラーが発生しました', 'error');
} else if (!response.ok) {
    showMessage('予期せぬエラーが発生しました', 'error');
}
```

### ネットワークエラーの対応
```javascript
try {
    const response = await fetch('/api/memos');
} catch (error) {
    if (error instanceof TypeError) {
        // ネットワークエラー
        showMessage('サーバーに接続できません', 'error');
    } else {
        // その他のエラー
        showMessage('エラーが発生しました', 'error');
    }
}
```

## データフローの変化

### Before（ローカルストレージ版）
```
👤 ユーザー操作
↓
📱 JavaScript (script.js)
↓
💾 ローカルストレージ（ブラウザ内）
↓
📱 JavaScript で画面更新
```

### After（API連携版）
```
👤 ユーザー操作
↓
📱 JavaScript (script.js)
↓
🌐 HTTP リクエスト
↓
🏪 Express.js サーバー (routes/memos.js)
↓
📚 SQLite データベース (database/db.js)
↓
🌐 HTTP レスポンス
↓
📱 JavaScript で画面更新
```

## 実装のメリット

### 1. 本格的なWebアプリケーション
```
🌟 プロレベルのアーキテクチャ
• フロントエンド・バックエンド分離
• RESTful API設計
• データベース永続化
```

### 2. 拡張性の向上
```
🚀 将来的な発展性
• 複数ユーザー対応可能
• モバイルアプリとの連携可能
• 他システムとのAPI連携可能
```

### 3. 学習効果の向上
```
📚 実用的なスキル習得
• API通信の実装
• エラーハンドリング
• 非同期プログラミング
```

## 実装手順

### Step 1: APIテスト用関数の追加
```javascript
// API接続テスト関数
async function testAPIConnection() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('✅ API接続成功:', data);
        return true;
    } catch (error) {
        console.error('❌ API接続失敗:', error);
        return false;
    }
}
```

### Step 2: 既存関数の置き換え
```javascript
// 1つずつ関数を置き換え
// loadMemos() → API版に変更
// createMemo() → API版に変更
// updateMemo() → API版に変更
// deleteMemo() → API版に変更
```

### Step 3: エラー処理の改善
```javascript
// 適切なエラーメッセージ表示
// ローディング状態の表示
// ネットワークエラーの対応
```

### Step 4: 動作確認
```javascript
// ブラウザで動作確認
// ブラウザ更新でもデータが残るか確認
// 複数ブラウザでデータ共有確認
```

## 注意点

### 1. 非同期処理の理解
```javascript
// ❌ 同期的な書き方（動かない）
const memos = fetch('/api/memos');

// ✅ 非同期的な書き方
const response = await fetch('/api/memos');
const result = await response.json();
const memos = result.data;
```

### 2. エラーハンドリング必須
```javascript
// サーバーとの通信は失敗する可能性がある
// 必ず try-catch でエラー処理を実装
```

### 3. レスポンス形式の統一
```javascript
// API側: { success: true, data: [...] }
// フロントエンド側: result.data でデータアクセス
```

これで、ローカルストレージから本格的なAPI連携に移行します！
本物のWebアプリケーションに進化させましょう🚀