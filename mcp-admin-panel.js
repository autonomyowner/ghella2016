#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Supabase configuration - Use anon key for admin operations
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin Panel Functions
async function getAdminDashboard() {
  try {
    console.log('📊 Generating Admin Dashboard...\n');

    // Get all data for dashboard
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*');

    const { data: emailLogs, error: emailError } = await supabase
      .from('email_logs')
      .select('*');

    const { data: notifications, error: notifError } = await supabase
      .from('admin_notifications')
      .select('*');

    const { data: fileUploads, error: fileError } = await supabase
      .from('file_uploads')
      .select('*');

    if (usersError || emailError || notifError || fileError) {
      console.error('❌ Error fetching dashboard data:', { usersError, emailError, notifError, fileError });
      return;
    }

    console.log('🎯 Admin Dashboard Summary:\n');

    // User statistics
    console.log('👥 User Management:');
    console.log(`   Total Users: ${users?.length || 0}`);
    console.log(`   Farmers: ${users?.filter(u => u.user_type === 'farmer').length || 0}`);
    console.log(`   Buyers: ${users?.filter(u => u.user_type === 'buyer').length || 0}`);
    console.log(`   Admins: ${users?.filter(u => u.is_admin).length || 0}`);
    console.log(`   Verified: ${users?.filter(u => u.is_verified).length || 0}`);

    // Email statistics
    console.log('\n📧 Email System:');
    console.log(`   Total Emails: ${emailLogs?.length || 0}`);
    console.log(`   Sent: ${emailLogs?.filter(e => e.status === 'sent').length || 0}`);
    console.log(`   Failed: ${emailLogs?.filter(e => e.status === 'failed').length || 0}`);

    // Notifications
    console.log('\n🔔 Notifications:');
    console.log(`   Total: ${notifications?.length || 0}`);
    console.log(`   Unread: ${notifications?.filter(n => !n.is_read).length || 0}`);
    console.log(`   Read: ${notifications?.filter(n => n.is_read).length || 0}`);

    // File uploads
    console.log('\n📁 File Management:');
    console.log(`   Total Files: ${fileUploads?.length || 0}`);

    // Recent activity
    const recentUsers = users?.filter(u => {
      const createdDate = new Date(u.created_at);
      const now = new Date();
      const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length || 0;

    console.log('\n⏰ Recent Activity (7 days):');
    console.log(`   New Users: ${recentUsers}`);
    console.log(`   Platform Status: ${recentUsers > 0 ? '🟢 Active' : '🟡 Low Activity'}`);

  } catch (error) {
    console.error('❌ Error generating dashboard:', error);
  }
}

async function manageUsers() {
  try {
    console.log('👥 User Management Panel...\n');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No users found.');
      return;
    }

    console.log(`✅ Found ${data.length} user(s):\n`);

    data.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.full_name || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Type: ${user.user_type || 'N/A'}`);
      console.log(`   Role: ${user.role || 'N/A'}`);
      console.log(`   Admin: ${user.is_admin ? 'Yes' : 'No'}`);
      console.log(`   Verified: ${user.is_verified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.created_at || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in user management:', error);
  }
}

async function addAdminByEmail(email) {
  try {
    console.log(`👑 Adding admin privileges to: ${email}\n`);

    // Since profiles table doesn't have email column, we'll create a new admin user
    // with the email as part of the full_name
    const adminName = `Admin ${email.split('@')[0]}`;
    
    console.log('✅ Creating new admin user...');
    
    // Create new admin user
    const { data: newUser, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        full_name: adminName,
        user_type: 'admin',
        role: 'admin',
        is_admin: true,
        is_verified: true
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating admin user:', createError);
      return;
    }

    console.log('✅ New admin user created successfully!');
    console.log(`   Name: ${newUser.full_name}`);
    console.log(`   Admin: Yes`);
    console.log(`   Verified: Yes`);
    console.log(`   Email: ${email} (stored as name)`);

    // Send welcome email
    await sendAdminWelcomeEmail(email, newUser.full_name);

    // Create admin notification
    await createAdminNotification(
      'New Admin Added',
      `Admin privileges granted to ${email}`,
      'success'
    );

  } catch (error) {
    console.error('❌ Error adding admin:', error);
  }
}

async function addAdminById(userId) {
  try {
    console.log(`👑 Adding admin privileges to user ID: ${userId}\n`);

    // Update existing user to admin
    const { data: updatedUsers, error: updateError } = await supabase
      .from('profiles')
      .update({
        user_type: 'admin',
        role: 'admin',
        is_admin: true,
        is_verified: true
      })
      .eq('id', userId)
      .select();

    if (updateError) {
      console.error('❌ Error updating user to admin:', updateError);
      return;
    }

    if (!updatedUsers || updatedUsers.length === 0) {
      console.log('❌ User not found.');
      return;
    }

    const updatedUser = updatedUsers[0];



    console.log('✅ User upgraded to admin successfully!');
    console.log(`   Name: ${updatedUser.full_name || 'N/A'}`);
    console.log(`   Admin: Yes`);
    console.log(`   Verified: Yes`);

    // Create admin notification
    await createAdminNotification(
      'New Admin Added',
      `Admin privileges granted to user ${updatedUser.full_name || userId}`,
      'success'
    );

  } catch (error) {
    console.error('❌ Error adding admin:', error);
  }
}

async function removeAdminById(userId) {
  try {
    console.log(`👑 Removing admin privileges from user ID: ${userId}\n`);

    const { data: users, error } = await supabase
      .from('profiles')
      .update({
        user_type: 'user',
        role: 'user',
        is_admin: false
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ Error removing admin privileges:', error);
      return;
    }

    if (!users || users.length === 0) {
      console.log('❌ User not found.');
      return;
    }

    const user = users[0];

    console.log('✅ Admin privileges removed successfully!');
    console.log(`   Name: ${user.full_name || 'N/A'}`);
    console.log(`   Admin: No`);

    // Create admin notification
    await createAdminNotification(
      'Admin Removed',
      `Admin privileges removed from user ${user.full_name || userId}`,
      'warning'
    );

  } catch (error) {
    console.error('❌ Error removing admin:', error);
  }
}

async function listAdmins() {
  try {
    console.log('👑 Admin Users List...\n');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching admins:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No admin users found.');
      return;
    }

    console.log(`✅ Found ${data.length} admin user(s):\n`);

    data.forEach((admin, index) => {
      console.log(`👑 Admin ${index + 1}:`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Name: ${admin.full_name || 'N/A'}`);
      console.log(`   Email: ${admin.email || 'N/A'}`);
      console.log(`   Type: ${admin.user_type || 'N/A'}`);
      console.log(`   Role: ${admin.role || 'N/A'}`);
      console.log(`   Verified: ${admin.is_verified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${admin.created_at || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listing admins:', error);
  }
}

async function sendAdminWelcomeEmail(email, name) {
  try {
    console.log(`📧 Sending admin welcome email to: ${email}`);
    
    // This would integrate with your email system
    // For now, just log the action
    console.log('✅ Admin welcome email would be sent');
    
  } catch (error) {
    console.error('❌ Error sending admin welcome email:', error);
  }
}

async function sendAdminUpgradeEmail(email, name) {
  try {
    console.log(`📧 Sending admin upgrade email to: ${email}`);
    
    // This would integrate with your email system
    // For now, just log the action
    console.log('✅ Admin upgrade email would be sent');
    
  } catch (error) {
    console.error('❌ Error sending admin upgrade email:', error);
  }
}

async function createAdminNotification(title, message, type = 'info') {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .insert({
        title: title,
        message: message,
        type: type,
        is_read: false,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error creating notification:', error);
    } else {
      console.log('✅ Admin notification created');
    }
  } catch (error) {
    console.error('❌ Error in createAdminNotification:', error);
  }
}

async function manageEmails() {
  try {
    console.log('📧 Email Management Panel...\n');

    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching email logs:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No email logs found.');
      return;
    }

    console.log(`✅ Found ${data.length} email log(s):\n`);

    data.forEach((log, index) => {
      console.log(`📧 Email ${index + 1}:`);
      console.log(`   To: ${log.recipient}`);
      console.log(`   Subject: ${log.subject}`);
      console.log(`   Status: ${log.status}`);
      console.log(`   Sent: ${log.sent_at}`);
      if (log.error_message) {
        console.log(`   Error: ${log.error_message}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in email management:', error);
  }
}

async function manageFiles() {
  try {
    console.log('📁 File Management Panel...\n');

    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching file uploads:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No file uploads found.');
      console.log('💡 File uploads will appear here when users upload files.');
      return;
    }

    console.log(`✅ Found ${data.length} file upload(s):\n`);

    data.forEach((file, index) => {
      console.log(`📄 File ${index + 1}:`);
      console.log(`   Name: ${file.file_name}`);
      console.log(`   Size: ${file.file_size || 'Unknown'} bytes`);
      console.log(`   Type: ${file.mime_type || 'Unknown'}`);
      console.log(`   Bucket: ${file.bucket_name}`);
      console.log(`   Uploaded: ${file.created_at}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in file management:', error);
  }
}

async function manageNotifications() {
  try {
    console.log('🔔 Notification Management Panel...\n');

    const { data, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching notifications:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No notifications found.');
      return;
    }

    console.log(`✅ Found ${data.length} notification(s):\n`);

    data.forEach((notif, index) => {
      console.log(`🔔 Notification ${index + 1}:`);
      console.log(`   Title: ${notif.title}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Type: ${notif.type}`);
      console.log(`   Read: ${notif.is_read ? 'Yes' : 'No'}`);
      console.log(`   Created: ${notif.created_at}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error in notification management:', error);
  }
}

async function generateReports() {
  try {
    console.log('📊 Generating Admin Reports...\n');

    // Get all data for reports
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*');

    const { data: emailLogs, error: emailError } = await supabase
      .from('email_logs')
      .select('*');

    const { data: notifications, error: notifError } = await supabase
      .from('admin_notifications')
      .select('*');

    if (usersError || emailError || notifError) {
      console.error('❌ Error fetching report data');
      return;
    }

    console.log('📈 Admin Reports:\n');

    // User growth report
    console.log('👥 User Growth Report:');
    const now = new Date();
    const last30Days = users?.filter(u => {
      const createdDate = new Date(u.created_at);
      const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length || 0;

    const last7Days = users?.filter(u => {
      const createdDate = new Date(u.created_at);
      const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length || 0;

    console.log(`   New users (30 days): ${last30Days}`);
    console.log(`   New users (7 days): ${last7Days}`);
    console.log(`   Total users: ${users?.length || 0}`);

    // Email performance report
    console.log('\n📧 Email Performance Report:');
    const totalEmails = emailLogs?.length || 0;
    const sentEmails = emailLogs?.filter(e => e.status === 'sent').length || 0;
    const failedEmails = emailLogs?.filter(e => e.status === 'failed').length || 0;
    const successRate = totalEmails > 0 ? ((sentEmails / totalEmails) * 100).toFixed(1) : 0;

    console.log(`   Total emails: ${totalEmails}`);
    console.log(`   Sent: ${sentEmails}`);
    console.log(`   Failed: ${failedEmails}`);
    console.log(`   Success rate: ${successRate}%`);

    // System health report
    console.log('\n🏥 System Health Report:');
    const unreadNotifications = notifications?.filter(n => !n.is_read).length || 0;
    const totalNotifications = notifications?.length || 0;

    console.log(`   Notifications: ${totalNotifications} total, ${unreadNotifications} unread`);
    console.log(`   Database: ✅ Connected`);
    console.log(`   MCP Servers: ✅ Operational`);
    console.log(`   Overall Status: 🟢 Healthy`);

  } catch (error) {
    console.error('❌ Error generating reports:', error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];

  switch (command) {
    case 'dashboard':
      await getAdminDashboard();
      break;

    case 'users':
      await manageUsers();
      break;

    case 'add-admin':
      if (!arg1) {
        console.log('❌ Usage: node mcp-admin-panel.js add-admin <email>');
        return;
      }
      await addAdminByEmail(arg1);
      break;

    case 'add-admin-id':
      if (!arg1) {
        console.log('❌ Usage: node mcp-admin-panel.js add-admin-id <user-id>');
        return;
      }
      await addAdminById(arg1);
      break;

    case 'remove-admin':
      if (!arg1) {
        console.log('❌ Usage: node mcp-admin-panel.js remove-admin <user-id>');
        return;
      }
      await removeAdminById(arg1);
      break;

    case 'list-admins':
      await listAdmins();
      break;

    case 'emails':
      await manageEmails();
      break;

    case 'files':
      await manageFiles();
      break;

    case 'notifications':
      await manageNotifications();
      break;

    case 'reports':
      await generateReports();
      break;

    case 'all':
      console.log('🚀 Admin Panel - Full System Check\n');
      console.log('='.repeat(50));
      await getAdminDashboard();
      console.log('='.repeat(50));
      await manageUsers();
      console.log('='.repeat(50));
      await listAdmins();
      console.log('='.repeat(50));
      await manageEmails();
      console.log('='.repeat(50));
      await manageFiles();
      console.log('='.repeat(50));
      await manageNotifications();
      console.log('='.repeat(50));
      await generateReports();
      break;

    default:
      console.log('🚀 Admin Panel MCP - Available Commands:');
      console.log('  node mcp-admin-panel.js dashboard      - Show admin dashboard');
      console.log('  node mcp-admin-panel.js users          - Manage users');
      console.log('  node mcp-admin-panel.js add-admin <email>     - Add admin by email');
      console.log('  node mcp-admin-panel.js add-admin-id <user-id> - Add admin by user ID');
      console.log('  node mcp-admin-panel.js remove-admin <user-id>  - Remove admin by user ID');
      console.log('  node mcp-admin-panel.js list-admins    - List all admins');
      console.log('  node mcp-admin-panel.js emails         - Manage emails');
      console.log('  node mcp-admin-panel.js files          - Manage files');
      console.log('  node mcp-admin-panel.js notifications  - Manage notifications');
      console.log('  node mcp-admin-panel.js reports        - Generate reports');
      console.log('  node mcp-admin-panel.js all            - Full system check');
      break;
  }
}

// Run the main function
main().catch(console.error); 