const express = require('express');
const router = express.Router();
const { createMemo, getAllMemos, getMemoById, updateMemo, deleteMemo } = require('../database/db');

// GET /api/memos - 全メモ取得
router.get('/', (req, res) => {
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
        console.error('GET /api/memos error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// POST /api/memos - 新メモ作成
router.post('/', (req, res) => {
    try {
        const { title, content } = req.body;
        
        // バリデーション
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const result = createMemo(title.trim(), content ? content.trim() : '');
        
        if (result.success) {
            res.status(201).json({
                success: true,
                data: {
                    id: result.id,
                    message: 'Memo created successfully'
                }
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('POST /api/memos error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// GET /api/memos/:id - 特定メモ取得
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // IDのバリデーション
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid memo ID'
            });
        }

        const result = getMemoById(id);
        
        if (result.success) {
            res.json({
                success: true,
                data: result.data
            });
        } else {
            res.status(404).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error(`GET /api/memos/${req.params.id} error:`, error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// PUT /api/memos/:id - メモ更新
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content } = req.body;
        
        // IDのバリデーション
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid memo ID'
            });
        }

        // タイトルのバリデーション
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const result = updateMemo(id, title.trim(), content ? content.trim() : '');
        
        if (result.success) {
            res.json({
                success: true,
                data: {
                    message: 'Memo updated successfully'
                }
            });
        } else {
            res.status(404).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error(`PUT /api/memos/${req.params.id} error:`, error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// DELETE /api/memos/:id - メモ削除
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // IDのバリデーション
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid memo ID'
            });
        }

        const result = deleteMemo(id);
        
        if (result.success) {
            res.json({
                success: true,
                data: {
                    message: 'Memo deleted successfully'
                }
            });
        } else {
            res.status(404).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error(`DELETE /api/memos/${req.params.id} error:`, error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;