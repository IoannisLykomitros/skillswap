-- SkillSwap Seed Data
-- This file populates the database with sample skills

TRUNCATE TABLE requests, user_skills, skills RESTART IDENTITY CASCADE;

-- =====================================
-- INSERT SAMPLE SKILLS
-- =====================================

INSERT INTO skills (skill_name, category, description) VALUES
    -- Programming Skills
    ('JavaScript', 'Programming', 'Popular programming language for web development'),
    ('Python', 'Programming', 'Versatile programming language used for data science, web development, and automation'),
    ('React', 'Programming', 'JavaScript library for building user interfaces'),
    ('Node.js', 'Programming', 'JavaScript runtime for building server-side applications'),
    ('SQL', 'Programming', 'Language for managing and querying databases'),
    ('Java', 'Programming', 'Object-oriented programming language widely used in enterprise applications'),
    ('TypeScript', 'Programming', 'Typed superset of JavaScript'),
    
    -- Design Skills
    ('UI/UX Design', 'Design', 'User interface and user experience design principles'),
    ('Figma', 'Design', 'Collaborative interface design tool'),
    ('Adobe Photoshop', 'Design', 'Image editing and graphic design software'),
    ('Graphic Design', 'Design', 'Visual communication and design principles'),
    
    -- Languages
    ('Spanish', 'Languages', 'Romance language spoken by over 500 million people'),
    ('French', 'Languages', 'Romance language spoken in France and many other countries'),
    ('German', 'Languages', 'Germanic language spoken primarily in Central Europe'),
    ('Mandarin Chinese', 'Languages', 'Most spoken language in the world'),
    ('Japanese', 'Languages', 'East Asian language spoken in Japan'),
    
    -- Music
    ('Guitar', 'Music', 'String instrument fundamental to many music genres'),
    ('Piano', 'Music', 'Keyboard instrument used in classical and contemporary music'),
    ('Singing', 'Music', 'Vocal music and voice training'),
    ('Music Theory', 'Music', 'Understanding the fundamentals of music composition'),
    
    -- Arts & Crafts
    ('Drawing', 'Arts', 'Visual art technique using pencils, pens, or other tools'),
    ('Painting', 'Arts', 'Art of applying paint to create images'),
    ('Photography', 'Arts', 'Art and technique of creating images with a camera'),
    ('Knitting', 'Crafts', 'Textile craft using needles and yarn'),
    
    -- Business & Marketing
    ('Digital Marketing', 'Business', 'Online marketing strategies and techniques'),
    ('Content Writing', 'Business', 'Creating written content for websites, blogs, and marketing'),
    ('Public Speaking', 'Business', 'Effective communication and presentation skills'),
    ('Project Management', 'Business', 'Planning, organizing, and managing projects'),
    
    -- Fitness & Wellness
    ('Yoga', 'Fitness', 'Physical, mental, and spiritual practices'),
    ('Running', 'Fitness', 'Endurance exercise and training'),
    ('Meditation', 'Wellness', 'Mindfulness and mental well-being practices'),
    ('Nutrition', 'Wellness', 'Understanding healthy eating and dietary planning'),
    
    -- Cooking
    ('Italian Cooking', 'Cooking', 'Traditional Italian cuisine and recipes'),
    ('Baking', 'Cooking', 'Bread, pastries, and dessert preparation'),
    ('Vegetarian Cooking', 'Cooking', 'Plant-based meal preparation'),
    
    -- Other
    ('Chess', 'Games', 'Strategic board game'),
    ('Gardening', 'Lifestyle', 'Plant cultivation and garden maintenance'),
    ('Video Editing', 'Media', 'Editing and post-production for video content'),
    ('Podcasting', 'Media', 'Audio content creation and production');

-- Display confirmation message
SELECT COUNT(*) as "Total Skills Inserted" FROM skills;
