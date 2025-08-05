-- Create admin panel tables for MCPs

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient VARCHAR(255) NOT NULL,
    subject TEXT,
    content TEXT,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Market prices table
CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB,
    scraped_at TIMESTAMP DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'web_scraper'
);

-- Weather data table
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location VARCHAR(255),
    data JSONB,
    scraped_at TIMESTAMP DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'web_scraper'
);

-- Equipment listings table
CREATE TABLE IF NOT EXISTS equipment_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB,
    scraped_at TIMESTAMP DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'web_scraper'
);

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB,
    scraped_at TIMESTAMP DEFAULT NOW(),
    source VARCHAR(100) DEFAULT 'web_scraper'
);

-- Admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    bucket_name VARCHAR(100),
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

CREATE INDEX IF NOT EXISTS idx_market_prices_scraped_at ON market_prices(scraped_at);
CREATE INDEX IF NOT EXISTS idx_weather_data_location ON weather_data(location);
CREATE INDEX IF NOT EXISTS idx_weather_data_scraped_at ON weather_data(scraped_at);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at);

-- Insert sample data
INSERT INTO admin_notifications (title, message, type) VALUES
('System Online', 'All MCP servers are now operational', 'success'),
('New User Registration', 'User zellag has registered', 'info'),
('Marketplace Update', 'New equipment listings available', 'info');

-- Insert sample email log
INSERT INTO email_logs (recipient, subject, content, status) VALUES
('admin@elghella.com', 'System Test', 'Test email from MCP', 'sent'); 