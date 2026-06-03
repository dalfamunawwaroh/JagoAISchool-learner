import { pool } from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
async function main() {
    console.log('Testing profile update with Base64...');
    const userId = 1;
    const fullName = 'Alex (You)';
    const username = 'alexdev';
    const bio = 'Test bio';
    const websiteUrl = 'https://alexdev.io';
    const linkedinUrl = 'https://linkedin.com/in/alexdev';
    // A small 1x1 red dot base64 PNG
    const avatarUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU55ErkJggg==';
    try {
        const [result] = await pool.query(`UPDATE users SET 
        full_name = COALESCE(?, full_name), 
        username = COALESCE(?, username), 
        bio = ?, 
        website_url = ?, 
        linkedin_url = ?, 
        avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?`, [fullName, username, bio || null, websiteUrl || null, linkedinUrl || null, avatarUrl || null, userId]);
        console.log('SUCCESS: Profile updated in database!', result);
    }
    catch (error) {
        console.error('FAILURE: Error updating profile:', error);
    }
    finally {
        await pool.end();
    }
}
main();
