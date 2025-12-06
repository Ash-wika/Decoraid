require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // Just to check init
        // The SDK doesn't have a direct listModels method on the client instance in some versions, 
        // but we can try to use the API directly or just test known model names.
        // Actually, let's use the REST API to list models as it's more reliable for discovery.

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('Available Models:');
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (Supported generation methods: ${m.supportedGenerationMethods})`);
            });
        } else {
            console.log('No models found or error:', data);
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
