const Database = require('better-sqlite3');
const path = require('path');

async function test() {
    const dbPath = path.join(__dirname, 'interior_design.db');
    const db = new Database(dbPath);

    // 1. Get a user ID
    const user = db.prepare('SELECT id FROM users LIMIT 1').get();
    if (!user) {
        console.log('No users found. Run signup test first.');
        return;
    }
    console.log('Testing with User ID:', user.id);

    // 2. Insert a dummy design
    try {
        const stmt = db.prepare(`
            INSERT INTO designs (user_id, original_image, generated_image, theme, dimensions, cost_estimation)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmt.run(user.id, 'test_orig.jpg', 'test_gen.jpg', 'Modern', '10x10', JSON.stringify([{ item: 'Chair', cost: 100 }]));
        console.log('Inserted dummy design.');
    } catch (e) {
        console.error('Insert Failed:', e);
    }

    // 3. Fetch History via API
    try {
        const response = await fetch(`http://localhost:5000/api/design/history/${user.id}`);
        const data = await response.json();
        console.log('History Count:', data.length);
        console.log('First Item:', data[0]);
    } catch (e) {
        console.error('Fetch Failed:', e);
    }
}

test();
