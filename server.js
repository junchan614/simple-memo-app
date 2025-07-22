const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// ミドルウェア設定
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 基本ルート
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ヘルスチェック用エンドポイント
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`WSL IP: http://192.168.117.99:${PORT}`);
});

module.exports = app;