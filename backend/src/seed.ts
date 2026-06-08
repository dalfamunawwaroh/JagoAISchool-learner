import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionUri = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/jagoaischool';

const tablesToClear = [
  'message_reactions',
  'chat_messages',
  'thread_likes',
  'thread_tag_mappings',
  'thread_tags',
  'discussion_threads',
  'discussion_categories',
  'lesson_progress',
  'course_enrollments',
  'lessons',
  'course_modules',
  'courses',
  'mentor_skills',
  'mentors',
  'mentorship_sessions',
  'portfolio_audits',
  'mock_interviews',
  'technical_tickets',
  'event_registrations',
  'event_certificates',
  'events',
  'ai_tool_pros',
  'ai_tools',
  'articles',
  'trending_news',
  'notifications',
  'device_sessions',
  'user_badges',
  'users'
];

(async () => {
  let conn;
  try {
    const pool = mysql.createPool({
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    conn = await pool.getConnection();
    console.log('⏳ Connected to database. Preparing to seed...');

    // Disable foreign key checks to truncate
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✓ Disabled foreign key checks.');

    for (const table of tablesToClear) {
      try {
        await conn.query(`TRUNCATE TABLE ${table}`);
        console.log(`✓ Truncated table: ${table}`);
      } catch (err) {
        // Table device_sessions might not exist yet if not created by app
        console.warn(`⚠ Could not truncate table ${table} (maybe doesn't exist yet)`);
      }
    }

    // Enable foreign key checks back
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✓ Re-enabled foreign key checks.');

    // Read jagoaischool.sql from the root directory
    const sqlFilePath = path.join(__dirname, '..', '..', 'jagoaischool.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Find the seed section
    const seedSectionStart = sqlContent.indexOf('-- SEED DATA FOR DEMO & TESTING');
    if (seedSectionStart === -1) {
      throw new Error('Could not find seed section in jagoaischool.sql');
    }

    let seedSql = sqlContent.substring(seedSectionStart);

    // Add dalfa@gmail.com user to the user seed statements
    // We will append it right after the seed users query
    const insertUsersQuery = "INSERT INTO users (id, email, password_hash, full_name, username, avatar_url, role, xp, level, language_preference, bio, website_url, linkedin_url, email_notifications, last_active_at) VALUES";
    const dalfaUserSql = `\n(5, 'dalfa@gmail.com', '$2a$10$IHNav7buqaHXDiWGX0oY4uI1I82/64K54pSBfnY28.Ezb3Eio3Bw6', 'Dalfa', 'dalfa', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', 'LEARNER', 1200, 1, 'id', 'Dedicated student learning AI at JagoAI.', NULL, NULL, TRUE, NOW()),`;
    
    // Insert dalfaUserSql right after the first "VALUES" of the user insert statement
    const insertUsersIndex = seedSql.indexOf(insertUsersQuery);
    if (insertUsersIndex !== -1) {
      const valuesIndex = seedSql.indexOf('VALUES', insertUsersIndex) + 'VALUES'.length;
      seedSql = seedSql.slice(0, valuesIndex) + dalfaUserSql + seedSql.slice(valuesIndex);
      console.log('✓ Injected test user "dalfa@gmail.com" into seeder.');
    }

    // Clean single-line comments from the SQL content first
    const cleanSql = seedSql
      .replace(/--.*$/gm, '') // Remove SQL comments starting with --
      .replace(/\r\n/g, '\n') // Normalize newlines

    // Split SQL by semicolons (making sure we don't split on semicolons inside strings/quotes)
    const statements = cleanSql
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/) // split by semicolon outside single quotes
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`⏳ Executing ${statements.length} seed statements...`);

    // Execute each query
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await conn.query(stmt);
      } catch (err: any) {
        console.error(`❌ Error executing statement #${i + 1}:`, stmt);
        console.error(err);
        throw err;
      }
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✨ Database successfully seeded with demo data!');
    
    conn.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (conn) {
      await conn.query('SET FOREIGN_KEY_CHECKS = 1');
      conn.release();
    }
    process.exit(1);
  }
})();
