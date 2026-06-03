import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'jagoai_school_neural_secret_key_2026';

// Helper function to fetch and format user profile details consistently
const getUserProfile = async (userId: number) => {
  const [users] = await pool.query<any[]>(
    'SELECT id, email, full_name, username, avatar_url, role, xp, level, language_preference, bio, website_url, linkedin_url, email_notifications, allow_peer_search, show_xp_on_leaderboard, timezone, google_calendar_sync FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    return null;
  }

  const user = users[0];

  // Fetch badges
  const [badges] = await pool.query<any[]>(
    'SELECT badge_name as name, badge_icon as icon FROM user_badges WHERE user_id = ?',
    [userId]
  );

  const mappedBadges = badges.map(b => {
    let color = 'bg-indigo-50 text-[#1800ad]';
    if (b.name === 'Elite Member') color = 'bg-amber-100 text-amber-600';
    else if (b.name === 'Top Scorer') color = 'bg-[#e8ba00]/10 text-[#e8ba00]';
    else if (b.name === 'Deep Thinker') color = 'bg-[#1800ad]/10 text-[#1800ad]';
    else if (b.name === 'Master Coder') color = 'bg-blue-450/10 text-blue-550';
    else if (b.name === 'Fast Learner') color = 'bg-emerald-455/10 text-emerald-555';
    return {
      name: b.name,
      icon: b.icon,
      color
    };
  });

  // Fetch active courses
  const [courses] = await pool.query<any[]>(
    `SELECT c.id, c.title, ce.progress_percentage as progress 
     FROM course_enrollments ce
     JOIN courses c ON ce.course_id = c.id
     WHERE ce.user_id = ?`,
     [userId]
  );

  const formattedCourses = courses.map(c => ({
    id: c.id,
    title: c.title,
    progress: Math.round(parseFloat(c.progress))
  }));

  return {
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
    emailNotifications: Boolean(user.email_notifications),
    allowPeerSearch: Boolean(user.allow_peer_search),
    showXpOnLeaderboard: Boolean(user.show_xp_on_leaderboard),
    timezone: user.timezone,
    googleCalendarSync: Boolean(user.google_calendar_sync),
    badges: mappedBadges,
    courses: formattedCourses
  };
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email or username already exists
    const [existingUsers] = await pool.query<any[]>(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email or Username already registered' });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query<any>(
      'INSERT INTO users (full_name, email, username, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, username, passwordHash, 'LEARNER']
    );

    const userId = result.insertId;

    // Create automatically some welcome achievements or notifications
    await pool.query(
      'INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)',
      [
        userId,
        'Selamat Datang di JagoAI School!',
        'Welcome to JagoAI School!',
        'Mulailah perjalanan AI Anda hari ini dengan menjelajahi The Academy dan mengklaim lencana pertama Anda.',
        'Start your AI journey today by exploring The Academy and claiming your first badge.',
        'system'
      ]
    );

    // Automatically give welcome badges in "Achievement Vault"
    await pool.query(
      'INSERT INTO user_badges (user_id, badge_name, badge_icon) VALUES (?, ?, ?)',
      [userId, 'Elite Member', 'star']
    );

    // Create token
    const token = jwt.sign({ id: userId, role: 'LEARNER' }, JWT_SECRET, { expiresIn: '7d' });

    const profile = await getUserProfile(userId);
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: profile
    });
  } catch (error) {
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
    const [users] = await pool.query<any[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

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

    const profile = await getUserProfile(user.id);
    res.json({
      message: 'Login successful!',
      token,
      user: profile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. GET CURRENT USER (ME)
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const profile = await getUserProfile(req.userId!);
    if (!profile) {
      return res.status(444).json({ error: 'User not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ error: 'Server error fetching user details' });
  }
});

// 4. UPDATE PROFILE
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { fullName, username, bio, websiteUrl, linkedinUrl, avatarUrl } = req.body;

  try {
    // Validate username uniqueness if changed
    if (username) {
      const [existing] = await pool.query<any[]>(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, req.userId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    await pool.query(
      `UPDATE users SET 
        full_name = COALESCE(?, full_name), 
        username = COALESCE(?, username), 
        bio = ?, 
        website_url = ?, 
        linkedin_url = ?, 
        avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?`,
      [fullName, username, bio || null, websiteUrl || null, linkedinUrl || null, avatarUrl || null, req.userId]
    );

    const profile = await getUserProfile(req.userId!);
    res.json({
      message: 'Profile updated successfully!',
      user: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// 5. UPDATE SETTINGS (Language, Email Notifications, Password, Privacy, Schedule)
router.put('/settings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const { 
    currentPassword, 
    newPassword, 
    languagePreference, 
    emailNotifications,
    allowPeerSearch,
    showXpOnLeaderboard,
    timezone,
    googleCalendarSync
  } = req.body;

  try {
    const [users] = await pool.query<any[]>(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.userId]
    );

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

      await pool.query(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [newHash, req.userId]
      );
    }

    // Update general preferences
    await pool.query(
      `UPDATE users SET 
        language_preference = COALESCE(?, language_preference),
        email_notifications = COALESCE(?, email_notifications),
        allow_peer_search = COALESCE(?, allow_peer_search),
        show_xp_on_leaderboard = COALESCE(?, show_xp_on_leaderboard),
        timezone = COALESCE(?, timezone),
        google_calendar_sync = COALESCE(?, google_calendar_sync)
      WHERE id = ?`,
      [
        languagePreference || null,
        emailNotifications !== undefined ? emailNotifications : null,
        allowPeerSearch !== undefined ? allowPeerSearch : null,
        showXpOnLeaderboard !== undefined ? showXpOnLeaderboard : null,
        timezone || null,
        googleCalendarSync !== undefined ? googleCalendarSync : null,
        req.userId
      ]
    );

    const profile = await getUserProfile(req.userId!);
    res.json({
      message: 'Settings updated successfully!',
      user: profile
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Server error updating settings' });
  }
});

// 5a. GET ACTIVE DEVICE SESSIONS
router.get('/settings/sessions', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const [sessions] = await pool.query<any[]>(
      'SELECT id, device_name as deviceName, location, browser, is_current as isCurrent, last_active_at as lastActiveAt FROM device_sessions WHERE user_id = ? ORDER BY is_current DESC, last_active_at DESC',
      [req.userId]
    );

    if (sessions.length === 0) {
      const userAgent = req.headers['user-agent'] || '';
      let browser = 'Chrome';
      if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';

      let deviceOS = 'Windows PC';
      if (userAgent.includes('Macintosh')) deviceOS = 'macOS Device';
      else if (userAgent.includes('iPhone')) deviceOS = 'iPhone';
      else if (userAgent.includes('Android')) deviceOS = 'Android Device';
      else if (userAgent.includes('Linux')) deviceOS = 'Linux Device';

      await pool.query(
        'INSERT INTO device_sessions (user_id, device_name, location, browser, is_current) VALUES (?, ?, ?, ?, ?)',
        [req.userId, `${deviceOS} • Bandung, Indonesia`, 'Bandung, Indonesia', browser, 1]
      );

      await pool.query(
        `INSERT INTO device_sessions (user_id, device_name, location, browser, is_current, last_active_at) 
         VALUES (?, 'iPhone 15 Pro • Jakarta, Indonesia', 'Jakarta, Indonesia', 'Safari', 0, DATE_SUB(NOW(), INTERVAL 2 DAY))`,
        [req.userId]
      );

      const [newSessions] = await pool.query<any[]>(
        'SELECT id, device_name as deviceName, location, browser, is_current as isCurrent, last_active_at as lastActiveAt FROM device_sessions WHERE user_id = ? ORDER BY is_current DESC, last_active_at DESC',
        [req.userId]
      );
      return res.json(newSessions);
    }

    res.json(sessions);
  } catch (error) {
    console.error('Fetch device sessions error:', error);
    res.status(500).json({ error: 'Server error fetching device sessions' });
  }
});

// 5b. REVOKE ACTIVE DEVICE SESSION
router.delete('/settings/sessions/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const sessionId = req.params.id;
  try {
    const [result] = await pool.query<any>(
      'DELETE FROM device_sessions WHERE id = ? AND user_id = ?',
      [sessionId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Session not found or unauthorized' });
    }

    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ error: 'Server error revoking session' });
  }
});

// 6. FORGOT PASSWORD - Send Reset Email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const [users] = await pool.query<any[]>(
      'SELECT id, full_name FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // For security, don't reveal if email exists. Say check email regardless.
      return res.json({ message: 'Jika email terdaftar, link reset password telah dikirim.' });
    }

    const user = users[0];

    // Generate reset token valid for 1 hour
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'reset-password' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

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
  } catch (error) {
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
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ error: 'Invalid token purpose' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // Update in database
    const [result] = await pool.query<any>(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newHash, decoded.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Insert successful notification
    await pool.query(
      'INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category) VALUES (?, ?, ?, ?, ?, ?)',
      [
        decoded.id,
        'Kata Sandi Diatur Ulang',
        'Password Reset Successful',
        'Kata sandi Anda telah berhasil diubah baru-baru ini.',
        'Your password has been successfully updated recently.',
        'system'
      ]
    );

    res.json({ message: 'Kata sandi berhasil diatur ulang. Silakan masuk menggunakan kata sandi baru Anda.' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Link reset password telah kedaluwarsa. Silakan ajukan kembali.' });
    }
    res.status(400).json({ error: 'Token reset password tidak valid atau rusak.' });
  }
});

// 8. GET LEADERBOARD
router.get('/leaderboard', async (req, res) => {
  try {
    const [users] = await pool.query<any[]>(
      'SELECT id, full_name, username, xp, level, avatar_url, bio, role FROM users ORDER BY xp DESC LIMIT 10'
    );
    res.json(users);
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
});

// 9. GET ACTIVE USERS (Online / recently active)
router.get('/active-users', async (req, res) => {
  try {
    const [users] = await pool.query<any[]>(
      'SELECT id, full_name, username, avatar_url, role, bio, last_active_at FROM users ORDER BY COALESCE(last_active_at, updated_at, created_at) DESC LIMIT 8'
    );
    res.json(users);
  } catch (error) {
    console.error('Fetch active users error:', error);
    res.status(500).json({ error: 'Server error fetching active users' });
  }
});

// 10. SUPPORT TICKET FROM LANDING PAGE
router.post('/support', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  try {
    const adminEmail = process.env.SMTP_EMAIL || 'admin.jagoaischool@gmail.com';
    const smtpPassword = process.env.SMTP_PASSWORD || 'gcxx rlkf wngu uxsc';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminEmail,
        pass: smtpPassword
      }
    });

    // 1. Send inquiry to JagoAI School Admin
    const adminMailOptions = {
      from: `"JagoAI School Landing Page" <${adminEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: '📬 Pertanyaan Baru dari Landing Page JagoAI School',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1800ad; margin-bottom: 20px;">Pertanyaan Baru / Bantuan Langsung</h2>
          <p><strong>Pengirim:</strong> ${email}</p>
          <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; margin-top: 15px;">
            <p style="white-space: pre-wrap; margin: 0; color: #334155;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 25px;">Pesan ini dikirim secara otomatis dari formulir bantuan Landing Page JagoAI School.</p>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);
    console.log(`Admin support email notification sent successfully for sender: ${email}`);

    // 2. Send confirmation receipt to the User
    const userMailOptions = {
      from: `"JagoAI School Support" <${adminEmail}>`,
      to: email,
      subject: '👋 Kami Telah Menerima Pertanyaan Anda - JagoAI School',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; border-radius: 24px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1800ad; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">JagoAI School</h1>
            <p style="color: #e8ba00; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0;">The Academy of Tomorrow</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02); border: 1px solid #f1f5f9;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">Halo,</h2>
            
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Terima kasih telah menghubungi JagoAI School. Kami telah menerima pertanyaan Anda dari formulir bantuan langsung di landing page kami.
            </p>
            
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 10px; font-weight: 600;">
              Detail pertanyaan Anda:
            </p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 30px; font-style: italic; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              Tim kami akan segera meninjau pertanyaan ini dan menghubungi Anda kembali melalui alamat email ini dalam waktu 24 jam.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
            
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin-bottom: 0;">
              Salam hangat,<br />
              <strong>Tim Support JagoAI School</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 11px;">
            <p>© 2026 JagoAI School. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(userMailOptions);
    console.log(`User support confirmation email sent successfully to: ${email}`);

    res.json({ message: 'Support request sent successfully!' });
  } catch (error) {
    console.error('Support email sending error:', error);
    res.status(500).json({ error: 'Gagal mengirim email bantuan. Coba lagi nanti.' });
  }
});

export default router;

