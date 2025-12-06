const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Minimal Server Running');
});

app.listen(PORT, () => {
    console.log(`Minimal Server running on port ${PORT}`);
});

setInterval(() => { console.log('Tick'); }, 5000);
