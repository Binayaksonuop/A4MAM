const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail({ to, subject, html, text }) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured. Skipping email.');
      return { success: false, message: 'Email not configured' };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmation(order) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Thank You for Your Order!</h2>
        <p>Hi ${order.customerName},</p>
        <p>Your order has been placed successfully!</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Total Amount:</strong> ₹${order.amount}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <h3>Order Items:</h3>
        <ul>
          ${order.items.map(item => `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
        </ul>
        <p>We'll update you when your order ships.</p>
        <p>Best regards,<br>A4MAM Team</p>
      </div>
    `;

    return this.sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.id}`,
      html,
      text: `Thank you for your order! Order ID: ${order.id}, Amount: ₹${order.amount}`
    });
  }

  async sendInquiryConfirmation(inquiry) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Thank You for Your Inquiry!</h2>
        <p>Hi ${inquiry.name},</p>
        <p>We've received your inquiry and will get back to you soon.</p>
        <p><strong>Inquiry Type:</strong> ${inquiry.type}</p>
        <p><strong>Your Message:</strong> ${inquiry.message}</p>
        <p>Best regards,<br>A4MAM Team</p>
      </div>
    `;

    return this.sendEmail({
      to: inquiry.email,
      subject: 'We Received Your Inquiry - A4MAM',
      html,
      text: `Thank you for your inquiry! We'll get back to you soon.`
    });
  }
}

module.exports = new EmailService();
