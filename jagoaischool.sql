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
    avatar_url VARCHAR(500) DEFAULT 'https://i.pravatar.cc/150',
    role VARCHAR(50) NOT NULL DEFAULT 'LEARNER', -- 'LEARNER', 'TENTOR', 'ADMIN', 'SUPER_ADMIN'
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    language_preference VARCHAR(10) DEFAULT 'id',
    bio TEXT NULL,
    website_url VARCHAR(500) NULL,
    linkedin_url VARCHAR(500) NULL,
    email_notifications BOOLEAN DEFAULT TRUE,
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
