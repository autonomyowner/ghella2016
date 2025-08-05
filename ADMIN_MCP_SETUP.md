# 🚀 Admin Panel MCP Setup - Complete Guide

## Overview
Your Elghella Agritech platform now has a comprehensive set of MCPs (Model Context Protocol servers) that replicate the functionality of popular services from [cursor.directory](https://cursor.directory/). These MCPs provide powerful admin panel capabilities for your agritech marketplace.

## 🎯 Available MCPs

### 1. **Supabase MCP** (Data Management)
- **Purpose**: Direct database access and CRUD operations
- **Features**: 
  - Query users, equipment, vegetables
  - Real-time data monitoring
  - Database schema generation
- **Commands**:
  ```bash
  npm run test:mcp-supabase
  node mcp-simple.js users
  node mcp-simple.js schema
  ```

### 2. **GibsonAI MCP** (Schema & API Generation)
- **Purpose**: Database modeling and API generation
- **Features**:
  - Generate Entity-Relationship Diagrams (ERD)
  - Create Postgres schemas
  - Generate REST API endpoints
  - Create validation schemas (Zod)
  - Generate Swagger/OpenAPI specs
- **Commands**:
  ```bash
  npm run test:mcp-gibsonai
  node mcp-simple.js api
  ```

### 3. **Bucket MCP** (File Management) - Replicates Bucket from cursor.directory
- **Purpose**: File storage and management
- **Features**:
  - Upload files to Supabase storage
  - List files in buckets
  - Delete files
  - Generate public URLs
  - Create storage buckets
- **Commands**:
  ```bash
  npm run test:mcp-bucket
  node mcp-file-manager.js upload <filepath> [bucket]
  node mcp-file-manager.js list [bucket]
  node mcp-file-manager.js delete <filepath> [bucket]
  node mcp-file-manager.js url <filepath> [bucket]
  node mcp-file-manager.js create-bucket <bucketname>
  ```

### 4. **Postmark MCP** (Email Management) - Replicates Postmark from cursor.directory
- **Purpose**: Email sending and management
- **Features**:
  - Send individual emails
  - Bulk email campaigns
  - Verification emails
  - Order confirmations
  - Admin notifications
  - Email logging and tracking
- **Commands**:
  ```bash
  npm run test:mcp-postmark
  node mcp-email-manager.js send <to> <subject> <content>
  node mcp-email-manager.js bulk <emails> <subject> <content>
  node mcp-email-manager.js verify <email> <name>
  node mcp-email-manager.js order <email> <orderid>
  node mcp-email-manager.js admin <email> <title> <message>
  node mcp-email-manager.js logs
  ```

### 5. **Peekaboo MCP** (Web Scraping) - Replicates Peekaboo from cursor.directory
- **Purpose**: Data extraction and web scraping
- **Features**:
  - Scrape agricultural market prices
  - Extract weather data
  - Gather equipment listings
  - Collect agricultural news
  - Store scraped data in database
- **Commands**:
  ```bash
  npm run test:mcp-peekaboo
  node mcp-web-scraper.js scrape <url>
  node mcp-web-scraper.js prices
  node mcp-web-scraper.js weather [location]
  node mcp-web-scraper.js equipment
  node mcp-web-scraper.js news
  node mcp-web-scraper.js data <tablename>
  ```

### 6. **Admin Panel MCP** (Comprehensive Dashboard)
- **Purpose**: Complete admin panel functionality
- **Features**:
  - Dashboard with key metrics
  - User management
  - Email management
  - File management
  - Notification management
  - Report generation
- **Commands**:
  ```bash
  npm run test:mcp-admin
  npm run admin:all
  npm run admin:users
  npm run admin:emails
  npm run admin:files
  npm run admin:notifications
  npm run admin:reports
  ```

## 🔧 Configuration

### MCP Configuration (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["mcp-simple.js", "users"],
      "env": {
        "NEXT_PUBLIC_SUPABASE_URL": "https://puvmqdnvofbtmqpcjmia.supabase.co",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your-key-here"
      }
    },
    "gibsonai": {
      "command": "node",
      "args": ["mcp-simple.js", "schema"]
    },
    "bucket": {
      "command": "node",
      "args": ["mcp-file-manager.js", "list"]
    },
    "postmark": {
      "command": "node",
      "args": ["mcp-email-manager.js", "logs"]
    },
    "peekaboo": {
      "command": "node",
      "args": ["mcp-web-scraper.js", "prices"]
    }
  }
}
```

## 📊 Database Tables

The following tables are created for the admin panel:

1. **email_logs** - Email sending logs
2. **market_prices** - Scraped market price data
3. **weather_data** - Scraped weather information
4. **equipment_listings** - Scraped equipment data
5. **news_articles** - Scraped agricultural news
6. **admin_notifications** - Admin notification system
7. **file_uploads** - File upload tracking

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Database Tables
```bash
# Run the SQL script to create admin tables
# create-admin-tables.sql
```

### 3. Test All MCPs
```bash
# Test individual MCPs
npm run test:mcp-supabase
npm run test:mcp-gibsonai
npm run test:mcp-bucket
npm run test:mcp-postmark
npm run test:mcp-peekaboo
npm run test:mcp-admin

# Run full admin panel check
npm run admin:all
```

## 💡 Usage Examples

### File Management
```bash
# List files in default bucket
node mcp-file-manager.js list

# Upload a file
node mcp-file-manager.js upload ./document.pdf

# Get file URL
node mcp-file-manager.js url uploads/document.pdf
```

### Email Management
```bash
# Send verification email
node mcp-email-manager.js verify user@example.com "John Doe"

# Send order confirmation
node mcp-email-manager.js order user@example.com "ORD-12345"

# View email logs
node mcp-email-manager.js logs
```

### Web Scraping
```bash
# Scrape market prices
node mcp-web-scraper.js prices

# Scrape weather data
node mcp-web-scraper.js weather "Algiers"

# View scraped data
node mcp-web-scraper.js data market_prices
```

### Admin Panel
```bash
# Show dashboard
node mcp-admin-panel.js dashboard

# Manage users
node mcp-admin-panel.js users

# Generate reports
node mcp-admin-panel.js reports

# Full system check
node mcp-admin-panel.js all
```

## 🔍 Natural Language Commands

You can now use natural language with Cursor to interact with your admin panel:

- "Show me all users in the database"
- "Send a verification email to john@example.com"
- "Upload the latest report to the admin bucket"
- "Scrape current market prices for tomatoes"
- "Generate a user growth report"
- "Check email delivery status"
- "List all uploaded files"

## 🛠️ Troubleshooting

### Common Issues

1. **MCP SDK Compatibility**: If you encounter SDK errors, the custom MCPs bypass these issues by using direct Node.js execution.

2. **Database Tables Missing**: Run the `create-admin-tables.sql` script to create required tables.

3. **Email Configuration**: Set up your email credentials in environment variables:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **File Storage**: Create storage buckets in your Supabase dashboard for file uploads.

### Error Resolution

- **"relation does not exist"**: Run the database setup script
- **"Email sending failed"**: Check email credentials
- **"File upload failed"**: Verify Supabase storage configuration
- **"Scraping failed"**: Check internet connection and target URLs

## 📈 Performance Optimization

- All MCPs use efficient database queries with proper indexing
- File uploads are optimized for large files
- Email sending includes retry logic
- Web scraping includes rate limiting
- Real-time monitoring for live data updates

## 🔐 Security Features

- All database operations use Supabase RLS (Row Level Security)
- Email credentials are stored securely in environment variables
- File uploads include validation and virus scanning
- Admin actions are logged for audit trails

## 🎯 Next Steps

1. **Customize Email Templates**: Modify email templates in `mcp-email-manager.js`
2. **Add More Scraping Sources**: Extend `mcp-web-scraper.js` with additional websites
3. **Create Custom Reports**: Add new report types to `mcp-admin-panel.js`
4. **Integrate with External APIs**: Add API integrations for weather, market data, etc.
5. **Build Web Interface**: Create a React admin dashboard using these MCPs

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the error logs in the terminal
3. Verify your Supabase configuration
4. Test individual MCPs to isolate issues

---

**🎉 Your admin panel is now powered by professional-grade MCPs that rival the best services from cursor.directory!** 