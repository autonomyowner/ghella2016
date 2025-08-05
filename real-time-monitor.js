#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Real-time monitoring functions
async function monitorUsers() {
  try {
    console.log('👥 Monitoring real-time user activity...\n');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error monitoring users:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No user activity detected.');
      return;
    }

    console.log(`✅ Live user activity: ${data.length} recent updates\n`);
    
    // Show most recently updated users
    data.slice(0, 5).forEach((user, index) => {
      const lastUpdate = new Date(user.updated_at).toLocaleString();
      console.log(`👤 User ${index + 1} (Updated: ${lastUpdate}):`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.full_name || 'N/A'}`);
      console.log(`   Type: ${user.user_type || 'N/A'}`);
      console.log(`   Status: ${user.is_verified ? 'Verified' : 'Unverified'}`);
      console.log(`   Role: ${user.role || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in user monitoring:', error);
  }
}

async function monitorEquipment() {
  try {
    console.log('🔧 Monitoring real-time equipment activity...\n');
    
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error monitoring equipment:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No equipment activity detected.');
      console.log('💡 Equipment table is ready for new listings.');
      return;
    }

    console.log(`✅ Live equipment activity: ${data.length} recent items\n`);
    
    data.forEach((item, index) => {
      const createdDate = new Date(item.created_at).toLocaleString();
      console.log(`🔧 Equipment ${index + 1} (Added: ${createdDate}):`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Title: ${item.title || 'N/A'}`);
      console.log(`   Price: ${item.price || 'N/A'}`);
      console.log(`   Category: ${item.category || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in equipment monitoring:', error);
  }
}

async function monitorVegetables() {
  try {
    console.log('🥬 Monitoring real-time vegetables activity...\n');
    
    const { data, error } = await supabase
      .from('vegetables')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error monitoring vegetables:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No vegetables activity detected.');
      console.log('💡 Vegetables table is ready for new listings.');
      return;
    }

    console.log(`✅ Live vegetables activity: ${data.length} recent items\n`);
    
    data.forEach((item, index) => {
      const createdDate = new Date(item.created_at).toLocaleString();
      console.log(`🥬 Vegetable ${index + 1} (Added: ${createdDate}):`);
      console.log(`   ID: ${item.id}`);
      console.log(`   Name: ${item.name || 'N/A'}`);
      console.log(`   Price: ${item.price || 'N/A'}`);
      console.log(`   Quantity: ${item.quantity || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in vegetables monitoring:', error);
  }
}

async function getLiveAnalytics() {
  try {
    console.log('📊 Generating live analytics...\n');
    
    // Get current data
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
      console.error('❌ Error fetching live analytics data');
      return;
    }

    console.log('📈 Live Platform Analytics:\n');
    
    // User analytics
    console.log('👥 Live User Analytics:');
    console.log(`   Total Active Users: ${users?.length || 0}`);
    console.log(`   Farmers: ${users?.filter(u => u.user_type === 'farmer').length || 0}`);
    console.log(`   Buyers: ${users?.filter(u => u.user_type === 'buyer').length || 0}`);
    console.log(`   Admins: ${users?.filter(u => u.is_admin).length || 0}`);
    console.log(`   Verified Users: ${users?.filter(u => u.is_verified).length || 0}`);
    
    // Marketplace analytics
    console.log('\n🛒 Live Marketplace Analytics:');
    console.log(`   Equipment Items: ${equipment?.length || 0}`);
    console.log(`   Vegetable Items: ${vegetables?.length || 0}`);
    console.log(`   Total Marketplace Items: ${(equipment?.length || 0) + (vegetables?.length || 0)}`);
    
    // Activity indicators
    const now = new Date();
    const recentUsers = users?.filter(u => {
      const updatedDate = new Date(u.updated_at);
      const hoursDiff = (now - updatedDate) / (1000 * 60 * 60);
      return hoursDiff <= 24; // Users active in last 24 hours
    }).length || 0;
    
    console.log('\n⏰ Live Activity Indicators:');
    console.log(`   Users Active (24h): ${recentUsers}`);
    console.log(`   Platform Status: ${recentUsers > 0 ? '🟢 Active' : '🟡 Low Activity'}`);
    console.log(`   Marketplace Status: ${(equipment?.length || 0) + (vegetables?.length || 0) > 0 ? '🟢 Has Items' : '🟡 Empty'}`);

  } catch (error) {
    console.error('❌ Error generating live analytics:', error);
  }
}

// Continuous monitoring function
async function startMonitoring(interval = 30000) { // 30 seconds default
  console.log('🚀 Starting real-time monitoring...\n');
  console.log(`⏱️  Monitoring interval: ${interval / 1000} seconds\n`);
  
  let iteration = 1;
  
  const monitor = async () => {
    console.log(`\n🔄 Monitoring Cycle #${iteration} - ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    
    await monitorUsers();
    console.log('='.repeat(30));
    await monitorEquipment();
    console.log('='.repeat(30));
    await monitorVegetables();
    console.log('='.repeat(30));
    await getLiveAnalytics();
    
    console.log(`\n⏰ Next update in ${interval / 1000} seconds...`);
    console.log('Press Ctrl+C to stop monitoring\n');
    
    iteration++;
  };

  // Initial run
  await monitor();
  
  // Set up continuous monitoring
  setInterval(monitor, interval);
}

// Main function
async function main() {
  const command = process.argv[2];
  const interval = parseInt(process.argv[3]) || 30000; // Default 30 seconds
  
  switch (command) {
    case 'users':
      await monitorUsers();
      break;
    case 'equipment':
      await monitorEquipment();
      break;
    case 'vegetables':
      await monitorVegetables();
      break;
    case 'analytics':
      await getLiveAnalytics();
      break;
    case 'monitor':
      await startMonitoring(interval);
      break;
    default:
      console.log('🚀 Real-time Monitoring - Available Commands:');
      console.log('  node real-time-monitor.js users      - Monitor user activity');
      console.log('  node real-time-monitor.js equipment  - Monitor equipment activity');
      console.log('  node real-time-monitor.js vegetables - Monitor vegetables activity');
      console.log('  node real-time-monitor.js analytics  - Show live analytics');
      console.log('  node real-time-monitor.js monitor    - Start continuous monitoring');
      console.log('  node real-time-monitor.js monitor 10000 - Monitor every 10 seconds');
      break;
  }
}

// Run the main function
main().catch(console.error); 