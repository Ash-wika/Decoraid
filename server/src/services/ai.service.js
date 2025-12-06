const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
console.log('AI Service Initializing. Key present:', !!apiKey, 'Key length:', apiKey ? apiKey.length : 0, 'Key start:', apiKey ? apiKey.substring(0, 5) : 'N/A');
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

// Helper to convert file to base64 for Gemini
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

const generateRoom = async (imagePath, theme, dimensions) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('YOUR_KEY')) {
        console.log('No valid Gemini API Key provided, returning mock image.');
        return path.basename(imagePath); // Return original as mock
    }

    try {
        console.log('Generating room with theme:', theme);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
        const prompt = `Generate a photorealistic image of a room with the following theme: ${theme}. 
        The room should have similar dimensions to the input image: ${dimensions}. 
        Maintain the structural layout if possible but apply the new style.`;

        const imagePart = fileToGenerativePart(imagePath, "image/jpeg"); // Assuming jpeg/png

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;

        // Extract image from response
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            const parts = response.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inlineData) {
                    console.log('Image generated successfully.');
                    const buffer = Buffer.from(part.inlineData.data, 'base64');
                    const filename = `generated-${Date.now()}.png`;
                    const destPath = path.join(__dirname, '../../uploads', filename);
                    fs.writeFileSync(destPath, buffer);
                    return filename;
                }
            }
        }

        console.log('No image data found in response, falling back to original.');
        return path.basename(imagePath);

    } catch (error) {
        console.error('Gemini Generation Error:', error);
        // Fallback to original
        return path.basename(imagePath);
    }
};

const estimateCost = async (imagePath, dimensions) => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('YOUR_KEY')) {
        return [
            { item: 'Sofa (Mock)', cost: 600 },
            { item: 'Coffee Table (Mock)', cost: 200 },
            { item: 'Rug (Mock)', cost: 100 }
        ];
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `Analyze this room image. Identify 3-5 key furniture items or renovation tasks needed for a redesign. 
        Estimate the cost for each item in USD. 
        Return ONLY a valid JSON array like this: [{"item": "Sofa", "cost": 500}, {"item": "Paint", "cost": 100}]. 
        Do not include markdown formatting like \`\`\`json.`;

        const imagePart = fileToGenerativePart(imagePath, "image/jpeg");

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini Cost Estimation Error:', error);
        fs.appendFileSync(path.join(__dirname, '../../ai_errors.log'), `[${new Date().toISOString()}] Cost Est Error: ${error.stack || error}\n`);
        return [
            { item: 'Estimation Failed', cost: 0 }
        ];
    }
};

module.exports = { generateRoom, estimateCost };
