// DOM要素の取得
const memoForm = document.getElementById('memoForm');
const memoContainer = document.getElementById('memoContainer');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 シンプルメモアプリ起動');
    loadMemos();
    setupFormHandler();
});

// フォーム送信処理の設定
function setupFormHandler() {
    memoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createMemo();
    });
}

// メモ作成・更新
async function createMemo() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // バリデーション
    if (!title) {
        showMessage('タイトルを入力してください', 'error');
        return;
    }

    try {
        showMessage('保存中...', 'loading');

        // 編集モードかどうかチェック
        const editingId = memoForm.dataset.editingId;
        let response, successMessage;

        if (editingId) {
            // 更新処理
            response = await fetch(`/api/memos/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });
            successMessage = 'メモを更新しました！';
        } else {
            // 新規作成処理
            response = await fetch('/api/memos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });
            successMessage = 'メモを作成しました！';
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // フォームをリセット
            memoForm.reset();
            delete memoForm.dataset.editingId; // 編集モード解除
            
            // メモ一覧を再表示
            await loadMemos();
            
            showMessage(successMessage, 'success');
        } else {
            throw new Error(result.error || '保存に失敗しました');
        }
    } catch (error) {
        console.error('メモ作成/更新エラー:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showMessage('サーバーに接続できません', 'error');
        } else {
            showMessage('メモの保存に失敗しました', 'error');
        }
    }
}

// メモ一覧の読み込み
async function loadMemos() {
    try {
        showMessage('読み込み中...', 'loading');

        // API経由でメモ一覧取得
        const response = await fetch('/api/memos');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            displayMemos(result.data);
        } else {
            throw new Error(result.error || '読み込みに失敗しました');
        }
        
        // ローディングメッセージを削除
        clearMessages();
    } catch (error) {
        console.error('メモ読み込みエラー:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showMessage('サーバーに接続できません', 'error');
        } else {
            showMessage('メモの読み込みに失敗しました', 'error');
        }
        displayMemos([]); // エラー時は空の配列を表示
    }
}

// メモ一覧の表示
function displayMemos(memos) {
    // コンテナをクリア
    memoContainer.innerHTML = '';

    if (memos.length === 0) {
        memoContainer.innerHTML = '<p class="no-memos">まだメモがありません。上のフォームから作成してください。</p>';
        return;
    }

    // メモを一つずつ表示
    memos.forEach(memo => {
        const memoElement = createMemoElement(memo);
        memoContainer.appendChild(memoElement);
    });
}

// メモ要素の作成
function createMemoElement(memo) {
    const memoDiv = document.createElement('div');
    memoDiv.className = 'memo-item';
    memoDiv.dataset.id = memo.id;

    const createdDate = new Date(memo.created_at).toLocaleString('ja-JP');
    const updatedDate = new Date(memo.updated_at).toLocaleString('ja-JP');

    memoDiv.innerHTML = `
        <div class="memo-header">
            <h3 class="memo-title">${escapeHtml(memo.title)}</h3>
            <div class="memo-actions">
                <button class="btn btn-secondary" onclick="editMemo(${memo.id})">編集</button>
                <button class="btn btn-danger" onclick="deleteMemo(${memo.id})">削除</button>
            </div>
        </div>
        <div class="memo-content">${escapeHtml(memo.content || '')}</div>
        <div class="memo-meta">
            作成: ${createdDate}
            ${memo.created_at !== memo.updated_at ? ` | 更新: ${updatedDate}` : ''}
        </div>
    `;

    return memoDiv;
}

// メモ編集
async function editMemo(id) {
    try {
        // API経由で特定のメモを取得
        const response = await fetch(`/api/memos/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                showMessage('メモが見つかりません', 'error');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }

        const result = await response.json();

        if (result.success) {
            const memo = result.data;
            
            // フォームに既存の値を設定
            titleInput.value = memo.title;
            contentInput.value = memo.content || '';

            // 編集対象のIDを記録（更新時に使用）
            memoForm.dataset.editingId = id;

            // フォームにフォーカス
            titleInput.focus();
            
            showMessage('編集モードです。内容を変更して保存してください', 'success');
        } else {
            throw new Error(result.error || '編集に失敗しました');
        }
    } catch (error) {
        console.error('メモ編集エラー:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showMessage('サーバーに接続できません', 'error');
        } else {
            showMessage('メモの編集に失敗しました', 'error');
        }
    }
}

// メモ削除
async function deleteMemo(id, showConfirm = true) {
    try {
        if (showConfirm && !confirm('このメモを削除しますか？')) {
            return;
        }

        // API経由でメモ削除
        const response = await fetch(`/api/memos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            if (response.status === 404) {
                showMessage('メモが見つかりません', 'error');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }

        const result = await response.json();

        if (result.success) {
            // メモ一覧を再表示
            await loadMemos();
            
            if (showConfirm) {
                showMessage('メモを削除しました', 'success');
            }
        } else {
            throw new Error(result.error || '削除に失敗しました');
        }
    } catch (error) {
        console.error('メモ削除エラー:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showMessage('サーバーに接続できません', 'error');
        } else {
            showMessage('メモの削除に失敗しました', 'error');
        }
    }
}

// メッセージ表示
function showMessage(message, type = 'info') {
    // 既存のメッセージを削除
    clearMessages();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // メッセージをフォームの上に挿入
    memoForm.parentNode.insertBefore(messageDiv, memoForm);

    // 成功・エラーメッセージは3秒後に自動削除
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            clearMessages();
        }, 3000);
    }
}

// メッセージクリア
function clearMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

// HTMLエスケープ（XSS対策）
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// API接続確認（後で使用）
async function checkAPIConnection() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('🔗 APIサーバー接続確認:', data);
        return true;
    } catch (error) {
        console.error('❌ APIサーバー接続エラー:', error);
        return false;
    }
}