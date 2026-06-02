import { Router } from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// 1. GET ALL MENTORS WITH SKILLS
router.get('/mentors', async (req, res) => {
    try {
        const [mentors] = await pool.query(`SELECT m.*, u.full_name, u.avatar_url, u.bio
       FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE m.is_active = TRUE`);
        const mentorsWithSkills = await Promise.all(mentors.map(async (mentor) => {
            const [skills] = await pool.query('SELECT skill_name FROM mentor_skills WHERE mentor_id = ?', [mentor.id]);
            return {
                id: mentor.id,
                name: mentor.full_name,
                title: mentor.title,
                bio: mentor.bio,
                avatar: mentor.avatar_url,
                skills: skills.map(s => s.skill_name)
            };
        }));
        res.json(mentorsWithSkills);
    }
    catch (error) {
        console.error('Fetch mentors error:', error);
        res.status(500).json({ error: 'Server error fetching mentors' });
    }
});
// 2. BOOK 1-ON-1 MENTORSHIP SESSION
router.post('/mentorship/sessions', authenticateToken, async (req, res) => {
    const { mentorName, date, timeSlot, topicFocus, blockerDetails } = req.body;
    if (!mentorName || !date || !timeSlot || !topicFocus) {
        return res.status(400).json({ error: 'Mentor name, date, time slot, and topic focus are required' });
    }
    try {
        // Locate mentor based on full name
        const [mentors] = await pool.query(`SELECT m.id FROM mentors m
       JOIN users u ON m.user_id = u.id
       WHERE u.full_name = ?`, [mentorName]);
        if (mentors.length === 0) {
            return res.status(400).json({ error: 'Selected mentor is not found' });
        }
        const mentorId = mentors[0].id;
        const zoomLink = `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
        // Insert Booking
        await pool.query(`INSERT INTO mentorship_sessions 
        (student_id, mentor_id, session_date, time_slot, topic_focus, blocker_details, zoom_link, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`, [req.userId, mentorId, date, timeSlot, topicFocus, blockerDetails || null, zoomLink]);
        // Create system notification for booking success
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            req.userId,
            'Jadwal Sesi Mentoring Dikonfirmasi!',
            'Mentorship Session Scheduled!',
            `Sesi privat Anda dengan "${mentorName}" pada ${date} (${timeSlot}) telah dijadwalkan. Link Zoom: ${zoomLink}`,
            `Your private session with "${mentorName}" on ${date} (${timeSlot}) is confirmed. Zoom link: ${zoomLink}`,
            'learning'
        ]);
        res.status(201).json({
            message: 'Mentorship session booked successfully!',
            zoomLink
        });
    }
    catch (error) {
        console.error('Book session error:', error);
        res.status(500).json({ error: 'Server error booking mentorship session' });
    }
});
// 3. SUBMIT PORTFOLIO AUDIT REQUEST
router.post('/portfolio/audits', authenticateToken, async (req, res) => {
    const { portfolioUrl, resumeFileUrl, targetCareer } = req.body;
    if (!portfolioUrl || !targetCareer) {
        return res.status(400).json({ error: 'Portfolio URL and Target Career are required' });
    }
    try {
        // Insert Audit Request
        await pool.query(`INSERT INTO portfolio_audits 
        (student_id, portfolio_url, resume_file_url, target_career, status) 
       VALUES (?, ?, ?, ?, 'pending')`, [req.userId, portfolioUrl, resumeFileUrl || 'https://jagoaischool.com/uploads/simulated_resume.pdf', targetCareer]);
        // Create system notification
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            req.userId,
            'Audit Portofolio Diajukan!',
            'Portfolio Audit Submitted!',
            `Portofolio dan Resume Anda untuk karir "${targetCareer}" berhasil diajukan. Evaluator kami akan mengirim audit dalam 24 jam.`,
            `Your portfolio and resume for "${targetCareer}" has been submitted. Our advisor will send written feedback in 24 hours.`,
            'system'
        ]);
        res.status(201).json({ message: 'Portfolio audit submitted successfully!' });
    }
    catch (error) {
        console.error('Submit audit error:', error);
        res.status(500).json({ error: 'Server error submitting portfolio audit' });
    }
});
// 4. SCHEDULE MOCK TECHNICAL INTERVIEW
router.post('/mock-interviews', authenticateToken, async (req, res) => {
    const { careerTrack, formatType, date, time } = req.body;
    if (!careerTrack || !formatType || !date || !time) {
        return res.status(400).json({ error: 'Career track, format type, date, and time are required' });
    }
    try {
        const sandboxLink = `https://codesandbox.io/s/jagoai-mock-sandbox-${Math.floor(100000 + Math.random() * 900000)}`;
        // Insert Interview booking
        await pool.query(`INSERT INTO mock_interviews 
        (student_id, career_track, format_type, interview_date, interview_time, coding_sandbox_link, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`, [req.userId, careerTrack, formatType, date, time, sandboxLink]);
        // Create system notification
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            req.userId,
            'Simulasi Interview Dijadwalkan!',
            'Mock Interview Scheduled!',
            `Simulasi interview "${careerTrack}" (${formatType}) Anda telah terjadwal pada ${date} pukul ${time}. Sandbox: ${sandboxLink}`,
            `Your "${careerTrack}" (${formatType}) Mock Interview is confirmed for ${date} at ${time}. Sandbox: ${sandboxLink}`,
            'learning'
        ]);
        res.status(201).json({
            message: 'Mock technical interview scheduled successfully!',
            sandboxLink
        });
    }
    catch (error) {
        console.error('Schedule interview error:', error);
        res.status(500).json({ error: 'Server error scheduling mock interview' });
    }
});
// 5. OPEN TECHNICAL TICKET (DARURAT BLOCKER)
router.post('/tickets', authenticateToken, async (req, res) => {
    const { urgency, description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Issue description is required' });
    }
    try {
        await pool.query(`INSERT INTO technical_tickets 
        (student_id, urgency, description, status) 
       VALUES (?, ?, ?, 'open')`, [req.userId, urgency || 'low', description]);
        // Create system notification
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            req.userId,
            'Tiket Support Berhasil Dibuka!',
            'Support Ticket Opened!',
            'Tiket kendala teknis Anda telah dibuka. Tim ahli teknis JagoAI akan segera meninjau blocker Anda.',
            'Your technical blocker ticket has been registered. Our AI specialists will review your blocker shortly.',
            'system'
        ]);
        res.status(201).json({ message: 'Support ticket submitted successfully!' });
    }
    catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Server error opening support ticket' });
    }
});
export default router;
