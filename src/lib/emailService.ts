// Email Service for Admin Panel
// This service handles sending emails from the admin panel

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private baseUrl: string;

  constructor() {
    // Using Resend.com as the email service (free tier available)
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@elghella.com';
    this.baseUrl = 'https://api.resend.com';
  }

  // Check if email service is configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Send email using Resend API
  async sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Email service not configured. Please set RESEND_API_KEY environment variable.'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: data.from || this.fromEmail,
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text || this.stripHtml(data.html),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Email sent successfully:', result);
        return { success: true };
      } else {
        console.error('Email sending failed:', result);
        return {
          success: false,
          error: result.message || 'Failed to send email'
        };
      }
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        error: 'Network error while sending email'
      };
    }
  }

  // Send admin reply to contact message
  async sendAdminReply(
    userEmail: string,
    userName: string,
    originalSubject: string,
    adminReply: string,
    adminName: string = 'فريق الغلة'
  ): Promise<{ success: boolean; error?: string }> {
    const template = this.getAdminReplyTemplate(userName, originalSubject, adminReply, adminName);
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send expert application response
  async sendExpertResponse(
    userEmail: string,
    userName: string,
    status: 'approved' | 'rejected',
    adminNotes?: string,
    adminName: string = 'فريق الغلة'
  ): Promise<{ success: boolean; error?: string }> {
    const template = this.getExpertResponseTemplate(userName, status, adminNotes, adminName);
    
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Send newsletter
  async sendNewsletter(
    subscribers: string[],
    subject: string,
    content: string,
    adminName: string = 'فريق الغلة'
  ): Promise<{ success: boolean; error?: string; sentCount: number }> {
    let sentCount = 0;
    let lastError = '';

    for (const email of subscribers) {
      const template = this.getNewsletterTemplate(subject, content, adminName);
      
      const result = await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (result.success) {
        sentCount++;
      } else {
        lastError = result.error || 'Unknown error';
      }
    }

    return {
      success: sentCount > 0,
      error: sentCount === 0 ? lastError : undefined,
      sentCount
    };
  }

  // Template for admin reply
  private getAdminReplyTemplate(
    userName: string,
    originalSubject: string,
    adminReply: string,
    adminName: string
  ): EmailTemplate {
    const subject = `رد على رسالتك: ${originalSubject}`;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رد من فريق الغلة</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .reply-box { background: white; padding: 20px; border-radius: 8px; border-right: 4px solid #10b981; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 الغلة</h1>
            <p>منصة الزراعة الذكية</p>
          </div>
          <div class="content">
            <h2>مرحباً ${userName}،</h2>
            <p>شكراً لك على التواصل معنا. لقد تلقينا رسالتك وسعداء بالرد عليك.</p>
            
            <div class="reply-box">
              <h3>رد فريق ${adminName}:</h3>
              <p>${adminReply.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>إذا كان لديك أي استفسارات أخرى، لا تتردد في التواصل معنا مرة أخرى.</p>
            
            <a href="http://localhost:3000/contact" class="btn">تواصل معنا</a>
          </div>
          <div class="footer">
            <p>© 2024 الغلة - منصة الزراعة الذكية</p>
            <p>هذا البريد إلكتروني آلي، يرجى عدم الرد عليه</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      رد من فريق الغلة
      
      مرحباً ${userName}،
      
      شكراً لك على التواصل معنا. لقد تلقينا رسالتك وسعداء بالرد عليك.
      
      رد فريق ${adminName}:
      ${adminReply}
      
      إذا كان لديك أي استفسارات أخرى، لا تتردد في التواصل معنا مرة أخرى.
      
      © 2024 الغلة - منصة الزراعة الذكية
    `;

    return { subject, html, text };
  }

  // Template for expert application response
  private getExpertResponseTemplate(
    userName: string,
    status: 'approved' | 'rejected',
    adminNotes?: string,
    adminName: string = 'فريق الغلة'
  ): EmailTemplate {
    const isApproved = status === 'approved';
    const subject = isApproved 
      ? 'مبروك! تم قبول طلبك كخبير في الغلة'
      : 'تحديث بخصوص طلب الخبير';
    
    const statusText = isApproved ? 'مقبول' : 'مرفوض';
    const statusColor = isApproved ? '#10b981' : '#ef4444';
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تحديث طلب الخبير</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-box { background: white; padding: 20px; border-radius: 8px; border-right: 4px solid ${statusColor}; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 الغلة</h1>
            <p>منصة الزراعة الذكية</p>
          </div>
          <div class="content">
            <h2>مرحباً ${userName}،</h2>
            <p>نود إعلامك بتحديث حالة طلبك كخبير في منصة الغلة.</p>
            
            <div class="status-box">
              <h3>الحالة: ${statusText}</h3>
              ${adminNotes ? `<p><strong>ملاحظات الفريق:</strong><br>${adminNotes.replace(/\n/g, '<br>')}</p>` : ''}
            </div>
            
            ${isApproved ? `
              <p>مبروك! تم قبول طلبك. يمكنك الآن الوصول إلى لوحة الخبراء وإضافة خبراتك ومشاركتها مع المجتمع الزراعي.</p>
              <a href="http://localhost:3000/dashboard" class="btn">الذهاب للوحة التحكم</a>
            ` : `
              <p>نعتذر، لم يتم قبول طلبك في هذه المرة. يمكنك إعادة التقديم بعد 30 يوماً.</p>
              <a href="http://localhost:3000/experts/new" class="btn">إعادة التقديم</a>
            `}
          </div>
          <div class="footer">
            <p>© 2024 الغلة - منصة الزراعة الذكية</p>
            <p>هذا البريد إلكتروني آلي، يرجى عدم الرد عليه</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      تحديث طلب الخبير - الغلة
      
      مرحباً ${userName}،
      
      نود إعلامك بتحديث حالة طلبك كخبير في منصة الغلة.
      
      الحالة: ${statusText}
      ${adminNotes ? `\nملاحظات الفريق:\n${adminNotes}` : ''}
      
      ${isApproved ? `
        مبروك! تم قبول طلبك. يمكنك الآن الوصول إلى لوحة الخبراء وإضافة خبراتك ومشاركتها مع المجتمع الزراعي.
      ` : `
        نعتذر، لم يتم قبول طلبك في هذه المرة. يمكنك إعادة التقديم بعد 30 يوماً.
      `}
      
      © 2024 الغلة - منصة الزراعة الذكية
    `;

    return { subject, html, text };
  }

  // Template for newsletter
  private getNewsletterTemplate(
    subject: string,
    content: string,
    adminName: string
  ): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .newsletter-content { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 الغلة</h1>
            <p>منصة الزراعة الذكية</p>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            
            <div class="newsletter-content">
              ${content.replace(/\n/g, '<br>')}
            </div>
            
            <p>شكراً لك على الاشتراك في النشرة البريدية للغلة.</p>
            
            <a href="http://localhost:3000" class="btn">زيارة الموقع</a>
          </div>
          <div class="footer">
            <p>© 2024 الغلة - منصة الزراعة الذكية</p>
            <p>هذا البريد إلكتروني آلي، يرجى عدم الرد عليه</p>
            <p><a href="http://localhost:3000/unsubscribe">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ${subject}
      
      ${content}
      
      شكراً لك على الاشتراك في النشرة البريدية للغلة.
      
      © 2024 الغلة - منصة الزراعة الذكية
    `;

    return { subject, html, text };
  }

  // Strip HTML tags for plain text version
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}

// Export singleton instance
export const emailService = new EmailService(); 