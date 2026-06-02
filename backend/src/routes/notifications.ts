import { Router } from 'express';
import { pool } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// 1. GET USER NOTIFICATIONS
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { filter } = req.query; // 'all', 'unread', 'read'

  try {
    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    const params: any[] = [req.userId];

    if (filter === 'unread') {
      sql += ' AND is_read = FALSE';
    } else if (filter === 'read') {
      sql += ' AND is_read = TRUE';
    }

    sql += ' ORDER BY created_at DESC';

    const [notifications] = await pool.query<any[]>(sql, params);

    // Map backend response fields to camelCase structure expected by frontend component
    const mappedNotifs = notifications.map(n => ({
      id: n.id,
      titleId: n.title_id,
      titleEn: n.title_en,
      descId: n.desc_id,
      descEn: n.desc_en,
      timeId: 'Baru saja', // Standard default readable time elapsed
      timeEn: 'Just now',
      category: n.category,
      isRead: Boolean(n.is_read)
    }));

    res.json(mappedNotifs);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
});

// 2. TOGGLE / MARK NOTIFICATION AS READ
router.put('/:id/read', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);

  try {
    // Get existing state
    const [existing] = await pool.query<any[]>(
      'SELECT is_read FROM notifications WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const newReadState = !existing[0].is_read;

    await pool.query(
      'UPDATE notifications SET is_read = ? WHERE id = ? AND user_id = ?',
      [newReadState, id, req.userId]
    );

    res.json({ message: 'Notification read state toggled successfully!', isRead: newReadState });
  } catch (error) {
    console.error('Toggle notification read error:', error);
    res.status(500).json({ error: 'Server error marking notification as read' });
  }
});

// 3. DELETE NOTIFICATION
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const id = parseInt(req.params.id);

  try {
    const [result] = await pool.query<any>(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully!' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error deleting notification' });
  }
});

export default router;
