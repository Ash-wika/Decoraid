const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

async function testEndpoint() {
    try {
        const form = new FormData();
        // Use an existing image
        const uploadsDir = path.join(__dirname, 'uploads');
        const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

        if (files.length === 0) {
            console.log('No images found');
            return;
        }

        const imagePath = path.join(uploadsDir, files[0]);
        console.log('Uploading:', imagePath);

        form.append('image', fs.createReadStream(imagePath));
        form.append('dimensions', '10x10');
        form.append('theme', 'Modern');
        form.append('userId', '1'); // Assuming user ID 1 exists, or use what's in DB

        const response = await axios.post('http://127.0.0.1:5000/api/design/generate', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error Message:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received. Request info:', error.request._currentRequest ? error.request._currentRequest : 'Hidden');
        } else {
            console.error('Error Config:', error.config);
        }
    }
}

testEndpoint();
