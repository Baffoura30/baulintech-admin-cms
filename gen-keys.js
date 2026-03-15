const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET: ' + secret);

// If bcryptjs is available, use it. Otherwise, note it.
try {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('BaulinAdmin2024!', 10);
    console.log('ADMIN_PASSWORD_HASH: ' + hash);
} catch (e) {
    console.log('Bcryptjs not found in node_modules. Please run: npm install bcryptjs');
}
