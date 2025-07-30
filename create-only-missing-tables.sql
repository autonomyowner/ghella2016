-- =====================================================
-- Create ONLY Missing Communication Tables
-- =====================================================

-- Step 1: Create Contact Messages Table (This is the main missing table)
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general', -- general, support, feedback, other
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_notes TEXT,
    admin_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES auth.users(id)
);

-- Step 2: Create Expert Applications Table
CREATE TABLE IF NOT EXISTS expert_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    specialization VARCHAR(255) NOT NULL, -- زراعة، تربية حيوانات، استشارات، etc.
    experience_years INTEGER NOT NULL,
    education VARCHAR(255),
    certifications TEXT,
    bio TEXT NOT NULL,
    services_offered TEXT,
    languages TEXT[], -- Array of languages spoken
    availability VARCHAR(100), -- full-time, part-time, consulting
    hourly_rate DECIMAL(10,2),
    portfolio_url VARCHAR(500),
    cv_file_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, under_review
    admin_notes TEXT,
    admin_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id)
);

-- Step 3: Create Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    preferences JSONB DEFAULT '{}', -- Store user preferences for newsletter content
    status VARCHAR(50) DEFAULT 'active', -- active, unsubscribed, bounced
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website', -- website, admin, api
    ip_address INET,
    user_agent TEXT
);

-- Step 4: Create Admin Messages Table
CREATE TABLE IF NOT EXISTS admin_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- alert, notification, system
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    target_audience VARCHAR(50) DEFAULT 'all', -- all, admins, experts, users
    is_read BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Step 5: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_expert_applications_status ON expert_applications(status);
CREATE INDEX IF NOT EXISTS idx_expert_applications_created_at ON expert_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);

-- Step 6: Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS Policies

-- Contact Messages RLS Policies
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
CREATE POLICY "Admins can view all contact messages" ON contact_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can insert contact messages" ON contact_messages;
CREATE POLICY "Users can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Expert Applications RLS Policies
DROP POLICY IF EXISTS "Users can view their own applications" ON expert_applications;
CREATE POLICY "Users can view their own applications" ON expert_applications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert expert applications" ON expert_applications;
CREATE POLICY "Users can insert expert applications" ON expert_applications
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own applications" ON expert_applications;
CREATE POLICY "Users can update their own applications" ON expert_applications
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all expert applications" ON expert_applications;
CREATE POLICY "Admins can view all expert applications" ON expert_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

-- Newsletter Subscriptions RLS Policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletter_subscriptions;
CREATE POLICY "Admins can view all newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

-- Admin Messages RLS Policies
DROP POLICY IF EXISTS "Admins can manage admin messages" ON admin_messages;
CREATE POLICY "Admins can manage admin messages" ON admin_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.user_type = 'admin'
        )
    );

-- Step 8: Insert Sample Data
INSERT INTO contact_messages (name, email, subject, message, message_type) VALUES
('أحمد محمد', 'ahmed@example.com', 'استفسار عن الخدمات', 'أريد معرفة المزيد عن خدماتكم الزراعية', 'general'),
('فاطمة علي', 'fatima@example.com', 'طلب استشارة', 'أحتاج استشارة في مجال تربية الحيوانات', 'support'),
('محمد حسن', 'mohamed@example.com', 'اقتراح تحسين', 'اقتراحاتي لتحسين الموقع', 'feedback')
ON CONFLICT DO NOTHING;

INSERT INTO expert_applications (full_name, email, phone, specialization, experience_years, bio, services_offered) VALUES
('د. خالد أحمد', 'khalid@example.com', '+213123456789', 'استشارات زراعية', 15, 'خبير زراعي مع 15 سنة خبرة في مجال الزراعة العضوية', 'استشارات، دراسات جدوى، تدريب'),
('أ. سارة محمد', 'sara@example.com', '+213987654321', 'تربية الحيوانات', 8, 'متخصصة في تربية الأغنام والماعز', 'استشارات تربية، رعاية صحية، تغذية')
ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscriptions (email, full_name) VALUES
('user1@example.com', 'أحمد محمد'),
('user2@example.com', 'فاطمة علي'),
('user3@example.com', 'محمد حسن')
ON CONFLICT DO NOTHING;

-- Step 9: Create Functions for Common Operations
CREATE OR REPLACE FUNCTION get_unread_messages_count()
RETURNS TABLE(
    contact_messages_count BIGINT,
    expert_applications_count BIGINT,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread')::BIGINT,
        (SELECT COUNT(*) FROM expert_applications WHERE status = 'pending')::BIGINT,
        ((SELECT COUNT(*) FROM contact_messages WHERE status = 'unread') + 
         (SELECT COUNT(*) FROM expert_applications WHERE status = 'pending'))::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_as_read(message_id UUID, message_type VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    IF message_type = 'contact' THEN
        UPDATE contact_messages 
        SET status = 'read', updated_at = NOW() 
        WHERE id = message_id;
        RETURN FOUND;
    ELSIF message_type = 'expert' THEN
        UPDATE expert_applications 
        SET status = 'under_review', updated_at = NOW() 
        WHERE id = message_id;
        RETURN FOUND;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Display confirmation
SELECT '✅ Missing communication tables created successfully!' as status; 