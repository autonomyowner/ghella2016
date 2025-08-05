#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

// Database entities definition
const ENTITIES = {
  User: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    name: 'VARCHAR(255) NOT NULL',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    role: "ENUM('farmer', 'buyer', 'admin') NOT NULL DEFAULT 'farmer'",
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },
  Farm: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    owner_id: 'uuid REFERENCES users(id) ON DELETE CASCADE',
    name: 'VARCHAR(255) NOT NULL',
    location: 'TEXT',
    size: 'DECIMAL(10,2)', // in acres
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },
  MarketplaceItem: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    seller_id: 'uuid REFERENCES users(id) ON DELETE CASCADE',
    title: 'VARCHAR(255) NOT NULL',
    description: 'TEXT',
    price: 'DECIMAL(10,2) NOT NULL',
    category: "ENUM('animals', 'equipment', 'land', 'vegetables', 'services') NOT NULL",
    quantity: 'INTEGER DEFAULT 1',
    image_url: 'TEXT',
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },
  Order: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    buyer_id: 'uuid REFERENCES users(id) ON DELETE CASCADE',
    item_id: 'uuid REFERENCES marketplace_items(id) ON DELETE CASCADE',
    quantity: 'INTEGER NOT NULL DEFAULT 1',
    status: "ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'",
    created_at: 'TIMESTAMP DEFAULT NOW()',
    updated_at: 'TIMESTAMP DEFAULT NOW()'
  },
  FieldLog: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    farm_id: 'uuid REFERENCES farms(id) ON DELETE CASCADE',
    satellite_image_url: 'TEXT',
    weather_summary: 'TEXT',
    soil_moisture: 'DECIMAL(5,2)', // percentage
    created_at: 'TIMESTAMP DEFAULT NOW()'
  }
};

// Generate ERD (Entity-Relationship Diagram)
function generateERD() {
  let erd = `# Entity-Relationship Diagram

## Entities

### User
- id (UUID, PK)
- name (VARCHAR)
- email (VARCHAR, UNIQUE)
- role (ENUM: farmer, buyer, admin)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Farm
- id (UUID, PK)
- owner_id (UUID, FK → User.id)
- name (VARCHAR)
- location (TEXT)
- size (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### MarketplaceItem
- id (UUID, PK)
- seller_id (UUID, FK → User.id)
- title (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- category (ENUM)
- quantity (INTEGER)
- image_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Order
- id (UUID, PK)
- buyer_id (UUID, FK → User.id)
- item_id (UUID, FK → MarketplaceItem.id)
- quantity (INTEGER)
- status (ENUM)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### FieldLog
- id (UUID, PK)
- farm_id (UUID, FK → Farm.id)
- satellite_image_url (TEXT)
- weather_summary (TEXT)
- soil_moisture (DECIMAL)
- created_at (TIMESTAMP)

## Relationships

1. User (1) → (N) Farm (owner_id)
2. User (1) → (N) MarketplaceItem (seller_id)
3. User (1) → (N) Order (buyer_id)
4. Farm (1) → (N) FieldLog (farm_id)
5. MarketplaceItem (1) → (N) Order (item_id)

## Cardinality
- One-to-Many relationships between all entities
- Proper foreign key constraints with CASCADE deletes
`;

  return erd;
}

// Generate Postgres Schema
function generatePostgresSchema() {
  let schema = `-- Postgres Schema for Elghella Agritech Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE item_category AS ENUM ('animals', 'equipment', 'land', 'vegetables', 'services');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Farms table
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    size DECIMAL(10,2), -- in acres
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Marketplace items table
CREATE TABLE marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category item_category NOT NULL,
    quantity INTEGER DEFAULT 1,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Field logs table
CREATE TABLE field_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    satellite_image_url TEXT,
    weather_summary TEXT,
    soil_moisture DECIMAL(5,2), -- percentage
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_farms_owner_id ON farms(owner_id);
CREATE INDEX idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_item_id ON orders(item_id);
CREATE INDEX idx_field_logs_farm_id ON field_logs(farm_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

  return schema;
}

// Generate API Endpoints
function generateAPIEndpoints() {
  let api = `# REST API Endpoints

## Base URL: /api/v1

### Users
- GET /users - List all users
- GET /users/:id - Get user by ID
- POST /users - Create new user
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

### Farms
- GET /farms - List all farms
- GET /farms/:id - Get farm by ID
- GET /farms/user/:userId - Get farms by owner
- POST /farms - Create new farm
- PUT /farms/:id - Update farm
- DELETE /farms/:id - Delete farm

### Marketplace Items
- GET /marketplace-items - List all items
- GET /marketplace-items/:id - Get item by ID
- GET /marketplace-items/category/:category - Get items by category
- GET /marketplace-items/seller/:sellerId - Get items by seller
- POST /marketplace-items - Create new item
- PUT /marketplace-items/:id - Update item
- DELETE /marketplace-items/:id - Delete item

### Orders
- GET /orders - List all orders
- GET /orders/:id - Get order by ID
- GET /orders/buyer/:buyerId - Get orders by buyer
- POST /orders - Create new order
- PUT /orders/:id - Update order status
- DELETE /orders/:id - Cancel order

### Field Logs
- GET /field-logs - List all field logs
- GET /field-logs/:id - Get field log by ID
- GET /field-logs/farm/:farmId - Get logs by farm
- POST /field-logs - Create new field log
- PUT /field-logs/:id - Update field log
- DELETE /field-logs/:id - Delete field log

## Request/Response Examples

### Create User
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "farmer"
}

### Create Marketplace Item
POST /api/v1/marketplace-items
Content-Type: application/json

{
  "seller_id": "uuid-here",
  "title": "Fresh Tomatoes",
  "description": "Organic tomatoes from my farm",
  "price": 25.50,
  "category": "vegetables",
  "quantity": 10,
  "image_url": "https://example.com/tomatoes.jpg"
}

### Create Order
POST /api/v1/orders
Content-Type: application/json

{
  "buyer_id": "uuid-here",
  "item_id": "uuid-here",
  "quantity": 2
}
`;

  return api;
}

// Generate Validation Schemas
function generateValidationSchemas() {
  let schemas = `# Validation Schemas (Zod)

import { z } from 'zod';

// User schemas
export const CreateUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: z.enum(['farmer', 'buyer', 'admin']).default('farmer')
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Farm schemas
export const CreateFarmSchema = z.object({
  owner_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  location: z.string().optional(),
  size: z.number().positive().optional()
});

export const UpdateFarmSchema = CreateFarmSchema.partial();

// Marketplace item schemas
export const CreateMarketplaceItemSchema = z.object({
  seller_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.enum(['animals', 'equipment', 'land', 'vegetables', 'services']),
  quantity: z.number().int().positive().default(1),
  image_url: z.string().url().optional()
});

export const UpdateMarketplaceItemSchema = CreateMarketplaceItemSchema.partial();

// Order schemas
export const CreateOrderSchema = z.object({
  buyer_id: z.string().uuid(),
  item_id: z.string().uuid(),
  quantity: z.number().int().positive().default(1)
});

export const UpdateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
});

// Field log schemas
export const CreateFieldLogSchema = z.object({
  farm_id: z.string().uuid(),
  satellite_image_url: z.string().url().optional(),
  weather_summary: z.string().optional(),
  soil_moisture: z.number().min(0).max(100).optional()
});

export const UpdateFieldLogSchema = CreateFieldLogSchema.partial();
`;

  return schemas;
}

// Generate Swagger/OpenAPI specification
function generateSwaggerSpec() {
  return `# OpenAPI/Swagger Specification

openapi: 3.0.0
info:
  title: Elghella Agritech API
  version: 1.0.0
  description: API for the Elghella Agritech marketplace platform

servers:
  - url: https://api.elghella.com/v1
    description: Production server
  - url: http://localhost:3000/api/v1
    description: Development server

paths:
  /users:
    get:
      summary: List all users
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: User details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        email:
          type: string
          format: email
        role:
          type: string
          enum: [farmer, buyer, admin]
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required: [id, name, email, role]

    CreateUser:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 255
        email:
          type: string
          format: email
        role:
          type: string
          enum: [farmer, buyer, admin]
          default: farmer
      required: [name, email]

    Farm:
      type: object
      properties:
        id:
          type: string
          format: uuid
        owner_id:
          type: string
          format: uuid
        name:
          type: string
        location:
          type: string
        size:
          type: number
          format: float
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required: [id, owner_id, name]

    MarketplaceItem:
      type: object
      properties:
        id:
          type: string
          format: uuid
        seller_id:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        price:
          type: number
          format: float
        category:
          type: string
          enum: [animals, equipment, land, vegetables, services]
        quantity:
          type: integer
          minimum: 1
        image_url:
          type: string
          format: uri
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required: [id, seller_id, title, price, category]

    Order:
      type: object
      properties:
        id:
          type: string
          format: uuid
        buyer_id:
          type: string
          format: uuid
        item_id:
          type: string
          format: uuid
        quantity:
          type: integer
          minimum: 1
        status:
          type: string
          enum: [pending, confirmed, shipped, delivered, cancelled]
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required: [id, buyer_id, item_id, quantity]

    FieldLog:
      type: object
      properties:
        id:
          type: string
          format: uuid
        farm_id:
          type: string
          format: uuid
        satellite_image_url:
          type: string
          format: uri
        weather_summary:
          type: string
        soil_moisture:
          type: number
          format: float
          minimum: 0
          maximum: 100
        created_at:
          type: string
          format: date-time
      required: [id, farm_id]
`;
}

// MCP Server implementation
const server = new Server(
  {
    name: 'gibsonai-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

// Tool definitions
const tools = [
  {
    name: 'generate_erd',
    description: 'Generate Entity-Relationship Diagram for the database schema',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'generate_postgres_schema',
    description: 'Generate complete Postgres schema with tables, indexes, and triggers',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'generate_api_endpoints',
    description: 'Generate REST API endpoints documentation and examples',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'generate_validation_schemas',
    description: 'Generate Zod validation schemas for all entities',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'generate_swagger_spec',
    description: 'Generate OpenAPI/Swagger specification for the API',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
];

// Set up tool handlers
server.setRequestHandler('tools/list', async () => {
  return { tools };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'generate_erd':
      return {
        content: [
          {
            type: 'text',
            text: generateERD()
          }
        ]
      };

    case 'generate_postgres_schema':
      return {
        content: [
          {
            type: 'text',
            text: generatePostgresSchema()
          }
        ]
      };

    case 'generate_api_endpoints':
      return {
        content: [
          {
            type: 'text',
            text: generateAPIEndpoints()
          }
        ]
      };

    case 'generate_validation_schemas':
      return {
        content: [
          {
            type: 'text',
            text: generateValidationSchemas()
          }
        ]
      };

    case 'generate_swagger_spec':
      return {
        content: [
          {
            type: 'text',
            text: generateSwaggerSpec()
          }
        ]
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport); 