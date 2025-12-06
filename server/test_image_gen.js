require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testImageGen() {
    try {
        console.log('Testing Image Generation with gemini-2.5-flash-image (Image + Prompt)...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        // Get an image from uploads
        const uploadsDir = path.join(__dirname, 'uploads');
        let files = [];
        try {
            files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
        } catch (e) {
            console.log('Uploads dir not found');
            return;
        }

        if (files.length === 0) {
            console.log('No images found to test with.');
            return;
        }
        const imagePath = path.join(uploadsDir, files[0]);
        console.log('Using image:', imagePath);

        // Read image and convert to Part
        const imageBuffer = fs.readFileSync(imagePath);
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: 'image/jpeg'
            }
        };

        const prompt = "Generate a photorealistic image of a modern minimalist bedroom with a large window and wood flooring.";

        // Pass both prompt and image
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;

        console.log('Response received.');

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            const parts = response.candidates[0].content.parts;
            let imageFound = false;

            for (const part of parts) {
                if (part.inlineData) {
                    console.log('Image data found! MimeType:', part.inlineData.mimeType);
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    fs.writeFileSync('test_gen_image_v2.png', buffer);
                    console.log('Saved to test_gen_image_v2.png');
                    imageFound = true;
                } else if (part.text) {
                    console.log('Text response:', part.text);
                }
            }

            if (!imageFound) {
                console.log('No inline image data found in response.');
            }
        } else {
            console.log('Unexpected response structure.');
        }

    } catch (error) {
        console.error('Generation Error:', error);
    }
}

testImageGen();
