// Genera un hash bcrypt para usar en ADMIN_PASSWORD_HASH (server/.env).
// Uso: node scripts/hash-password.js "mi-password-segura"
const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/hash-password.js "<tu-password>"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nAgregá esta línea a server/.env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
