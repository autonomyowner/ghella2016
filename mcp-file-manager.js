#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Supabase configuration - Use anon key for admin operations
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// File management functions
async function uploadFile(filePath, bucketName = 'admin-files') {
  try {
    console.log(`📤 Uploading file: ${filePath} to bucket: ${bucketName}\n`);
    
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`uploads/${Date.now()}-${fileName}`, fileBuffer, {
        contentType: 'application/octet-stream'
      });

    if (error) {
      console.error('❌ Error uploading file:', error);
      return;
    }

    console.log(`✅ File uploaded successfully!`);
    console.log(`   File: ${fileName}`);
    console.log(`   Path: ${data.path}`);
    console.log(`   Bucket: ${bucketName}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error in file upload:', error);
  }
}

async function listFiles(bucketName = 'admin-files') {
  try {
    console.log(`📁 Listing files in bucket: ${bucketName}\n`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('uploads');

    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No files found in bucket.');
      return;
    }

    console.log(`✅ Found ${data.length} file(s):\n`);
    
    data.forEach((file, index) => {
      console.log(`📄 File ${index + 1}:`);
      console.log(`   Name: ${file.name}`);
      console.log(`   Size: ${file.metadata?.size || 'Unknown'} bytes`);
      console.log(`   Created: ${file.created_at || 'Unknown'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listing files:', error);
  }
}

async function deleteFile(filePath, bucketName = 'admin-files') {
  try {
    console.log(`🗑️  Deleting file: ${filePath} from bucket: ${bucketName}\n`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting file:', error);
      return;
    }

    console.log(`✅ File deleted successfully!`);
    console.log(`   Path: ${filePath}`);
    
  } catch (error) {
    console.error('❌ Error deleting file:', error);
  }
}

async function getFileUrl(filePath, bucketName = 'admin-files') {
  try {
    console.log(`🔗 Getting URL for file: ${filePath}\n`);
    
    const { data } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log(`✅ File URL generated:`);
    console.log(`   URL: ${data.publicUrl}`);
    console.log(`   Path: ${filePath}`);
    
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Error getting file URL:', error);
  }
}

async function createBucket(bucketName) {
  try {
    console.log(`🪣 Creating bucket: ${bucketName}\n`);
    
    // Note: Supabase storage buckets are typically created via dashboard
    // This is a simulation of bucket creation
    console.log(`✅ Bucket '${bucketName}' would be created`);
    console.log(`💡 Note: Create buckets via Supabase dashboard for production`);
    
  } catch (error) {
    console.error('❌ Error creating bucket:', error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  switch (command) {
    case 'upload':
      if (!arg1) {
        console.log('❌ Please provide a file path: node mcp-file-manager.js upload <filepath>');
        return;
      }
      await uploadFile(arg1, arg2);
      break;
      
    case 'list':
      await listFiles(arg1);
      break;
      
    case 'delete':
      if (!arg1) {
        console.log('❌ Please provide a file path: node mcp-file-manager.js delete <filepath>');
        return;
      }
      await deleteFile(arg1, arg2);
      break;
      
    case 'url':
      if (!arg1) {
        console.log('❌ Please provide a file path: node mcp-file-manager.js url <filepath>');
        return;
      }
      await getFileUrl(arg1, arg2);
      break;
      
    case 'create-bucket':
      if (!arg1) {
        console.log('❌ Please provide a bucket name: node mcp-file-manager.js create-bucket <bucketname>');
        return;
      }
      await createBucket(arg1);
      break;
      
    default:
      console.log('🚀 File Manager MCP - Available Commands:');
      console.log('  node mcp-file-manager.js upload <filepath> [bucket]    - Upload file');
      console.log('  node mcp-file-manager.js list [bucket]                 - List files');
      console.log('  node mcp-file-manager.js delete <filepath> [bucket]    - Delete file');
      console.log('  node mcp-file-manager.js url <filepath> [bucket]       - Get file URL');
      console.log('  node mcp-file-manager.js create-bucket <bucketname>    - Create bucket');
      break;
  }
}

// Run the main function
main().catch(console.error); 