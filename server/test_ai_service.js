require('dotenv').config();
const aiService = require('./src/services/ai.service');
const path = require('path');
const fs = require('fs');

async function test() {
    try {
        // Create dummy image
        const imagePath = path.join(__dirname, 'test_ai_image.jpg');
        fs.writeFileSync(imagePath, 'dummy content');

        console.log('Testing generateRoom...');
        const result = await aiService.generateRoom(imagePath, 'Modern', '10x10');
        console.log('Success:', result);
    } catch (e) {
        console.error('AI Service Failed:', e);
    }
}

test();
