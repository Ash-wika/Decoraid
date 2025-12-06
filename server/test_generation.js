const fs = require('fs');
const path = require('path');

async function test() {
    // 1. Create a dummy image file
    const imagePath = path.join(__dirname, 'test_image.jpg');
    fs.writeFileSync(imagePath, 'dummy image content');

    // 2. Prepare form data
    const formData = new FormData();
    const file = new Blob([fs.readFileSync(imagePath)], { type: 'image/jpeg' });
    formData.append('image', file, 'test_image.jpg');
    formData.append('theme', 'Modern');
    formData.append('dimensions', '10x10');
    formData.append('userId', '2');

    // 3. Send Request
    try {
        console.log('Sending request...');
        const response = await fetch('http://localhost:5000/api/design/generate', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
    } catch (e) {
        console.error('Request Failed:', e);
    }
}

test();
