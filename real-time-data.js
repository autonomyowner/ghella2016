#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Real-time data access functions
async function getRealTimeUsers() {
  try {
    console.log('🔍 Accessing real-time user data...\n');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching real-time user data:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No real-time user data available.');
      return;
    }

    console.log(`✅ Real-time data: ${data.length} active users\n`);
    
    // Show most recent users first
    const recentUsers = data.slice(0, 5);
    recentUsers.forEach((user, index) => {
      console.log(`👤 Recent User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.full_name || 'N/A'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Location: ${user.location || 'N/A'}`);
      console.log(`   User Type: ${user.user_type || 'N/A'}`);
      console.log(`   Role: ${user.role || 'N/A'}`);
      console.log(`   Is Admin: ${user.is_admin ? 'Yes' : 'No'}`);
      console.log(`   Is Verified: ${user.is_verified ? 'Yes' : 'No'}`);
      console.log(`   Last Updated: ${user.updated_at || 'N/A'}`);
      console.log('');
    });

    // Real-time analytics
    console.log('📊 Real-time Analytics:');
    const userTypeCounts = data.reduce((acc, user) => {
      acc[user.user_type] = (acc[user.user_type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(userTypeCounts).forEach(([userType, count]) => {
      console.log(`   ${userType || 'Unknown'}: ${count} active users`);
    });

    const adminCount = data.filter(u => u.is_admin).length;
    const verifiedCount = data.filter(u => u.is_verified).length;
    const recentActivity = data.filter(u => {
      const createdDate = new Date(u.created_at);
      const now = new Date();
      const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Users created in last 7 days
    }).length;
    
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Verified users: ${verifiedCount}`);
    console.log(`   New users (7 days): ${recentActivity}`);
    console.log(`   Total active users: ${data.length}`);

  } catch (error) {
    console.error('❌ Unexpected error accessing real-time data:', error);
  }
}

async function getRealTimeEquipment() {
  try {
    console.log('🔍 Accessing real-time equipment data...\n');
    
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching real-time equipment data:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No real-time equipment data available.');
      console.log('💡 Equipment table is ready for data insertion.');
      return;
    }

    console.log(`✅ Real-time data: ${data.length} equipment items\n`);
    
    data.forEach((item, index) => {
      console.log(`🔧 Equipment ${index + 1}:`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Title: ${item.title || 'N/A'}`);
      console.log(`   Description: ${item.description || 'N/A'}`);
      console.log(`   Price: ${item.price || 'N/A'}`);
      console.log(`   Category: ${item.category || 'N/A'}`);
      console.log(`   Seller: ${item.seller_id || 'N/A'}`);
      console.log(`   Created: ${item.created_at || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Unexpected error accessing real-time equipment data:', error);
  }
}

async function getRealTimeVegetables() {
  try {
    console.log('🔍 Accessing real-time vegetables data...\n');
    
    const { data, error } = await supabase
      .from('vegetables')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching real-time vegetables data:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No real-time vegetables data available.');
      console.log('💡 Vegetables table is ready for data insertion.');
      return;
    }

    console.log(`✅ Real-time data: ${data.length} vegetable items\n`);
    
    data.forEach((item, index) => {
      console.log(`🥬 Vegetable ${index + 1}:`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Name: ${item.name || 'N/A'}`);
      console.log(`   Description: ${item.description || 'N/A'}`);
      console.log(`   Price: ${item.price || 'N/A'}`);
      console.log(`   Quantity: ${item.quantity || 'N/A'}`);
      console.log(`   Seller: ${item.seller_id || 'N/A'}`);
      console.log(`   Created: ${item.created_at || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Unexpected error accessing real-time vegetables data:', error);
  }
}

async function getRealTimeAnalytics() {
  try {
    console.log('📊 Generating real-time analytics...\n');
    
    // Get all data for analytics
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*');

    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('*');

    const { data: vegetables, error: vegetablesError } = await supabase
      .from('vegetables')
      .select('*');

    if (usersError || equipmentError || vegetablesError) {
      console.error('❌ Error fetching data for analytics');
      return;
    }

    console.log('📈 Real-time Platform Analytics:\n');
    
    // User analytics
    console.log('👥 User Analytics:');
    console.log(`   Total Users: ${users?.length || 0}`);
    console.log(`   Farmers: ${users?.filter(u => u.user_type === 'farmer').length || 0}`);
    console.log(`   Buyers: ${users?.filter(u => u.user_type === 'buyer').length || 0}`);
    console.log(`   Admins: ${users?.filter(u => u.is_admin).length || 0}`);
    console.log(`   Verified Users: ${users?.filter(u => u.is_verified).length || 0}`);
    
    // Location analytics
    const locations = users?.reduce((acc, user) => {
      if (user.location) {
        acc[user.location] = (acc[user.location] || 0) + 1;
      }
      return acc;
    }, {}) || {};
    
    console.log('\n📍 Location Distribution:');
    Object.entries(locations).forEach(([location, count]) => {
      console.log(`   ${location}: ${count} users`);
    });

    // Marketplace analytics
    console.log('\n🛒 Marketplace Analytics:');
    console.log(`   Equipment Items: ${equipment?.length || 0}`);
    console.log(`   Vegetable Items: ${vegetables?.length || 0}`);
    console.log(`   Total Items: ${(equipment?.length || 0) + (vegetables?.length || 0)}`);
    
    // Recent activity
    const now = new Date();
    const recentUsers = users?.filter(u => {
      const createdDate = new Date(u.created_at);
      const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length || 0;
    
    console.log('\n⏰ Recent Activity (30 days):');
    console.log(`   New Users: ${recentUsers}`);
    console.log(`   Active Platform: ${recentUsers > 0 ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('❌ Unexpected error generating analytics:', error);
  }
}

// Main function to handle different commands
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'users':
      await getRealTimeUsers();
      break;
    case 'equipment':
      await getRealTimeEquipment();
      break;
    case 'vegetables':
      await getRealTimeVegetables();
      break;
    case 'analytics':
      await getRealTimeAnalytics();
      break;
    case 'all':
      console.log('🚀 Accessing all real-time data...\n');
      await getRealTimeUsers();
      console.log('\n' + '='.repeat(60) + '\n');
      await getRealTimeEquipment();
      console.log('\n' + '='.repeat(60) + '\n');
      await getRealTimeVegetables();
      console.log('\n' + '='.repeat(60) + '\n');
      await getRealTimeAnalytics();
      break;
    default:
      console.log('🚀 Real-time Data Access - Available Commands:');
      console.log('  node real-time-data.js users      - Show real-time user data');
      console.log('  node real-time-data.js equipment  - Show real-time equipment data');
      console.log('  node real-time-data.js vegetables - Show real-time vegetables data');
      console.log('  node real-time-data.js analytics  - Show real-time analytics');
      console.log('  node real-time-data.js all        - Show all real-time data');
      break;
  }
}

// Run the main function
main().catch(console.error); 