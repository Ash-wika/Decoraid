require('dotenv').config();
const aiService = require('./src/services/ai.service');
const path = require('path');
const fs = require('fs');

async function test() {
    try {
        console.log('Testing Gemini Integration...');

        // Use an existing image from uploads
        const uploadsDir = path.join(__dirname, 'uploads');
        let files = [];
        try {
            files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
        } catch (e) {
            console.log('Uploads dir not found or empty');
        }

        if (files.length === 0) {
            console.log('No images found in uploads to test with. Please upload an image via the UI first.');
            return;
        }

        const imagePath = path.join(uploadsDir, files[0]);
        console.log('Testing with image:', imagePath);

        console.log('1. Testing generateRoom (Expect fallback/mock)...');
        const result = await aiService.generateRoom(imagePath, 'Modern', '10x10');
        console.log('Generate Result:', result);

        console.log('2. Testing estimateCost (Expect JSON result)...');
        const cost = await aiService.estimateCost(imagePath, '10x10');
        console.log('Cost Result:', JSON.stringify(cost, null, 2));

    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
