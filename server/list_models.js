require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        // For some SDK versions, listModels might be on the client or model manager
        // If not available directly, we'll try to infer from error or just try a known working model like 'gemini-pro'
        console.log('Attempting to use gemini-pro...');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log('gemini-pro works:', await result.response.text());
    } catch (e) {
        console.log('gemini-pro failed:', e.message);
    }

    try {
        console.log('Attempting to use gemini-1.5-flash-latest...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log('gemini-1.5-flash-latest works:', await result.response.text());
    } catch (e) {
        console.log('gemini-1.5-flash-latest failed:', e.message);
    }
}

listModels();
