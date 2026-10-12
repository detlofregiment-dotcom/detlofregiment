import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, migrate } from './db.js';

const [email, password] = process.argv.slice(2);
if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 12) {
  console.error('Usage: npm run create-admin -- admin@example.com "a-long-unique-password"');
  console.error('Password must be at least 12 characters. Do not reuse this password.');
  process.exit(1);
}
try {
  await migrate();
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users(email,password_hash,role) VALUES($1,$2,'admin')
     ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash, role='admin', active=TRUE
     RETURNING id,email,role`,
    [email.toLowerCase(), hash]
  );
  console.log('Admin account created/updated:', result.rows[0]);
} finally {
  await pool.end();
}
