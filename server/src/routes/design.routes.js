const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { db } = require('../db/init');
const aiService = require('../services/ai.service');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Create Uploads Dir if not exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Upload & Generate (Stub)
// Upload & Generate (Stub)
router.post('/generate', upload.single('image'), async (req, res) => {
    const logFile = path.join(__dirname, '../../server_requests.log');
    const log = (msg) => fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

    try {
        const { userId, theme, dimensions } = req.body;
        log(`Received generation request: userId=${userId}, theme=${theme}, dimensions=${dimensions}, file=${req.file ? req.file.filename : 'no file'}`);

        const file = req.file;

        if (!file) {
            log('Error: No image uploaded');
            return res.status(400).json({ error: 'No image uploaded' });
        }

        if (!userId) {
            log('Error: User not authenticated');
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Call AI Service
        log('Calling aiService.generateRoom...');
        const generatedImage = await aiService.generateRoom(file.path, theme, dimensions);
        log(`Generated image: ${generatedImage}`);

        // Fix: Construct full path for estimateCost because generatedImage is just a filename
        const generatedImagePath = path.join(__dirname, '../../uploads', generatedImage);
        log(`Estimating cost for: ${generatedImagePath}`);
        const costEstimation = await aiService.estimateCost(generatedImagePath, dimensions);
        log('Cost estimation complete');

        const stmt = db.prepare(`
      INSERT INTO designs (user_id, original_image, generated_image, theme, dimensions, cost_estimation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const info = stmt.run(userId, file.filename, generatedImage, theme, dimensions, JSON.stringify(costEstimation));
        log(`Database insert successful, ID: ${info.lastInsertRowid}`);

        res.json({
            id: info.lastInsertRowid,
            originalImage: file.filename,
            generatedImage,
            costEstimation: costEstimation
        });
    } catch (error) {
        console.error(error);
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] ERROR: ${error.stack || error}\n`);
        res.status(500).json({ error: 'Generation failed' });
    }
});

// Get User History
router.get('/history/:userId', (req, res) => {
    const { userId } = req.params;
    try {
        const stmt = db.prepare('SELECT * FROM designs WHERE user_id = ? ORDER BY created_at DESC');
        const designs = stmt.all(userId);
        res.json(designs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Delete Design
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM designs WHERE id = ?');
        const info = stmt.run(id);
        if (info.changes === 0) {
            return res.status(404).json({ error: 'Design not found' });
        }
        res.json({ message: 'Design deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete design' });
    }
});

module.exports = router;
