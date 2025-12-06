const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'interior_design.db');
const db = new Database(dbPath);

try {
    console.log('Adding name column...');
    db.prepare("ALTER TABLE users ADD COLUMN name TEXT").run();
    console.log('Column added successfully.');
} catch (error) {
    if (error.message.includes('duplicate column name')) {
        console.log('Column already exists.');
    } else {
        console.error('Error:', error);
    }
}
