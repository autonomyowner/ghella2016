#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Supabase configuration - Use anon key for admin operations
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Email configuration (using Gmail SMTP for demo)
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
};

// Email management functions
async function sendEmail(to, subject, content, from = 'admin@elghella.com') {
  try {
    console.log(`📧 Sending email to: ${to}\n`);
    
    const transporter = nodemailer.createTransporter(emailConfig);
    
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: content,
      text: content.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    // Log email to database
    await logEmail(to, subject, content, 'sent');
    
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    await logEmail(to, subject, content, 'failed', error.message);
  }
}

async function sendBulkEmail(recipients, subject, content, from = 'admin@elghella.com') {
  try {
    console.log(`📧 Sending bulk email to ${recipients.length} recipients\n`);
    
    const transporter = nodemailer.createTransporter(emailConfig);
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: from,
          to: recipient,
          subject: subject,
          html: content,
          text: content.replace(/<[^>]*>/g, '')
        };

        await transporter.sendMail(mailOptions);
        await logEmail(recipient, subject, content, 'sent');
        successCount++;
        
        console.log(`✅ Sent to: ${recipient}`);
      } catch (error) {
        console.error(`❌ Failed to send to: ${recipient} - ${error.message}`);
        await logEmail(recipient, subject, content, 'failed', error.message);
        failureCount++;
      }
    }
    
    console.log(`\n📊 Bulk email summary:`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failureCount}`);
    console.log(`   Total: ${recipients.length}`);
    
  } catch (error) {
    console.error('❌ Error in bulk email:', error);
  }
}

async function sendVerificationEmail(userEmail, userName) {
  const subject = 'Welcome to Elghella Agritech - Verify Your Account';
  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Welcome to Elghella Agritech! 🌱</h2>
      <p>Hello ${userName},</p>
      <p>Thank you for joining our agricultural marketplace. Please verify your account to start trading.</p>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #4a5568;">Next Steps:</h3>
        <ul>
          <li>Complete your profile</li>
          <li>Add your products</li>
          <li>Start trading with other farmers</li>
        </ul>
      </div>
      <p>Best regards,<br>The Elghella Team</p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, content);
}

async function sendOrderConfirmation(userEmail, orderDetails) {
  const subject = 'Order Confirmation - Elghella Agritech';
  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Order Confirmed! 🎉</h2>
      <p>Your order has been successfully placed.</p>
      <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #4a5568;">Order Details:</h3>
        <p><strong>Order ID:</strong> ${orderDetails.id}</p>
        <p><strong>Item:</strong> ${orderDetails.item}</p>
        <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
        <p><strong>Total:</strong> ${orderDetails.total}</p>
      </div>
      <p>We'll notify you when your order ships.</p>
      <p>Best regards,<br>The Elghella Team</p>
    </div>
  `;
  
  return await sendEmail(userEmail, subject, content);
}

async function sendAdminNotification(adminEmail, notification) {
  const subject = 'Admin Notification - Elghella Agritech';
  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d3748;">Admin Alert! ⚠️</h2>
      <div style="background-color: #fed7d7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #c53030;">${notification.title}</h3>
        <p>${notification.message}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p>Please review this notification in your admin panel.</p>
    </div>
  `;
  
  return await sendEmail(adminEmail, subject, content);
}

async function logEmail(to, subject, content, status, error = null) {
  try {
    const { error: dbError } = await supabase
      .from('email_logs')
      .insert({
        recipient: to,
        subject: subject,
        content: content,
        status: status,
        error_message: error,
        sent_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('❌ Error logging email:', dbError);
    }
  } catch (error) {
    console.error('❌ Error in email logging:', error);
  }
}

async function getEmailLogs() {
  try {
    console.log('📧 Fetching email logs...\n');
    
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(20);

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
    console.error('❌ Error getting email logs:', error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  const arg3 = process.argv[5];
  
  switch (command) {
    case 'send':
      if (!arg1 || !arg2 || !arg3) {
        console.log('❌ Usage: node mcp-email-manager.js send <to> <subject> <content>');
        return;
      }
      await sendEmail(arg1, arg2, arg3);
      break;
      
    case 'bulk':
      if (!arg1 || !arg2 || !arg3) {
        console.log('❌ Usage: node mcp-email-manager.js bulk <emails> <subject> <content>');
        console.log('   emails should be comma-separated');
        return;
      }
      const emails = arg1.split(',').map(email => email.trim());
      await sendBulkEmail(emails, arg2, arg3);
      break;
      
    case 'verify':
      if (!arg1 || !arg2) {
        console.log('❌ Usage: node mcp-email-manager.js verify <email> <name>');
        return;
      }
      await sendVerificationEmail(arg1, arg2);
      break;
      
    case 'order':
      if (!arg1 || !arg2) {
        console.log('❌ Usage: node mcp-email-manager.js order <email> <orderid>');
        return;
      }
      const orderDetails = {
        id: arg2,
        item: 'Sample Product',
        quantity: 1,
        total: '$25.00'
      };
      await sendOrderConfirmation(arg1, orderDetails);
      break;
      
    case 'admin':
      if (!arg1 || !arg2 || !arg3) {
        console.log('❌ Usage: node mcp-email-manager.js admin <email> <title> <message>');
        return;
      }
      const notification = {
        title: arg2,
        message: arg3
      };
      await sendAdminNotification(arg1, notification);
      break;
      
    case 'logs':
      await getEmailLogs();
      break;
      
    default:
      console.log('🚀 Email Manager MCP - Available Commands:');
      console.log('  node mcp-email-manager.js send <to> <subject> <content>     - Send single email');
      console.log('  node mcp-email-manager.js bulk <emails> <subject> <content>  - Send bulk email');
      console.log('  node mcp-email-manager.js verify <email> <name>             - Send verification email');
      console.log('  node mcp-email-manager.js order <email> <orderid>           - Send order confirmation');
      console.log('  node mcp-email-manager.js admin <email> <title> <message>   - Send admin notification');
      console.log('  node mcp-email-manager.js logs                              - View email logs');
      break;
  }
}

// Run the main function
main().catch(console.error); 