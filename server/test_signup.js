const Database = require('better-sqlite3');
const path = require('path');

async function test() {
    // 1. Check Database
    try {
        const dbPath = path.join(__dirname, 'interior_design.db');
        const db = new Database(dbPath);
        const table = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();

        if (!table) {
            console.log('FAIL: Users table does not exist!');
        } else {
            console.log('PASS: Users table exists.');
        }
    } catch (e) {
        console.error('DB Check Failed:', e);
    }

    // 2. Test Signup
    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test_node_' + Date.now() + '@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Signup Status:', response.status);
        console.log('Signup Data:', data);
    } catch (e) {
        console.error('Signup Failed:', e);
    }
}

test();
