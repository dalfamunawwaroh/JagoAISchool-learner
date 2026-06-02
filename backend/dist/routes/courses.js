import { Router } from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// 1. GET ALL COURSES
router.get('/', async (req, res) => {
    const { level, category } = req.query;
    try {
        let sql = 'SELECT * FROM courses WHERE 1=1';
        const params = [];
        if (level && level !== 'All') {
            sql += ' AND level = ?';
            params.push(level);
        }
        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        sql += ' ORDER BY id ASC';
        const [courses] = await pool.query(sql, params);
        res.json(courses);
    }
    catch (error) {
        console.error('Fetch courses error:', error);
        res.status(500).json({ error: 'Server error fetching courses' });
    }
});
// 2. GET ENROLLED COURSES
router.get('/enrollments', authenticateToken, async (req, res) => {
    try {
        const [enrollments] = await pool.query(`SELECT ce.*, c.title, c.badge, c.level, c.category, c.image_url, c.duration_hours, c.module_count 
       FROM course_enrollments ce
       JOIN courses c ON ce.course_id = c.id
       WHERE ce.user_id = ?`, [req.userId]);
        res.json(enrollments);
    }
    catch (error) {
        console.error('Fetch enrollments error:', error);
        res.status(500).json({ error: 'Server error fetching enrollments' });
    }
});
// 3. GET COURSE BY ID (WITH MODULES, LESSONS, AND STUDENT PROGRESS)
router.get('/:id', authenticateToken, async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        // Fetch course
        const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
        if (courses.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const course = courses[0];
        // Fetch modules
        const [modules] = await pool.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index ASC', [courseId]);
        // Fetch lessons for each module
        const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
            const [lessons] = await pool.query('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC', [mod.id]);
            // Fetch completed status for lessons for current user
            const lessonsWithStatus = await Promise.all(lessons.map(async (lesson) => {
                const [prog] = await pool.query('SELECT is_completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?', [req.userId, lesson.id]);
                return {
                    ...lesson,
                    isCompleted: prog.length > 0 ? Boolean(prog[0].is_completed) : false
                };
            }));
            return {
                ...mod,
                lessons: lessonsWithStatus
            };
        }));
        // Check if user is enrolled
        const [enroll] = await pool.query('SELECT * FROM course_enrollments WHERE user_id = ? AND course_id = ?', [req.userId, courseId]);
        res.json({
            ...course,
            modules: modulesWithLessons,
            enrollment: enroll.length > 0 ? enroll[0] : null
        });
    }
    catch (error) {
        console.error('Fetch course detail error:', error);
        res.status(500).json({ error: 'Server error fetching course details' });
    }
});
// 4. JOIN / ENROLL IN COURSE
router.post('/:id/enroll', authenticateToken, async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        // Check if already enrolled
        const [existing] = await pool.query('SELECT id FROM course_enrollments WHERE user_id = ? AND course_id = ?', [req.userId, courseId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You are already enrolled in this course' });
        }
        // Enroll student
        await pool.query('INSERT INTO course_enrollments (user_id, course_id, status, progress_percentage) VALUES (?, ?, ?, ?)', [req.userId, courseId, 'active', 0.0]);
        // Update course student count
        await pool.query('UPDATE courses SET student_count = student_count + 1 WHERE id = ?', [courseId]);
        // Create system notification
        const [courses] = await pool.query('SELECT title FROM courses WHERE id = ?', [courseId]);
        const courseTitle = courses[0]?.title || 'Kursus Baru';
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            req.userId,
            'Pendaftaran Kursus Berhasil!',
            'Course Enrollment Successful!',
            `Anda telah sukses terdaftar di kelas "${courseTitle}". Mulailah belajar modul pertama hari ini!`,
            `You have successfully enrolled in "${courseTitle}". Start learning the first module today!`,
            'learning'
        ]);
        res.status(201).json({ message: 'Enrolled successfully!' });
    }
    catch (error) {
        console.error('Enroll course error:', error);
        res.status(500).json({ error: 'Server error enrolling in course' });
    }
});
// 5. UPDATE LESSON PROGRESS (MARK COMPLETED / INCOMPLETE)
router.post('/lessons/:id/progress', authenticateToken, async (req, res) => {
    const lessonId = parseInt(req.params.id);
    const { isCompleted } = req.body; // boolean
    try {
        // Get lesson details and module/course relationships
        const [lessons] = await pool.query(`SELECT l.id, l.module_id, cm.course_id 
       FROM lessons l 
       JOIN course_modules cm ON l.module_id = cm.id 
       WHERE l.id = ?`, [lessonId]);
        if (lessons.length === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        const { course_id: courseId } = lessons[0];
        // Save lesson progress in database
        if (isCompleted) {
            await pool.query(`INSERT INTO lesson_progress (user_id, lesson_id, is_completed) 
         VALUES (?, ?, TRUE) 
         ON DUPLICATE KEY UPDATE is_completed = TRUE, completed_at = CURRENT_TIMESTAMP`, [req.userId, lessonId]);
        }
        else {
            await pool.query('DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?', [req.userId, lessonId]);
        }
        // --- RE-CALCULATE COURSE PROGRESS PERCENTAGE ---
        // Get all lessons in the course
        const [allLessons] = await pool.query(`SELECT l.id FROM lessons l 
       JOIN course_modules cm ON l.module_id = cm.id 
       WHERE cm.course_id = ?`, [courseId]);
        const totalLessons = allLessons.length;
        // Get completed lessons by user in this course
        const [completedLessons] = await pool.query(`SELECT lp.lesson_id FROM lesson_progress lp
       JOIN lessons l ON lp.lesson_id = l.id
       JOIN course_modules cm ON l.module_id = cm.id
       WHERE lp.user_id = ? AND cm.course_id = ? AND lp.is_completed = TRUE`, [req.userId, courseId]);
        const completedCount = completedLessons.length;
        const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
        // Update enrollment progress
        const status = progressPercentage >= 100 ? 'completed' : 'active';
        const completedAtSql = progressPercentage >= 100 ? ', completed_at = CURRENT_TIMESTAMP' : '';
        await pool.query(`UPDATE course_enrollments 
       SET progress_percentage = ?, status = ? ${completedAtSql}
       WHERE user_id = ? AND course_id = ?`, [progressPercentage, status, req.userId, courseId]);
        // --- DYNAMIC REWARDS / GAMIFICATION ---
        // Award 50 XP to user for completing a lesson!
        let xpGain = 0;
        if (isCompleted) {
            xpGain = 50;
            await pool.query('UPDATE users SET xp = xp + ?, level = FLOOR((xp + ?) / 1000) + 1 WHERE id = ?', [xpGain, xpGain, req.userId]);
        }
        res.json({
            message: 'Progress updated successfully!',
            progressPercentage,
            xpGained: xpGain
        });
    }
    catch (error) {
        console.error('Update lesson progress error:', error);
        res.status(500).json({ error: 'Server error updating lesson progress' });
    }
});
export default router;
