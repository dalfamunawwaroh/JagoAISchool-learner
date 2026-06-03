import { Router } from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// 1. GET ALL DISCUSSION CATEGORIES WITH THREAD COUNT
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await pool.query(`SELECT dc.*, COUNT(dt.id) as count 
       FROM discussion_categories dc
       LEFT JOIN discussion_threads dt ON dc.id = dt.category_id
       GROUP BY dc.id`);
        res.json(categories);
    }
    catch (error) {
        console.error('Fetch categories error:', error);
        res.status(500).json({ error: 'Server error fetching categories' });
    }
});
// 2. GET THREADS BY CATEGORY / SEARCH
router.get('/threads', async (req, res) => {
    const { category, search } = req.query;
    try {
        let sql = `
      SELECT dt.*, u.full_name as author_name, u.avatar_url as author_avatar, dc.name as category_name
      FROM discussion_threads dt
      JOIN users u ON dt.author_id = u.id
      JOIN discussion_categories dc ON dt.category_id = dc.id
      WHERE 1=1
    `;
        const params = [];
        if (category) {
            sql += ' AND dc.name = ?';
            params.push(category);
        }
        if (search) {
            sql += ' AND (dt.title LIKE ? OR dt.title LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        sql += ' ORDER BY dt.created_at DESC';
        const [threads] = await pool.query(sql, params);
        // Fetch tags for each thread
        const threadsWithTags = await Promise.all(threads.map(async (thread) => {
            const [tags] = await pool.query(`SELECT t.name FROM thread_tags t
           JOIN thread_tag_mappings ttm ON t.id = ttm.tag_id
           WHERE ttm.thread_id = ?`, [thread.id]);
            return {
                ...thread,
                tags: tags.map(t => t.name)
            };
        }));
        res.json(threadsWithTags);
    }
    catch (error) {
        console.error('Fetch threads error:', error);
        res.status(500).json({ error: 'Server error fetching threads' });
    }
});
// 3. CREATE NEW THREAD TOPIC
router.post('/threads', authenticateToken, async (req, res) => {
    const { title, categoryName, tags } = req.body; // tags is string[]
    if (!title || !categoryName) {
        return res.status(400).json({ error: 'Title and Category are required' });
    }
    try {
        // Get category ID
        const [categories] = await pool.query('SELECT id FROM discussion_categories WHERE name = ?', [categoryName]);
        if (categories.length === 0) {
            return res.status(400).json({ error: 'Invalid category name' });
        }
        const categoryId = categories[0].id;
        // Insert Thread
        const [result] = await pool.query('INSERT INTO discussion_threads (title, author_id, category_id) VALUES (?, ?, ?)', [title, req.userId, categoryId]);
        const threadId = result.insertId;
        // Process Tags
        if (tags && Array.isArray(tags)) {
            for (const tagName of tags) {
                // Remove '#' if present
                const cleanTagName = tagName.replace('#', '').trim();
                if (!cleanTagName)
                    continue;
                // Find or create tag
                let tagId;
                const [existingTags] = await pool.query('SELECT id FROM thread_tags WHERE name = ?', [cleanTagName]);
                if (existingTags.length > 0) {
                    tagId = existingTags[0].id;
                }
                else {
                    const [newTagResult] = await pool.query('INSERT INTO thread_tags (name) VALUES (?)', [cleanTagName]);
                    tagId = newTagResult.insertId;
                }
                // Map tag
                await pool.query('INSERT INTO thread_tag_mappings (thread_id, tag_id) VALUES (?, ?)', [threadId, tagId]);
            }
        }
        res.status(201).json({
            message: 'Thread topic created successfully!',
            threadId
        });
    }
    catch (error) {
        console.error('Create thread error:', error);
        res.status(500).json({ error: 'Server error creating thread topic' });
    }
});
// 4. GET CHAT MESSAGES BY THREAD ID
router.get('/threads/:id/messages', authenticateToken, async (req, res) => {
    const threadId = parseInt(req.params.id);
    try {
        const [messages] = await pool.query(`SELECT cm.*, u.full_name as author_name, u.avatar_url as author_avatar, u.role as author_role,
              parent.full_name as reply_to_author, parent_msg.content as reply_to_content
       FROM chat_messages cm
       JOIN users u ON cm.user_id = u.id
       LEFT JOIN chat_messages parent_msg ON cm.reply_to_id = parent_msg.id
       LEFT JOIN users parent ON parent_msg.user_id = parent.id
       WHERE cm.thread_id = ?
       ORDER BY cm.created_at ASC`, [threadId]);
        // Fetch reactions for each message
        const messagesWithReactions = await Promise.all(messages.map(async (msg) => {
            const [reactions] = await pool.query('SELECT emoji, user_id FROM message_reactions WHERE message_id = ?', [msg.id]);
            // Group reactions by emoji, listing user names
            const reactionGroups = [];
            const uniqueEmojis = [...new Set(reactions.map(r => r.emoji))];
            for (const emoji of uniqueEmojis) {
                const userIds = reactions.filter(r => r.emoji === emoji).map(r => r.user_id);
                // Fetch names for these user IDs
                let userNames = [];
                if (userIds.length > 0) {
                    const [users] = await pool.query(`SELECT full_name FROM users WHERE id IN (${userIds.join(',')})`);
                    userNames = users.map(u => u.full_name);
                }
                reactionGroups.push({
                    emoji,
                    users: userNames
                });
            }
            return {
                id: msg.id,
                userId: msg.user_id,
                user: msg.author_name,
                avatar: msg.author_avatar,
                role: msg.author_role,
                content: msg.content,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                replyTo: msg.reply_to_id ? `${msg.reply_to_author}: "${msg.reply_to_content.substring(0, 35)}..."` : undefined,
                imageAttachment: msg.image_attachment_url || undefined,
                fileAttachment: msg.file_attachment_name || undefined,
                fileAttachmentUrl: msg.file_attachment_url || undefined,
                reactions: reactionGroups
            };
        }));
        res.json(messagesWithReactions);
    }
    catch (error) {
        console.error('Fetch chat messages error:', error);
        res.status(500).json({ error: 'Server error fetching chat messages' });
    }
});
// 5. SEND CHAT MESSAGE IN THREAD
router.post('/threads/:id/messages', authenticateToken, async (req, res) => {
    const threadId = parseInt(req.params.id);
    const { content, replyToId, imageAttachmentUrl, fileAttachmentName, fileAttachmentUrl } = req.body;
    if (!content && !imageAttachmentUrl && !fileAttachmentName) {
        return res.status(400).json({ error: 'Message content or attachment is required' });
    }
    try {
        // Insert Chat Message
        await pool.query(`INSERT INTO chat_messages 
        (thread_id, user_id, content, reply_to_id, image_attachment_url, file_attachment_name, file_attachment_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            threadId,
            req.userId,
            content || '',
            replyToId || null,
            imageAttachmentUrl || null,
            fileAttachmentName || null,
            fileAttachmentUrl || null
        ]);
        // Update replies count in Thread
        await pool.query('UPDATE discussion_threads SET replies_count = replies_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [threadId]);
        res.status(201).json({ message: 'Message sent successfully!' });
    }
    catch (error) {
        console.error('Send chat message error:', error);
        res.status(500).json({ error: 'Server error sending chat message' });
    }
});
// 6. LIKE / UPVOTE THREAD
router.post('/threads/:id/like', authenticateToken, async (req, res) => {
    const threadId = parseInt(req.params.id);
    try {
        // Check if already liked
        const [existing] = await pool.query('SELECT thread_id FROM thread_likes WHERE thread_id = ? AND user_id = ?', [threadId, req.userId]);
        if (existing.length > 0) {
            // Unlike
            await pool.query('DELETE FROM thread_likes WHERE thread_id = ? AND user_id = ?', [threadId, req.userId]);
            await pool.query('UPDATE discussion_threads SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ?', [threadId]);
            return res.json({ message: 'Thread unliked', liked: false });
        }
        // Like
        await pool.query('INSERT INTO thread_likes (thread_id, user_id) VALUES (?, ?)', [threadId, req.userId]);
        await pool.query('UPDATE discussion_threads SET likes_count = likes_count + 1 WHERE id = ?', [threadId]);
        res.json({ message: 'Thread liked', liked: true });
    }
    catch (error) {
        console.error('Like thread error:', error);
        res.status(500).json({ error: 'Server error updating thread likes' });
    }
});
// 7. MESSAGE EMOJI REACTION (Single reaction toggle per user)
router.post('/messages/:id/react', authenticateToken, async (req, res) => {
    const messageId = parseInt(req.params.id);
    const { emoji } = req.body; // e.g. 👍, ❤️
    if (!emoji) {
        return res.status(400).json({ error: 'Emoji is required' });
    }
    try {
        // Check if user has already reacted to this emoji
        const [existingReaction] = await pool.query('SELECT emoji FROM message_reactions WHERE message_id = ? AND user_id = ?', [messageId, req.userId]);
        if (existingReaction.length > 0) {
            const currentEmoji = existingReaction[0].emoji;
            // Delete old reaction
            await pool.query('DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?', [messageId, req.userId]);
            // If clicked a different emoji, add the new reaction
            if (currentEmoji !== emoji) {
                await pool.query('INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)', [messageId, req.userId, emoji]);
                return res.json({ message: 'Reaction updated!', emoji });
            }
            return res.json({ message: 'Reaction removed!', emoji: null });
        }
        // React
        await pool.query('INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)', [messageId, req.userId, emoji]);
        res.json({ message: 'Reaction added!', emoji });
    }
    catch (error) {
        console.error('React message error:', error);
        res.status(500).json({ error: 'Server error reacting to message' });
    }
});
export default router;
