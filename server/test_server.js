const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('ok'));
app.listen(5000, () => console.log('Minimal server running on 5000'));
setInterval(() => { }, 1000);
