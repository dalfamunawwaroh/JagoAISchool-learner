-- ============================================================================
-- DATABASE CREATION SCRIPT FOR JAGOAI SCHOOL (STANDARD SQL / MySQL COMPATIBLE)
-- Database Name: jagoaischool
-- Description: Complete standard SQL mapping of the entire JagoAI School application,
--              fully compatible with MySQL, MariaDB, SQLite, and standard SQL.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS jagoaischool;
USE jagoaischool;

-- ----------------------------------------------------------------------------
-- 1. CORE USERS & AUTHENTICATION (Auth.tsx, Profile.tsx, Dashboard.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    avatar_url MEDIUMTEXT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'LEARNER', -- 'LEARNER', 'TENTOR', 'ADMIN', 'SUPER_ADMIN'
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    language_preference VARCHAR(10) DEFAULT 'id',
    bio TEXT NULL,
    website_url VARCHAR(500) NULL,
    linkedin_url VARCHAR(500) NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
    allow_peer_search BOOLEAN DEFAULT TRUE,
    show_xp_on_leaderboard BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(100) DEFAULT 'GMT+7',
    google_calendar_sync BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Tracks Earned Achievements / Badges (Dashboard.tsx "Achievement Vault")
CREATE TABLE user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_name VARCHAR(100) NOT NULL, -- e.g., 'Top Scorer', 'Deep Thinker', 'Master Coder'
    badge_icon VARCHAR(50) NOT NULL, -- Material Symbol icon code
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);

-- Tracks active login devices/sessions (Settings.tsx "Active Devices Sessions")
CREATE TABLE device_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    browser VARCHAR(100) NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_device_sessions_user ON device_sessions(user_id);


-- ----------------------------------------------------------------------------
-- 2. LMS / COURSES COMPONENT (Courses.tsx, CourseDetail.tsx, CoursePlayer.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    badge VARCHAR(50), -- Popular, Hot, Advanced, Critical, UTBK 2026, Core
    level VARCHAR(50) NOT NULL DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
    category VARCHAR(100) NOT NULL, -- Vision, NLP, Robotics, Audio, Generative AI, Mathematics, Ethical AI, UTBK Prep
    image_url VARCHAR(500),
    duration_hours INT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    student_count INT DEFAULT 0,
    module_count INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'video', -- 'video', 'quiz', 'document'
    content_url VARCHAR(500) NOT NULL, -- Video link, file path, or quiz reference
    duration_minutes INT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);

-- Enrollment log & stats (CourseEnroll.tsx)
CREATE TABLE course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'completed'
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    rating_given INT NULL,
    review_text TEXT,
    CONSTRAINT uq_user_course_enroll UNIQUE (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_enroll_user ON course_enrollments(user_id);
CREATE INDEX idx_enroll_course ON course_enrollments(course_id);

-- Tracks complete status per individual lesson
CREATE TABLE lesson_progress (
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 3. DISCUSSION HUB COMPONENT (Discussion.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE discussion_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- General, AI Engineering, Course QA, Project Showcases, Job Opportunities
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50), -- Material Symbol name
    description TEXT
);

CREATE TABLE discussion_threads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    likes_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES discussion_categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_threads_category ON discussion_threads(category_id);

CREATE TABLE thread_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- YOLO, Optimization, LLM, Beginner, Python, News, AI
);

CREATE TABLE thread_tag_mappings (
    thread_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (thread_id, tag_id),
    FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES thread_tags(id) ON DELETE CASCADE
);

-- Record upvotes / likes on threads
CREATE TABLE thread_likes (
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (thread_id, user_id),
    FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Thread Q&A Messages & Chat System (Discussion.tsx - Chat View)
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    reply_to_id INT NULL, -- References parent message for nested replies
    image_attachment_url VARCHAR(500) NULL, -- Image attachments
    file_attachment_name VARCHAR(255) NULL, -- Other documents attachments
    file_attachment_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES discussion_threads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL
);

CREATE INDEX idx_chat_thread ON chat_messages(thread_id);

-- Message Reactions System (Discussion.tsx - Reactions list)
CREATE TABLE message_reactions (
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    emoji VARCHAR(8) NOT NULL, -- e.g., 👍, ❤️, 😮, 😂
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. CONSULTATION SERVICE (Consultation.tsx)
-- ----------------------------------------------------------------------------
-- Verified Mentors table
CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL DEFAULT 'Senior AI Engineer',
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills normalisation table for standard SQL (removed PostgreSQL specific array type skills)
CREATE TABLE mentor_skills (
    mentor_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL, -- e.g. 'LLM', 'PyTorch', 'Vision'
    PRIMARY KEY (mentor_id, skill_name),
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
);

-- 1-on-1 Mentorship Booking Sessions
CREATE TABLE mentorship_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    mentor_id INT NOT NULL,
    session_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL, -- e.g., '09:00 AM - 09:45 AM (WIB)'
    topic_focus VARCHAR(255) NOT NULL, -- e.g., Debugging, Review Thesis, AI Career
    blocker_details TEXT,
    zoom_link VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
);

CREATE INDEX idx_mentorship_student ON mentorship_sessions(student_id);
CREATE INDEX idx_mentorship_mentor ON mentorship_sessions(mentor_id);

-- Resume & Portfolio Audit Hub
CREATE TABLE portfolio_audits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    portfolio_url VARCHAR(500) NOT NULL,
    resume_file_url VARCHAR(500) NOT NULL,
    target_career VARCHAR(255) NOT NULL,
    audit_feedback TEXT, -- The bar-by-bar evaluation comments
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed'
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mock Technical Interviews booking
CREATE TABLE mock_interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    career_track VARCHAR(150) NOT NULL, -- Machine Learning Engineer, LLM Specialist, Computer Vision, etc.
    format_type VARCHAR(150) NOT NULL, -- Big Tech/FAANG, Local Unicorn, AI Startup
    interview_date DATE NOT NULL,
    interview_time TIME NOT NULL,
    coding_sandbox_link VARCHAR(500),
    feedback_text TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Emergency Technical Tickets System
CREATE TABLE technical_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    urgency VARCHAR(50) NOT NULL DEFAULT 'low', -- 'low', 'medium', 'high'
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. EVENTS COMPONENT (Events.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(100) NOT NULL, -- e.g., '14:00 GMT+7'
    type VARCHAR(50) NOT NULL DEFAULT 'ONLINE', -- 'ONLINE', 'ON-SITE'
    location VARCHAR(500), -- Gedung IT Telkom University Lantai 4, etc.
    price_text VARCHAR(50) NOT NULL DEFAULT 'FREE', -- IDR 150.000, FREE
    price_raw DECIMAL(10,2) DEFAULT 0.0,
    image_url VARCHAR(500),
    mentor_id INT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Practical Workshop', -- 'AI Research', 'Practical Workshop', 'Expert Seminar'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
);

CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_event UNIQUE (user_id, event_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE event_certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_date VARCHAR(100) NOT NULL,
    certificate_url VARCHAR(500) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. AI TOOLKIT SYSTEM (AIToolkit.tsx, ToolDetail.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE ai_tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Gemini, Claude, NotebookLM, ChatGPT, Midjourney, Perplexity
    type VARCHAR(50) NOT NULL DEFAULT 'FREE', -- 'FREE', 'PRO ACCESS'
    description TEXT NOT NULL,
    icon_url VARCHAR(500),
    bg_color VARCHAR(50) DEFAULT 'bg-white',
    pricing_text VARCHAR(100), -- Free to use, $20 / month, etc.
    use_case_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pros/Cons or unique features list of tools
CREATE TABLE ai_tool_pros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    strength_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. ARTICLES & INSIGHTS (Article.tsx, ArticleDetail.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    author_name VARCHAR(100) NOT NULL DEFAULT 'Mentor JagoAI',
    published_at DATE NOT NULL,
    read_time_text VARCHAR(50) NOT NULL DEFAULT '5 min read',
    image_url VARCHAR(500),
    category VARCHAR(50) NOT NULL DEFAULT 'AI Research', -- UTBK PREP, NEURAL NETS, ROBOTICS, GENERATIVE AI, ETHICS, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trending_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL DEFAULT 'TECH ALERT', -- TECH ALERT, CAMPUS NEWS, BREAKTHROUGH
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. NOTIFICATION HUB (Notifications.tsx)
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title_id VARCHAR(255) NOT NULL, -- Indonesian title
    title_en VARCHAR(255) NOT NULL, -- English title
    desc_id TEXT NOT NULL, -- Indonesian desc
    desc_en TEXT NOT NULL, -- English desc
    category VARCHAR(50) NOT NULL DEFAULT 'system', -- learning, events, system
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- SEED DATA FOR DEMO & TESTING
-- ----------------------------------------------------------------------------

-- Seed Users
-- Password is 'password' hashed with bcrypt
INSERT INTO users (id, email, password_hash, full_name, username, avatar_url, role, xp, level, language_preference, bio, website_url, linkedin_url, email_notifications, last_active_at) VALUES
(1, 'alex.dev@jagoai.com', '$2a$10$IHNav7buqaHXDiWGX0oY4uI1I82/64K54pSBfnY28.Ezb3Eio3Bw6', 'Alex (You)', 'alexdev', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', 'LEARNER', 1850, 2, 'id', 'Dedicated learner exploring Neural Networks and Computer Vision at JagoAI.', 'https://alexdev.io', 'https://linkedin.com/in/alexdev', TRUE, NOW()),
(2, 'ahmad.syarif@jagoai.com', '$2a$10$IHNav7buqaHXDiWGX0oY4uI1I82/64K54pSBfnY28.Ezb3Eio3Bw6', 'Ahmad Syarif', 'ahmadsyarif', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', 'LEARNER', 2450, 3, 'id', 'Siswa berdedikasi di JagoAI Academy.', NULL, NULL, TRUE, NOW()),
(3, 'rian.hidayat@jagoai.com', '$2a$10$IHNav7buqaHXDiWGX0oY4uI1I82/64K54pSBfnY28.Ezb3Eio3Bw6', 'Rian Hidayat, M.T.', 'rianhidayat', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', 'TENTOR', 5000, 5, 'id', 'Senior AI Engineer & Advisor at JagoAI. Passionate about LLMs and Deep Learning optimization.', 'https://rianhidayat.github.io', NULL, TRUE, NOW()),
(4, 'indah.permata@jagoai.com', '$2a$10$IHNav7buqaHXDiWGX0oY4uI1I82/64K54pSBfnY28.Ezb3Eio3Bw6', 'Dr. Indah Permata', 'indahpermata', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', 'TENTOR', 4200, 4, 'en', 'Researcher in Computer Vision and Robotics. Helping students deploy efficient architectures.', NULL, NULL, TRUE, NOW());

-- Seed User Badges
INSERT INTO user_badges (user_id, badge_name, badge_icon) VALUES
(1, 'Elite Member', 'star'),
(1, 'Top Scorer', 'military_tech'),
(1, 'Deep Thinker', 'cognition'),
(2, 'Elite Member', 'star'),
(2, 'Master Coder', 'code'),
(2, 'Fast Learner', 'rocket_launch');

-- Seed Mentors
INSERT INTO mentors (id, user_id, title, bio, is_active) VALUES
(1, 3, 'Senior AI Engineer', 'Senior AI Engineer & Advisor at JagoAI. Passionate about LLMs and Deep Learning optimization.', TRUE),
(2, 4, 'Researcher in Computer Vision', 'Researcher in Computer Vision and Robotics. Helping students deploy efficient architectures.', TRUE);

-- Seed Mentor Skills
INSERT INTO mentor_skills (mentor_id, skill_name) VALUES
(1, 'LLM'),
(1, 'PyTorch'),
(1, 'Python'),
(2, 'OpenCV'),
(2, 'YOLO'),
(2, 'TensorFlow');

-- Seed Courses
INSERT INTO courses (id, title, badge, level, category, image_url, duration_hours, rating, rating_count, student_count, module_count, description) VALUES
(1, 'AI untuk SMP: Dasar-Dasar Machine Learning', 'Popular', 'Beginner', 'Generative AI', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop', 8, 4.8, 124, 452, 2, 'Pelajari dasar-dasar kecerdasan buatan, konsep machine learning dasar, dan buat model klasifikasi sederhana pertama Anda menggunakan platform visual interaktif JagoAI.'),
(2, 'AI untuk SMA: Pemrograman Python & Neural Networks', 'Hot', 'Intermediate', 'NLP', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop', 16, 4.9, 89, 312, 2, 'Kembangkan keahlian koding Python Anda, pelajari konsep perceptron, neural network, backpropagation, dan latih model klasifikasi teks NLP Anda sendiri.'),
(3, 'AI untuk SMK: Visi Komputer & Otomasi Industri', 'Advanced', 'Advanced', 'Vision', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop', 24, 4.7, 56, 185, 2, 'Kurikulum berfokus pada industri. Pelajari pemrosesan citra digital dengan OpenCV, fine-tuning model deteksi objek YOLOv8, dan integrasikan dengan sistem otomatisasi.');

-- Seed Course Modules
INSERT INTO course_modules (id, course_id, title, description, order_index) VALUES
(1, 1, 'Pengenalan Kecerdasan Buatan', 'Konsep dasar kecerdasan buatan, sejarah singkat, dan perbedaan antara AI, Machine Learning, dan Deep Learning.', 1),
(2, 1, 'Model Machine Learning Pertama Anda', 'Praktik membuat model klasifikasi gambar sederhana menggunakan platform visual JagoAI.', 2),
(3, 2, 'Dasar Pemrograman Python untuk AI', 'Mempelajari variabel, loop, fungsi, dan penggunaan pustaka penting seperti NumPy.', 1),
(4, 2, 'Meningkatkan Performa Jaringan Syaraf', 'Konsep optimasi neural networks menggunakan gradient descent dan momentum.', 2),
(5, 3, 'Dasar Pengolahan Citra Digital', 'Cara komputer membaca gambar sebagai matriks pixel, filter warna, dan manipulasi citra menggunakan OpenCV.', 1),
(6, 3, 'Deteksi Objek Real-Time dengan YOLO', 'Teori deteksi objek, arsitektur YOLO, dan cara melakukan fine-tuning dataset industri.', 2);

-- Seed Lessons
INSERT INTO lessons (id, module_id, title, type, content_url, duration_minutes, order_index) VALUES
(1, 1, 'Selamat Datang di Dunia AI!', 'video', 'https://www.youtube.com/watch?v=2ePf9rue1Ao', 10, 1),
(2, 1, 'Konsep Dasar Machine Learning', 'document', 'https://jagoaischool.com/readings/intro_ml.pdf', 15, 2),
(3, 1, 'Kuis Konsep Dasar AI', 'quiz', 'https://jagoaischool.com/quizzes/intro_ai', 10, 3),
(4, 2, 'Mengenal Klasifikasi Gambar', 'video', 'https://www.youtube.com/watch?v=W0S83W_Zl5g', 12, 1),
(5, 2, 'Projek Mandiri: Klasifikasi Citra Hewan', 'document', 'https://jagoaischool.com/readings/project_animal.pdf', 30, 2),
(6, 3, 'Sintaks Python & Struktur Data AI', 'video', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 15, 1),
(7, 3, 'Kuis Logika Pemrograman Python', 'quiz', 'https://jagoaischool.com/quizzes/python_basic', 12, 2),
(8, 4, 'Teori Multi-Layer Perceptron', 'video', 'https://www.youtube.com/watch?v=aircAruvnKk', 25, 1),
(9, 5, 'Pengenalan Matriks Citra & Warna', 'video', 'https://www.youtube.com/watch?v=N81Xw_v1aM8', 20, 1),
(10, 5, 'Kuis Pengolahan Citra Digital', 'quiz', 'https://jagoaischool.com/quizzes/image_processing', 15, 2);

-- Seed Course Enrollments
INSERT INTO course_enrollments (user_id, course_id, status, progress_percentage, rating_given) VALUES
(1, 1, 'active', 33.33, NULL),
(1, 2, 'active', 50.00, NULL),
(2, 1, 'completed', 100.00, 5);

-- Seed Lesson Progress
INSERT INTO lesson_progress (user_id, lesson_id, is_completed) VALUES
(1, 1, TRUE),
(1, 6, TRUE),
(2, 1, TRUE),
(2, 2, TRUE),
(2, 3, TRUE),
(2, 4, TRUE),
(2, 5, TRUE);

-- Seed Discussion Categories
INSERT INTO discussion_categories (id, name, slug, icon, description) VALUES
(1, 'General', 'general', 'forum', 'Diskusi umum seputar dunia IT, sekolah, akademik, dan lainnya.'),
(2, 'AI Engineering', 'ai-engineering', 'precision_manufacturing', 'Pembahasan mendalam tentang implementasi model, optimasi kode, dan riset AI terbaru.'),
(3, 'Course QA', 'course-qa', 'quiz', 'Tanyakan di sini jika Anda mengalami kendala atau error di modul pembelajaran.'),
(4, 'Project Showcases', 'project-showcases', 'rocket_launch', 'Pamerkan projek buatan Anda dan dapatkan feedback konstruktif dari mentor & siswa lain.'),
(5, 'Job Opportunities', 'job-opportunities', 'work', 'Berbagi lowongan magang, part-time, atau pekerjaan penuh waktu seputar AI & Tech.');

-- Seed Discussion Threads
INSERT INTO discussion_threads (id, title, author_id, category_id, likes_count, replies_count) VALUES
(1, 'Bagaimana cara pruning model YOLOv8 untuk deployment mobile?', 2, 2, 8, 1),
(2, 'Rekomendasi GPU Cloud gratis selain Google Colab?', 1, 1, 4, 0);

-- Seed Thread Tags
INSERT INTO thread_tags (id, name) VALUES
(1, 'yolo'),
(2, 'optimization'),
(3, 'mobile'),
(4, 'gpu'),
(5, 'cloud'),
(6, 'beginner');

-- Seed Tag Mappings
INSERT INTO thread_tag_mappings (thread_id, tag_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(2, 6);

-- Seed Thread Likes
INSERT INTO thread_likes (thread_id, user_id) VALUES
(1, 1),
(2, 2);

-- Seed Chat Messages
INSERT INTO chat_messages (id, thread_id, user_id, content, reply_to_id) VALUES
(1, 1, 3, 'Saya menyarankan untuk menggunakan PyTorch pruning module secara bertahap, atau convert model ke ONNX lalu gunakan ORT optimizer agar performa di ponsel lebih ringan.', NULL);

-- Seed Message Reactions
INSERT INTO message_reactions (message_id, user_id, emoji) VALUES
(1, 1, '👍'),
(1, 2, '🙏');

-- Seed AI Tools
INSERT INTO ai_tools (id, name, type, description, icon_url, bg_color, pricing_text, use_case_description) VALUES
(1, 'Gemini', 'FREE', 'Model AI multimodal canggih buatan Google dengan integrasi ekosistem Workspace.', 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/extension/ios/production_ios_3x.png', 'bg-blue-50 text-blue-600', 'Free & Paid options', 'Menganalisis kode, menulis proposal projek, riset cepat, dan membuat asisten AI kustom.'),
(2, 'Claude', 'FREE', 'Model AI dengan penalaran logis yang luar biasa, handal untuk koding & debugging.', 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/code/ios/production_ios_3x.png', 'bg-indigo-50 text-indigo-600', 'Free & Pro available ($20/mo)', 'Merefaktor arsitektur kode kompleks, menulis script pengolahan data, and penjelasan teori sulit.'),
(3, 'NotebookLM', 'FREE', 'Buku catatan virtual bertenaga AI untuk menyusun materi dari dokumen riset Anda.', 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/book/ios/production_ios_3x.png', 'bg-emerald-50 text-emerald-600', '100% Free to use', 'Membaca paper riset AI yang tebal, membuat rangkuman instan, and menghasilkan audio podcast edukasi.'),
(4, 'ChatGPT', 'FREE', 'Asisten serba guna yang cepat dengan perpustakaan GPT kustom yang sangat melimpah.', 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/chat/ios/production_ios_3x.png', 'bg-green-50 text-green-600', 'Free & Plus available ($20/mo)', 'Brainstorming ide, penyuntingan bahasa, and membuat purwarupa aplikasi kilat.'),
(5, 'Midjourney', 'PRO ACCESS', 'AI generator gambar berkualitas tinggi dengan detail visual yang artistik.', 'https://raw.githubusercontent.com/google/material-design-icons/master/png/image/palette/ios/production_ios_3x.png', 'bg-purple-50 text-purple-600', 'Paid subscriptions only', 'Desain ilustrasi UI, visualisasi konsep projek, asset grafis presentasi akademik.'),
(6, 'Perplexity', 'FREE', 'Mesin pencari bertenaga AI yang menyediakan kutipan sumber untuk setiap informasi.', 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/language/ios/production_ios_3x.png', 'bg-teal-50 text-teal-600', 'Free & Pro available', 'Riset literatur, verifikasi kebenaran fakta ilmiah, pencarian berita tech terkini.');

-- Seed AI Tool Pros
INSERT INTO ai_tool_pros (tool_id, strength_text) VALUES
(1, 'Multimodal reasoning canggih untuk teks & visual'),
(1, 'Integrasi erat dengan Google Drive & Workspace'),
(2, 'Kemampuan koding dan penulisan terstruktur tingkat tinggi'),
(2, 'Kontekstual window yang sangat besar (200k tokens)'),
(3, 'Secara otomatis menghasilkan podcast audio interaktif'),
(3, 'Akurasi tinggi karena didasarkan langsung pada dokumen sumber'),
(4, 'Komunitas GPT kustom yang sangat luas untuk segala kebutuhan'),
(4, 'Respons super cepat dan UI yang familier'),
(5, 'Kualitas rendering gambar fotorealistik terdepan'),
(5, 'Kontrol parameter detail gambar yang sangat bervariasi'),
(6, 'Menyertakan kutipan link sumber asli untuk menghindari halusinasi'),
(6, 'Pencarian internet real-time yang sangat presisi');

-- Seed Articles
INSERT INTO articles (id, title, description, content, author_name, published_at, read_time_text, image_url, category) VALUES
(1, 'The Dawn of Reasoning Models: Paradigm Baru AI', 'Exploring the inner workings of search-based reasoning loops and multi-step computational graph execution in next-generation LLMs.', 'Paradigma pemrosesan bahasa alami (NLP) baru saja bergeser. Model AI generasi berikutnya tidak lagi sekadar menebak kata berikutnya dengan cepat (fast thinking), melainkan menggunakan rantai pemikiran internal (reasoning path) sebelum memberikan jawaban.\n\nDalam artikel ini, kita mengulas bagaimana proses pencarian graf komputasi (graph search) dan reinforcement learning diintegrasikan dalam model penalaran modern seperti o1/Gemini 1.5 Pro. Dengan metode ini, agen AI dapat melakukan self-correction saat merancang arsitektur database atau mencari bug logika yang rumit secara otonom.', 'Rian Hidayat, M.T.', '2026-05-01', '5 min read', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop', 'AI Research'),
(2, 'Getting Started with PyTorch 3.0: Compiler-Centric Deep Learning', 'A comprehensive developer roadmap for building custom compiler extensions using TorchDynamo and AOTAutograd.', 'Sejak dirilisnya versi 2.0, fokus PyTorch telah beralih sepenuhnya ke arah optimasi level kompilator menggunakan torch.compile.\n\nMemasuki era PyTorch 3.0, developer didorong untuk memahami bagaimana graf komputasi ditransformasikan menjadi kernel Triton yang teroptimasi secara dinamis. Kita akan membedah alur kerja TorchDynamo dalam menangkap graf, AOTAutograd untuk derivatif mundur, dan bagaimana menulis custom compiler pass untuk memangkas konsumsi VRAM GPU hingga 35%.', 'Dr. Indah Permata', '2026-05-10', '8 min read', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop', 'GENERATIVE AI');

-- Seed Trending News
INSERT INTO trending_news (id, type, title) VALUES
(1, 'BREAKTHROUGH', 'OpenAI merilis preview model penalaran terbaru dengan kemampuan kalkulasi sains super akurat.'),
(2, 'TECH ALERT', 'Nvidia meluncurkan kartu grafis arsitektur Blackwell Ultra untuk data center berskala masif.'),
(3, 'CAMPUS NEWS', 'JagoAI School membuka pendaftaran beasiswa penuh program AI Engineer gelombang kedua.');

-- Seed Notifications
INSERT INTO notifications (user_id, title_id, title_en, desc_id, desc_en, category, is_read) VALUES
(1, 'Selamat Datang di JagoAI School!', 'Welcome to JagoAI School!', 'Mulailah perjalanan AI Anda hari ini dengan menjelajahi The Academy dan mengklaim lencana pertama Anda.', 'Start your AI journey today by exploring The Academy and claiming your first badge.', 'system', FALSE),
(1, 'Pendaftaran Kursus Berhasil!', 'Course Enrollment Successful!', 'Anda telah sukses terdaftar di kelas "AI untuk SMP". Mulailah belajar modul pertama hari ini!', 'You have successfully enrolled in "AI for Junior High". Start learning the first module today!', 'learning', TRUE);

-- Seed Events
INSERT INTO events (id, title, description, event_date, event_time, type, location, price_text, price_raw, image_url, mentor_id, category) VALUES
(1, 'Webinar: Pengenalan Large Language Models (LLM) untuk Pemula', 'Pelajari bagaimana LLM bekerja dari nol, teknik prompt engineering tingkat lanjut, dan bagaimana Anda dapat memanfaatkannya untuk otomatisasi pekerjaan sehari-hari.', '2026-07-15', '19:00 - 20:30 WIB', 'ONLINE', 'Zoom Meeting & YouTube Live', 'FREE', 0.0, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop', 1, 'Expert Seminar'),
(2, 'Workshop: Fine-Tuning Model Object Detection YOLOv8', 'Praktik langsung (hands-on) melakukan anotasi gambar kustom, melakukan transfer learning model YOLOv8 pada Google Colab, dan mengekspor model tersebut untuk deteksi objek real-time.', '2026-08-05', '13:00 - 16:00 WIB', 'ONLINE', 'Zoom & Discord Class', 'IDR 150.000', 150000.0, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&fit=crop', 2, 'Practical Workshop'),
(3, 'Seminar Eksklusif: Masa Depan Artificial General Intelligence (AGI) & Etika AI', 'Diskusikan perkembangan mutakhir teknologi AI, tantangan etika, bias algoritma, serta regulasi AI secara global bersama para ahli terkemuka di bidang riset AI.', '2026-09-20', '09:00 - 12:00 WIB', 'ON-SITE', 'Gedung Rektorat Telkom University, Ruang Aula Lantai 4, Bandung', 'IDR 250.000', 250000.0, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&fit=crop', 1, 'Expert Seminar');
