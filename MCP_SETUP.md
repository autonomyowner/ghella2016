# MCP (Model Context Protocol) Setup Guide

This project is configured with two MCP servers to enhance AI capabilities in Cursor:

## 🟢 MCP Servers

### 1. Supabase MCP
- **Purpose**: Direct database access and CRUD operations
- **Tables**: users, farms, field_logs, marketplace_items, orders
- **Capabilities**: Read, Create, Update, Delete operations

### 2. GibsonAI MCP
- **Purpose**: Database modeling and schema generation
- **Capabilities**: ERD generation, Postgres schema, API endpoints, validation schemas

## 📁 Configuration Files

```
.cursor/mcp.json          # MCP server configuration
mcp-supabase.js          # Supabase MCP server
mcp-gibsonai.js          # GibsonAI MCP server
```

## 🚀 Usage Examples

### Supabase MCP Commands

You can now use natural language to interact with your Supabase database:

```
"Show me all users in the database"
"Create a new farm for user John Doe"
"Update the price of marketplace item with ID 123"
"Delete the order with ID 456"
"List all marketplace items in the vegetables category"
```

### GibsonAI MCP Commands

Generate database artifacts with natural language:

```
"Generate an Entity-Relationship Diagram for my database"
"Create a Postgres schema for my agritech platform"
"Generate REST API endpoints for all entities"
"Create Zod validation schemas for my database"
"Generate a Swagger specification for my API"
```

## 🔧 Testing MCP Servers

Test the MCP servers individually:

```bash
# Test Supabase MCP
npm run test:mcp-supabase

# Test GibsonAI MCP
npm run test:mcp-gibsonai
```

## 📊 Database Schema

The MCPs are configured for the following entities:

### User
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- role (ENUM: farmer, buyer, admin)
- created_at, updated_at

### Farm
- id (UUID, PK)
- owner_id (UUID, FK → User.id)
- name (VARCHAR)
- location (TEXT)
- size (DECIMAL)
- created_at, updated_at

### MarketplaceItem
- id (UUID, PK)
- seller_id (UUID, FK → User.id)
- title (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- category (ENUM)
- quantity (INTEGER)
- image_url (TEXT)
- created_at, updated_at

### Order
- id (UUID, PK)
- buyer_id (UUID, FK → User.id)
- item_id (UUID, FK → MarketplaceItem.id)
- quantity (INTEGER)
- status (ENUM)
- created_at, updated_at

### FieldLog
- id (UUID, PK)
- farm_id (UUID, FK → Farm.id)
- satellite_image_url (TEXT)
- weather_summary (TEXT)
- soil_moisture (DECIMAL)
- created_at

## 🔐 Environment Variables

The Supabase MCP uses these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are automatically loaded from your `.env.local` file.

## 🛠️ Troubleshooting

### MCP Server Not Starting
1. Check if Node.js is installed: `node --version`
2. Verify dependencies: `npm install`
3. Test individual servers: `npm run test:mcp-supabase`

### Database Connection Issues
1. Verify Supabase credentials in `.env.local`
2. Check if tables exist in your Supabase project
3. Ensure RLS policies allow access

### Cursor Not Recognizing MCPs
1. Restart Cursor after configuration
2. Check `.cursor/mcp.json` syntax
3. Verify file paths in MCP configuration

## 📝 Example Queries

### Database Operations
```
"Get all farms owned by users with role 'farmer'"
"Create a new marketplace item with title 'Fresh Tomatoes' and price 25.50"
"Update the status of order 123 to 'confirmed'"
"Show me all field logs for farm ID 456"
```

### Schema Generation
```
"Generate a complete Postgres schema with indexes and triggers"
"Create an ERD showing relationships between all entities"
"Generate TypeScript types for all database entities"
"Create API documentation with request/response examples"
```

## 🔄 Updating MCP Configuration

To add new tables or modify existing ones:

1. Update the `TABLES` object in `mcp-supabase.js`
2. Add corresponding entity definitions in `mcp-gibsonai.js`
3. Restart Cursor to reload MCP configuration

## 📚 Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Cursor MCP Integration](https://cursor.sh/docs/mcp)

## 🎯 Next Steps

1. Test the MCPs with natural language queries in Cursor
2. Generate database schemas using GibsonAI MCP
3. Implement the generated API endpoints in your Next.js app
4. Set up proper RLS policies in Supabase for security 