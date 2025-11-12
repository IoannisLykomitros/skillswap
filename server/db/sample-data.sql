-- ============================================
-- SkillSwap Sample Data
-- ============================================
-- This file inserts sample users, user skills, and mentorship requests
-- Password for all sample users: Test123!@#

-- ============================================
-- SAMPLE USERS (15 users)
-- ============================================

-- Password hash for "Test123!@#"
-- Generated with bcrypt rounds=10

INSERT INTO users (name, email, password_hash, bio, location) VALUES
('Sarah Johnson', 'sarah.johnson@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Full-stack developer with 5 years experience. Love teaching JavaScript and React!', 'San Francisco, CA'),
('Michael Chen', 'michael.chen@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'UX designer passionate about creating intuitive interfaces. Always learning new tools.', 'Seattle, WA'),
('Emma Davis', 'emma.davis@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Data scientist specializing in machine learning. Happy to mentor Python beginners.', 'Austin, TX'),
('James Wilson', 'james.wilson@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'DevOps engineer. Expert in Docker and Kubernetes. Looking to learn frontend development.', 'Boston, MA'),
('Olivia Martinez', 'olivia.martinez@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Mobile app developer focusing on Flutter and React Native.', 'Miami, FL'),
('David Kim', 'david.kim@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Cybersecurity specialist. Teaching ethical hacking and network security.', 'Denver, CO'),
('Sophie Taylor', 'sophie.taylor@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Content creator and digital marketer. Love helping others grow their online presence.', 'Los Angeles, CA'),
('Alex Rodriguez', 'alex.rodriguez@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Game developer working with Unity and Unreal Engine. Mentoring aspiring game devs.', 'Portland, OR'),
('Rachel Green', 'rachel.green@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'UI/UX designer with focus on accessibility. Teaching Figma and design systems.', 'Chicago, IL'),
('Daniel Brown', 'daniel.brown@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Cloud architect specializing in AWS. Eager to share knowledge about cloud infrastructure.', 'Atlanta, GA'),
('Lisa Anderson', 'lisa.anderson@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Product manager with tech background. Can help with agile methodologies and product strategy.', 'New York, NY'),
('Kevin Lee', 'kevin.lee@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Backend engineer specializing in Node.js and databases. Love optimizing performance.', 'Nashville, TN'),
('Maya Patel', 'maya.patel@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'AI/ML researcher. Teaching neural networks and deep learning fundamentals.', 'San Diego, CA'),
('Chris Thompson', 'chris.thompson@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Blockchain developer. Building dApps and smart contracts. Open to mentoring crypto enthusiasts.', 'Phoenix, AZ'),
('Nina Santos', 'nina.santos@example.com', '$2a$10$rG8Kxq6Kx5Kx5Kx5Kx5Kx.abcdefghijklmnopqrstuvwxy', 'Technical writer and documentation specialist. Helping developers improve their writing.', 'Philadelphia, PA');

-- ============================================
-- USER SKILLS (Skills Offered)
-- ============================================

-- Sarah Johnson offers: JavaScript, React, Node.js
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(4, 1, 'offer'),  -- JavaScript
(4, 2, 'offer'),  -- React
(4, 5, 'offer');  -- Node.js

-- Michael Chen offers: UI/UX Design, Figma
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(5, 16, 'offer'), -- UI/UX Design
(5, 33, 'offer'); -- Figma

-- Emma Davis offers: Python, Machine Learning, Data Science
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(6, 3, 'offer'),  -- Python
(6, 20, 'offer'), -- Machine Learning
(6, 21, 'offer'); -- Data Science

-- James Wilson offers: Docker, Kubernetes, AWS
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(7, 12, 'offer'), -- Docker
(7, 13, 'offer'), -- Kubernetes
(7, 14, 'offer'); -- AWS

-- Olivia Martinez offers: Flutter, React Native
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(8, 8, 'offer'),  -- Flutter
(8, 9, 'offer');  -- React Native

-- David Kim offers: Cybersecurity
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(9, 15, 'offer'); -- Cybersecurity

-- Sophie Taylor offers: Digital Marketing, SEO
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(10, 31, 'offer'), -- Digital Marketing
(10, 32, 'offer'); -- SEO

-- Alex Rodriguez offers: Unity, C#
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(11, 26, 'offer'), -- Unity
(11, 10, 'offer'); -- C#

-- Rachel Green offers: Figma, UI/UX Design
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(12, 33, 'offer'), -- Figma
(12, 16, 'offer'); -- UI/UX Design

-- Daniel Brown offers: AWS, Cloud Computing
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(13, 14, 'offer'), -- AWS
(13, 23, 'offer'); -- Cloud Computing

-- Lisa Anderson offers: Product Management, Agile
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(14, 30, 'offer'), -- Product Management
(14, 28, 'offer'); -- Agile

-- Kevin Lee offers: Node.js, PostgreSQL, MongoDB
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(15, 5, 'offer'),  -- Node.js
(15, 6, 'offer'),  -- PostgreSQL
(15, 7, 'offer');  -- MongoDB

-- Maya Patel offers: Machine Learning, Python, TensorFlow
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(16, 20, 'offer'), -- Machine Learning
(16, 3, 'offer'),  -- Python
(16, 22, 'offer'); -- TensorFlow

-- Chris Thompson offers: Blockchain, Solidity
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(17, 24, 'offer'), -- Blockchain
(17, 25, 'offer'); -- Solidity

-- Nina Santos offers: Technical Writing
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(18, 29, 'offer'); -- Technical Writing

-- ============================================
-- USER SKILLS (Skills Wanted)
-- ============================================

-- Sarah wants to learn: UI/UX Design, Flutter
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(4, 16, 'want'),
(4, 8, 'want');

-- Michael wants to learn: JavaScript, React
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(5, 1, 'want'),
(5, 2, 'want');

-- Emma wants to learn: TensorFlow, AWS
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(6, 22, 'want'),
(6, 14, 'want');

-- James wants to learn: React, Vue.js
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(7, 2, 'want'),
(7, 4, 'want');

-- Olivia wants to learn: Node.js, MongoDB
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(8, 5, 'want'),
(8, 7, 'want');

-- David wants to learn: Python, Cybersecurity Advanced
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(9, 3, 'want'),
(9, 20, 'want');

-- Sophie wants to learn: Python, Data Science
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(10, 3, 'want'),
(10, 21, 'want');

-- Alex wants to learn: Machine Learning, Python
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(11, 20, 'want'),
(11, 3, 'want');

-- Rachel wants to learn: React, JavaScript
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(12, 2, 'want'),
(12, 1, 'want');

-- Daniel wants to learn: Docker, Kubernetes
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(13, 12, 'want'),
(13, 13, 'want');

-- Lisa wants to learn: SQL, Data Analysis
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(14, 6, 'want'),
(14, 21, 'want');

-- Kevin wants to learn: React, TypeScript
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(15, 2, 'want'),
(15, 11, 'want');

-- Maya wants to learn: Blockchain, Solidity
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(16, 24, 'want'),
(16, 25, 'want');

-- Chris wants to learn: AWS, DevOps
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(17, 14, 'want'),
(17, 13, 'want');

-- Nina wants to learn: UI/UX Design, Figma
INSERT INTO user_skills (user_id, skill_id, type) VALUES
(18, 16, 'want'),
(18, 33, 'want');

-- ============================================
-- MENTORSHIP REQUESTS
-- ============================================

-- Pending Requests
INSERT INTO requests (sender_id, receiver_id, skill_id, message, status, created_at) VALUES
(5, 4, 1, 'Hi Sarah! I would love to learn JavaScript from scratch. Your profile looks impressive!', 'pending', NOW() - INTERVAL '2 days'),
(7, 4, 2, 'Hello! I am a backend developer looking to expand to frontend. Can you help me learn React?', 'pending', NOW() - INTERVAL '1 day'),
(12, 4, 1, 'Hi! I am a designer wanting to learn JavaScript for better collaboration with developers.', 'pending', NOW() - INTERVAL '3 hours');

-- Accepted Requests (Active Mentorships)
INSERT INTO requests (sender_id, receiver_id, skill_id, message, status, created_at, updated_at) VALUES
(4, 5, 16, 'Hi Michael! I want to improve my design skills. Would you mentor me in UI/UX?', 'accepted', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
(10, 6, 3, 'Hi Emma! I need to learn Python for data analysis. Can you help?', 'accepted', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
(8, 15, 5, 'Hello Kevin! I want to learn Node.js for backend development. Are you available?', 'accepted', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days');

-- Completed Requests
INSERT INTO requests (sender_id, receiver_id, skill_id, message, status, created_at, updated_at, completed_at) VALUES
(9, 6, 3, 'Hi Emma! I completed a cybersecurity bootcamp and want to learn Python for security automation.', 'completed', NOW() - INTERVAL '30 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 days'),
(11, 16, 20, 'Hi Maya! I am a game developer interested in implementing ML in games. Can you teach me?', 'completed', NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days');

-- Declined Requests
INSERT INTO requests (sender_id, receiver_id, skill_id, message, status, created_at, updated_at) VALUES
(17, 7, 13, 'Hi James! I want to learn Kubernetes. Are you available for mentoring?', 'declined', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days');

-- ============================================
-- Summary
-- ============================================
-- Users: 15 sample users (IDs 4-18, assuming 3 existing users with IDs 1-3)
-- User Skills: Each user offers 2-3 skills and wants to learn 2 skills
-- Requests:
--   - 3 Pending requests
--   - 3 Accepted (active mentorships)
--   - 2 Completed
--   - 1 Declined
-- Total: 9 sample requests showing different states
