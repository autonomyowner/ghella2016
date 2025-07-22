// Script to generate TypeScript types from Firebase
// Run this after setting up the database

const { createClient } = require('@Firebase/Firebase-js');

const FirebaseUrl = 'https://fyfgsvuenljeiicpwtjg.Firebase.co';
const FirebaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZmdzdnVlbmxqZWlpY3B3dGpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkyNDM0NiwiZXhwIjoyMDY3NTAwMzQ2fQ.mQ7hwI7W5j6o1rRpWjNirSD0vP2kkhymkYPQMEndOls';

const Firebase = createClient(FirebaseUrl, FirebaseKey);

async function generateTypes() {
  try {
    console.log('Generating TypeScript types from Firebase...');
    
    // Test connection
    const { data, error } = await Firebase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Firebase:', error);
      return;
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Database is set up and ready.');
    console.log('\nNext steps:');
    console.log('1. Run: npx Firebase gen types typescript --project-id fyfgsvuenljeiicpwtjg > src/types/database.types.ts');
    console.log('2. Restart your development server');
    console.log('3. Test the profile page');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

generateTypes(); 
