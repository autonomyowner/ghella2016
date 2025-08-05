#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define accessible tables
const TABLES = {
  profiles: 'profiles',
  equipment: 'equipment', 
  vegetables: 'vegetables',
  farms: 'farms',
  marketplace_items: 'marketplace_items',
  orders: 'orders',
  field_logs: 'field_logs'
};

// MCP Server implementation
const server = new Server(
  {
    name: 'supabase-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {
        subscribe: true,
      },
    },
  }
);

// Handle resource listing
server.setRequestHandler('resources/list', async () => {
  return {
    resources: Object.entries(TABLES).map(([key, table]) => ({
      uri: `supabase://${table}`,
      name: table,
      description: `Supabase table: ${table}`,
      mimeType: 'application/json',
    })),
  };
});

// Handle resource reading (CRUD operations)
server.setRequestHandler('resources/read', async (request) => {
  const { uri } = request.params;
  const tableName = uri.replace('supabase://', '');
  
  if (!TABLES[tableName]) {
    throw new Error(`Table ${tableName} not accessible`);
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(100);

    if (error) throw error;

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to read from ${tableName}: ${error.message}`);
  }
});

// Handle resource creation (INSERT operations)
server.setRequestHandler('resources/create', async (request) => {
  const { uri, contents } = request.params;
  const tableName = uri.replace('supabase://', '');
  
  if (!TABLES[tableName]) {
    throw new Error(`Table ${tableName} not accessible`);
  }

  try {
    const data = JSON.parse(contents[0].text);
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) throw error;

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to create in ${tableName}: ${error.message}`);
  }
});

// Handle resource updates (UPDATE operations)
server.setRequestHandler('resources/update', async (request) => {
  const { uri, contents } = request.params;
  const tableName = uri.replace('supabase://', '');
  
  if (!TABLES[tableName]) {
    throw new Error(`Table ${tableName} not accessible`);
  }

  try {
    const data = JSON.parse(contents[0].text);
    const { id, ...updateData } = data;
    
    const { data: result, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to update in ${tableName}: ${error.message}`);
  }
});

// Handle resource deletion (DELETE operations)
server.setRequestHandler('resources/delete', async (request) => {
  const { uri } = request.params;
  const tableName = uri.replace('supabase://', '');
  
  if (!TABLES[tableName]) {
    throw new Error(`Table ${tableName} not accessible`);
  }

  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', request.params.id);

    if (error) throw error;

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ success: true, message: 'Record deleted' }, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to delete from ${tableName}: ${error.message}`);
  }
});

// Start the server
const transport = new StdioServerTransport();
server.connect(transport); 