# script.js の解説 - フロントエンド JavaScript 基礎

## ファイルの役割
`script.js` はフロントエンド（ブラウザ側）で動作するJavaScriptファイルです。
ユーザーの操作に応じて画面を更新し、サーバーとのデータのやり取りを行います。

## コード構成

### 1. DOM要素の取得
```javascript
const memoForm = document.getElementById('memoForm');
const memoContainer = document.getElementById('memoContainer');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
```

#### 解説
- **DOM**: Document Object Model（HTMLの構造をJavaScriptで操作するための仕組み）
- **getElementById()**: HTML要素をIDで取得する関数
- **const**: 定数宣言（値が変わらない変数）

#### 対応するHTML
```html
<form id="memoForm">           <!-- memoForm -->
<input id="title">             <!-- titleInput -->
<textarea id="content">        <!-- contentInput -->
<div id="memoContainer">       <!-- memoContainer -->
```

### 2. アプリケーション初期化
```javascript
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 シンプルメモアプリ起動');
    loadMemos();
    setupFormHandler();
});
```

#### 解説
- **DOMContentLoaded**: HTMLの読み込み完了時に発生するイベント
- **addEventListener()**: イベントリスナー（イベント監視）の設定
- **アロー関数 `() => {}`**: 関数の短縮記法

#### 実行順序
1. HTMLページが完全に読み込まれる
2. DOMContentLoadedイベントが発生
3. コンソールにメッセージ表示
4. 既存のメモを読み込み（`loadMemos()`）
5. フォーム送信処理を設定（`setupFormHandler()`）

### 3. フォーム送信処理の設定
```javascript
function setupFormHandler() {
    memoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createMemo();
    });
}
```

#### 解説
- **submit イベント**: フォーム送信時に発生
- **e.preventDefault()**: ブラウザのデフォルト動作（ページリロード）を停止
- **async/await**: 非同期処理の書き方

### 4. メモ作成機能
```javascript
async function createMemo() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    // バリデーション
    if (!title) {
        showMessage('タイトルを入力してください', 'error');
        return;
    }
    // ...
}
```

#### 段階別処理

##### 4-1. 入力値の取得
```javascript
const title = titleInput.value.trim();
const content = contentInput.value.trim();
```
- **value**: input/textareaの入力内容を取得
- **trim()**: 前後の空白を削除

##### 4-2. バリデーション（入力チェック）
```javascript
if (!title) {
    showMessage('タイトルを入力してください', 'error');
    return;
}
```
- **!title**: titleが空文字列やnullの場合にtrue
- **return**: 関数の実行を中断

##### 4-3. メモオブジェクトの作成
```javascript
const memo = {
    id: Date.now(),
    title: title,
    content: content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};
```
- **Date.now()**: 現在時刻をミリ秒で取得（ユニークID生成）
- **new Date().toISOString()**: ISO形式の日時文字列

##### 4-4. ローカルストレージへの保存
```javascript
const existingMemos = JSON.parse(localStorage.getItem('memos') || '[]');
existingMemos.unshift(memo);
localStorage.setItem('memos', JSON.stringify(existingMemos));
```
- **localStorage**: ブラウザにデータを永続保存する仕組み
- **JSON.parse()**: JSON文字列をJavaScriptオブジェクトに変換
- **JSON.stringify()**: JavaScriptオブジェクトをJSON文字列に変換
- **unshift()**: 配列の先頭に要素を追加

### 5. メモ一覧の読み込み
```javascript
async function loadMemos() {
    try {
        showMessage('読み込み中...', 'loading');
        const memos = JSON.parse(localStorage.getItem('memos') || '[]');
        displayMemos(memos);
        clearMessages();
    } catch (error) {
        console.error('メモ読み込みエラー:', error);
        showMessage('メモの読み込みに失敗しました', 'error');
    }
}
```

#### try-catch構文
- **try**: エラーが発生する可能性のあるコードを記述
- **catch**: エラーが発生した場合の処理を記述

### 6. メモ一覧の表示
```javascript
function displayMemos(memos) {
    memoContainer.innerHTML = '';
    
    if (memos.length === 0) {
        memoContainer.innerHTML = '<p class="no-memos">まだメモがありません。</p>';
        return;
    }
    
    memos.forEach(memo => {
        const memoElement = createMemoElement(memo);
        memoContainer.appendChild(memoElement);
    });
}
```

#### 解説
- **innerHTML**: 要素の中身のHTMLを取得・設定
- **forEach()**: 配列の各要素に対して処理を実行
- **appendChild()**: 要素を子要素として追加

### 7. メモ要素の作成
```javascript
function createMemoElement(memo) {
    const memoDiv = document.createElement('div');
    memoDiv.className = 'memo-item';
    memoDiv.dataset.id = memo.id;
    
    memoDiv.innerHTML = `
        <div class="memo-header">
            <h3 class="memo-title">${escapeHtml(memo.title)}</h3>
            <!-- ... -->
        </div>
    `;
    
    return memoDiv;
}
```

#### DOM要素の動的作成
- **createElement()**: HTML要素を作成
- **className**: CSSクラスを設定
- **dataset**: data-*属性を設定
- **テンプレートリテラル**: `${}` でJavaScript変数を埋め込み

### 8. セキュリティ対策
```javascript
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

#### XSS攻撃対策
- **replace()**: 文字列置換
- **正規表現 `/g`**: 全体を対象に置換
- 悪意のあるHTMLタグを無効化

## データの流れ

### メモ作成時
```
1. ユーザーがフォーム入力
2. 送信ボタンクリック
3. JavaScript がフォーム送信をキャッチ
4. 入力値をバリデーション
5. メモオブジェクト作成
6. ローカルストレージに保存
7. 画面を更新
```

### メモ表示時
```
1. ページ読み込み完了
2. ローカルストレージからデータ取得
3. メモ一覧を動的に生成
4. HTMLに挿入・表示
```

## 非同期処理について

### async/await の使用理由
```javascript
async function createMemo() {
    // 将来的にサーバーAPIとの通信で時間がかかる処理
    await fetch('/api/memos', { method: 'POST', ... });
}
```

- **現在**: ローカルストレージ（即座に完了）
- **将来**: サーバーAPIとの通信（時間がかかる）

## イベント処理

### イベントの種類
1. **DOMContentLoaded**: ページ読み込み完了
2. **submit**: フォーム送信
3. **click**: ボタンクリック（編集・削除）

### イベントハンドラーの設定方法
```javascript
// 1. addEventListener（推奨）
element.addEventListener('click', function() { ... });

// 2. HTML内で直接指定（今回使用）
<button onclick="deleteMemo(123)">削除</button>
```

## エラーハンドリング

### 想定されるエラー
1. **ネットワークエラー**: サーバーとの通信失敗
2. **データ形式エラー**: JSONパースエラー
3. **バリデーションエラー**: 入力値の不備

### エラー表示の仕組み
```javascript
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    // フォームの上に表示
}
```

## ローカルストレージとは

### 特徴
- **永続性**: ブラウザを閉じても データが残る
- **容量**: 約5-10MB
- **スコープ**: 同一オリジン（ドメイン）のみ
- **形式**: 文字列のみ（JSONで変換）

### 使用方法
```javascript
// 保存
localStorage.setItem('key', 'value');

// 取得
const value = localStorage.getItem('key');

// 削除
localStorage.removeItem('key');
```

## 将来のAPI連携

### 現在の実装
```javascript
// ローカルストレージに保存
localStorage.setItem('memos', JSON.stringify(memos));
```

### 将来の実装
```javascript
// サーバーAPIに送信
const response = await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memo)
});
```

## デバッグ方法

### ブラウザの開発者ツール
1. **F12** で開発者ツールを開く
2. **Console** タブでエラー確認
3. **Application** タブでローカルストレージ確認
4. **Network** タブでAPI通信確認（将来）

### console.log() の活用
```javascript
console.log('🚀 シンプルメモアプリ起動');
console.error('メモ作成エラー:', error);
```

## 重要なポイント

### 1. DOM操作の基本
- 要素の取得（getElementById）
- 要素の作成（createElement）
- 要素の追加（appendChild）
- 内容の変更（innerHTML）

### 2. イベント処理
- イベントリスナーの設定
- イベントオブジェクトの活用
- デフォルト動作の制御

### 3. 非同期処理
- async/await の使い方
- Promiseの概念
- エラーハンドリング

### 4. セキュリティ
- XSS攻撃対策（HTMLエスケープ）
- 入力値のバリデーション

## 次のステップ
1. サーバー起動・動作確認
2. SQLiteデータベース実装
3. API Routesの実装
4. ローカルストレージからAPI連携への移行