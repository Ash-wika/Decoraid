const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'interior_design.db');
const outputPath = path.join(__dirname, 'db_info.txt');

try {
    const db = new Database(dbPath);
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const users = db.prepare("SELECT * FROM users").all();

    const output = `
Schema:
${JSON.stringify(tableInfo, null, 2)}

Users:
${JSON.stringify(users, null, 2)}
    `;

    fs.writeFileSync(outputPath, output);
    console.log('Done writing to file');
} catch (error) {
    fs.writeFileSync(outputPath, 'Error: ' + error.message);
    console.error('Error:', error);
}
