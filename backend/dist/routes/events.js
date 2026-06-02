import { Router } from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// 1. GET ALL EVENTS
router.get('/', async (req, res) => {
    const { category, price } = req.query;
    try {
        let sql = `
      SELECT e.*, u.full_name as mentor_name, u.avatar_url as mentor_avatar
      FROM events e
      JOIN mentors m ON e.mentor_id = m.id
      JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
        const params = [];
        if (category && category !== 'All Events') {
            sql += ' AND e.category = ?';
            params.push(category);
        }
        if (price === 'Free') {
            sql += ' AND e.price_raw = 0.0';
        }
        else if (price === 'Paid') {
            sql += ' AND e.price_raw > 0.0';
        }
        sql += ' ORDER BY e.event_date ASC';
        const [events] = await pool.query(sql, params);
        res.json(events);
    }
    catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ error: 'Server error fetching events' });
    }
});
// 2. GET REGISTERED EVENTS
router.get('/registered', authenticateToken, async (req, res) => {
    try {
        const [registrations] = await pool.query(`SELECT er.*, e.title, e.event_date, e.event_time, e.image_url
       FROM event_registrations er
       JOIN events e ON er.event_id = e.id
       WHERE er.user_id = ?`, [req.userId]);
        res.json(registrations);
    }
    catch (error) {
        console.error('Fetch registered events error:', error);
        res.status(500).json({ error: 'Server error fetching registered events' });
    }
});
// 3. REGISTER FOR EVENT
router.post('/:id/register', authenticateToken, async (req, res) => {
    const eventId = parseInt(req.params.id);
    const { fullName, email, whatsappNumber } = req.body;
    if (!fullName || !email || !whatsappNumber) {
        return res.status(400).json({ error: 'Full name, email, and WhatsApp number are required' });
    }
    try {
        // Check if already registered
        const [existing] = await pool.query('SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?', [req.userId, eventId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You are already registered for this event' });
        }
        // Insert Registration
        await pool.query(`INSERT INTO event_registrations (event_id, user_id, full_name, email, whatsapp_number) 
       VALUES (?, ?, ?, ?, ?)`, [eventId, req.userId, fullName, email, whatsappNumber]);
        const [eventDetails] = await pool.query('SELECT title, event_date, event_time FROM events WHERE id = ?', [eventId]);
        const eventTitle = eventDetails[0]?.title || 'Event JagoAI';
        // Create system notification
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            req.userId,
            'Pendaftaran Event Sukses!',
            'Event Registration Confirmed!',
            `Tiket webinar/workshop "${eventTitle}" berhasil dibeli. Tautan ruangan virtual dikirim ke nomor WA: ${whatsappNumber}`,
            `Your ticket for "${eventTitle}" is confirmed. Access links are sent to your WA: ${whatsappNumber}`,
            'events'
        ]);
        res.status(201).json({ message: 'Registered for event successfully!' });
    }
    catch (error) {
        console.error('Register event error:', error);
        res.status(500).json({ error: 'Server error registering for event' });
    }
});
// 4. GET EVENT LEARNING HISTORY (PAST EVENTS FOR CERTIFICATES)
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const [history] = await pool.query('SELECT * FROM event_certificates WHERE user_id = ? ORDER BY issued_at DESC', [req.userId]);
        res.json(history);
    }
    catch (error) {
        console.error('Fetch learning history error:', error);
        res.status(500).json({ error: 'Server error fetching learning history' });
    }
});
export default router;
