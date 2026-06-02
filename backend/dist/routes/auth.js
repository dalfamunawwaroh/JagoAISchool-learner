import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jagoai_school_neural_secret_key_2026';
// 1. REGISTER
router.post('/register', async (req, res) => {
    const { fullName, email, username, password } = req.body;
    if (!fullName || !email || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        // Check if email or username already exists
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email or Username already registered' });
        }
        // Hash password securely
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        // Insert user
        const [result] = await pool.query('INSERT INTO users (full_name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)', [fullName, email, username, passwordHash, 'LEARNER']);
        const userId = result.insertId;
        // Create automatically some welcome achievements or notifications
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            userId,
            'Selamat Datang di JagoAI School!',
            'Welcome to JagoAI School!',
            'Mulailah perjalanan AI Anda hari ini dengan menjelajahi The Academy dan mengklaim lencana pertama Anda.',
            'Start your AI journey today by exploring The Academy and claiming your first badge.',
            'system'
        ]);
        // Automatically give welcome badges in "Achievement Vault"
        await pool.query('INSERT INTO user_badges (user_id, badge_name, badge_icon) VALUES (?, ?, ?)', [userId, 'Elite Member', 'star']);
        // Create token
        const token = jwt.sign({ id: userId, role: 'LEARNER' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: userId,
                fullName,
                email,
                username,
                role: 'LEARNER',
                xp: 0,
                level: 1,
                avatarUrl: 'https://i.pravatar.cc/150',
                languagePreference: 'id'
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});
// 2. LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const user = users[0];
        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Create token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                username: user.username,
                role: user.role,
                xp: user.xp,
                level: user.level,
                avatarUrl: user.avatar_url,
                languagePreference: user.language_preference,
                bio: user.bio,
                websiteUrl: user.website_url,
                linkedinUrl: user.linkedin_url,
                emailNotifications: user.email_notifications
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});
// 3. GET CURRENT USER (ME)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, email, full_name, username, avatar_url, role, xp, level, language_preference, bio, website_url, linkedin_url, email_notifications FROM users WHERE id = ?', [req.userId]);
        if (users.length === 0) {
            return res.status(444).json({ error: 'User not found' });
        }
        res.json(users[0]);
    }
    catch (error) {
        console.error('Fetch me error:', error);
        res.status(500).json({ error: 'Server error fetching user details' });
    }
});
// 4. UPDATE PROFILE
router.put('/profile', authenticateToken, async (req, res) => {
    const { fullName, username, bio, websiteUrl, linkedinUrl, avatarUrl } = req.body;
    try {
        // Validate username uniqueness if changed
        if (username) {
            const [existing] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, req.userId]);
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
        }
        await pool.query(`UPDATE users SET 
        full_name = COALESCE(?, full_name), 
        username = COALESCE(?, username), 
        bio = ?, 
        website_url = ?, 
        linkedin_url = ?, 
        avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?`, [fullName, username, bio || null, websiteUrl || null, linkedinUrl || null, avatarUrl || null, req.userId]);
        const [updatedUsers] = await pool.query('SELECT id, email, full_name, username, avatar_url, role, xp, level, language_preference, bio, website_url, linkedin_url, email_notifications FROM users WHERE id = ?', [req.userId]);
        res.json({
            message: 'Profile updated successfully!',
            user: updatedUsers[0]
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
});
// 5. UPDATE SETTINGS (Language, Email Notifications, Password)
router.put('/settings', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword, languagePreference, emailNotifications } = req.body;
    try {
        const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.userId]);
        if (users.length === 0) {
            return res.status(444).json({ error: 'User not found' });
        }
        const user = users[0];
        // If changing password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect current password' });
            }
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(newPassword, salt);
            await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.userId]);
        }
        // Update general preferences
        await pool.query(`UPDATE users SET 
        language_preference = COALESCE(?, language_preference),
        email_notifications = COALESCE(?, email_notifications)
      WHERE id = ?`, [languagePreference || null, emailNotifications !== undefined ? emailNotifications : null, req.userId]);
        const [updatedUsers] = await pool.query('SELECT id, email, full_name, username, avatar_url, role, xp, level, language_preference, bio, website_url, linkedin_url, email_notifications FROM users WHERE id = ?', [req.userId]);
        res.json({
            message: 'Settings updated successfully!',
            user: updatedUsers[0]
        });
    }
    catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Server error updating settings' });
    }
});
// 6. FORGOT PASSWORD - Send Reset Email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const [users] = await pool.query('SELECT id, full_name FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            // For security, don't reveal if email exists. Say check email regardless.
            return res.json({ message: 'Jika email terdaftar, link reset password telah dikirim.' });
        }
        const user = users[0];
        // Generate reset token valid for 1 hour
        const resetToken = jwt.sign({ id: user.id, purpose: 'reset-password' }, JWT_SECRET, { expiresIn: '1h' });
        // Construct reset link
        const resetLink = `http://localhost:3000/?mode=reset&token=${resetToken}`;
        // Send email using nodemailer
        const mailOptions = {
            from: `"JagoAI School Support" <${process.env.SMTP_EMAIL || 'admin.jagoaischool@gmail.com'}>`,
            to: email,
            subject: '🔒 Reset Password Akun JagoAI School Anda',
            html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1800ad; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">JagoAI School</h1>
            <p style="color: #e8ba00; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0;">The Academy of Tomorrow</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02); border: 1px solid #f1f5f9;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">Halo ${user.full_name},</h2>
            
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
              Kami menerima permintaan untuk mengatur ulang kata sandi akun JagoAI School Anda. Silakan klik tombol di bawah ini untuk merestart kata sandi Anda. Link ini berlaku selama <strong>1 jam</strong>.
            </p>
            
            <div style="text-align: center; margin-bottom: 35px;">
              <a href="${resetLink}" style="background-color: #1800ad; color: #ffffff; padding: 16px 36px; border-radius: 16px; font-weight: 700; font-size: 14px; text-decoration: none; display: inline-block; box-shadow: 0 10px 20px rgba(24, 0, 173, 0.15); text-transform: uppercase; letter-spacing: 0.5px;">Reset Kata Sandi</a>
            </div>
            
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin-bottom: 0;">
              Jika Anda tidak meminta pengaturan ulang ini, Anda dapat mengabaikan email ini dengan aman. Kata sandi Anda tidak akan berubah.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 11px;">
            <p>© 2026 JagoAI School. All rights reserved.</p>
          </div>
        </div>
      `
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL || 'admin.jagoaischool@gmail.com',
                pass: process.env.SMTP_PASSWORD || 'gcxx rlkf wngu uxsc'
            }
        });
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email successfully sent to: ${email}`);
        res.json({ message: 'Jika email terdaftar, link reset password telah dikirim.' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Gagal mengirim email reset password. Coba lagi nanti.' });
    }
});
// 7. RESET PASSWORD - Process Token and Update password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.purpose !== 'reset-password') {
            return res.status(400).json({ error: 'Invalid token purpose' });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
        // Update in database
        const [result] = await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, decoded.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Insert successful notification
        await pool.query('INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)', [
            decoded.id,
            'Kata Sandi Diatur Ulang',
            'Password Reset Successful',
            'Kata sandi Anda telah berhasil diubah baru-baru ini.',
            'Your password has been successfully updated recently.',
            'system'
        ]);
        res.json({ message: 'Kata sandi berhasil diatur ulang. Silakan masuk menggunakan kata sandi baru Anda.' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Link reset password telah kedaluwarsa. Silakan ajukan kembali.' });
        }
        res.status(400).json({ error: 'Token reset password tidak valid atau rusak.' });
    }
});
export default router;
