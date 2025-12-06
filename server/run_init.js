const { initDb } = require('./src/db/init');
try {
    initDb();
    console.log('Manual initDb execution successful.');
} catch (e) {
    console.error('Manual initDb execution failed:', e);
}
