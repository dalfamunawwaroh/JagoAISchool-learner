import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectionUri = process.env.DATABASE_URL || 'mysql://root:postgres@localhost:3306/jagoaischool';

console.log('Connecting to MySQL database...');

export const pool = mysql.createPool({
  uri: connectionUri,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(' Successfully connected to MySQL database: jagoaischool!');
    conn.release();
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error);
  }
})();
