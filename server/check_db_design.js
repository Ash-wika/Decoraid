const { db } = require('./src/db/init');

const stmt = db.prepare('SELECT * FROM designs ORDER BY created_at DESC LIMIT 1');
const design = stmt.get();

console.log('Latest Design:', design);
if (design) {
    console.log('Cost Estimation Type:', typeof design.cost_estimation);
    console.log('Cost Estimation Value:', design.cost_estimation);
}
