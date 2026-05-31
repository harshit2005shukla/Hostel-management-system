import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Check if SMTP transport variables are configured
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_PORT;

    if (hasSmtpConfig) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || '"SmartHostel System" <no-reply@smarthostel.edu>',
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email Service] Message dispatched to ${to}. MessageID: ${info.messageId}`);
      return info;
    } else {
      // Graceful fallback: Output enterprise email template clearly to the active console
      console.log(`\n================== [SIMULATED EMAIL NOTIFICATION] ==================`);
      console.log(`TO      : ${to}`);
      console.log(`SUBJECT : ${subject}`);
      console.log(`--------------------------------------------------------------------`);
      console.log(html.replace(/<[^>]+>/g, '')); // Render simple clean text output
      console.log(`====================================================================\n`);
      return { simulated: true, messageId: `sim_${Date.now()}` };
    }
  } catch (error) {
    console.error(`[Email Service] Delivery failed: ${error.message}`);
    // Do not crash the caller if email delivery fails
    return { success: false, error: error.message };
  }
};

// Ready-to-use HTML Templates
export const emailTemplates = {
  
  forgotPassword: (resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #4f46e5;">SmartHostel System Access</h2>
      <p style="color: #334155; font-size: 15px;">We received a request to reset the password for your account.</p>
      <p style="color: #334155; font-size: 15px;">Click the button below to set a new password. This link is valid for 15 minutes.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 12px;">If you did not request this, please ignore this email. Your credentials remain safe.</p>
    </div>
  `,

  roomAllocation: (studentName, roomNumber, blockName) => `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #10b981;">Room Allocation Confirmed</h2>
      <p style="color: #334155; font-size: 15px;">Dear ${studentName},</p>
      <p style="color: #334155; font-size: 15px;">Your hostel room placement has been officially finalized by the block warden.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Hostel Block:</strong> ${blockName}</p>
        <p style="margin: 5px 0;"><strong>Assigned Room:</strong> ${roomNumber}</p>
      </div>
      <p style="color: #334155; font-size: 15px;">Please collect your physical room keys from the ground floor reception upon your arrival.</p>
    </div>
  `,

  feeReceipt: (studentName, amount, feeType, txnId) => `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #10b981;">Payment Acknowledgment</h2>
      <p style="color: #334155; font-size: 15px;">Dear ${studentName},</p>
      <p style="color: #334155; font-size: 15px;">We have successfully received and credited your remittance.</p>
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b;">Category</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold;">${feeType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 8px 0; color: #64748b;">Amount Paid</td>
          <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #10b981;">₹${amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Transaction Reference</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace;">${txnId}</td>
        </tr>
      </table>
      <p style="color: #64748b; font-size: 12px;">This serves as a valid digital receipt for your financial archives.</p>
    </div>
  `,

  complaintUpdate: (title, status, comments) => `
    <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #f59e0b;">Service Request Updated</h2>
      <p style="color: #334155; font-size: 15px;">Your filed infrastructure ticket has transitioned to a new state.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Ticket Summary:</strong> ${title}</p>
        <p style="margin: 5px 0;"><strong>Current Status:</strong> <span style="color: #4f46e5; font-weight: bold;">${status}</span></p>
      </div>
      ${comments ? `<p style="color: #334155; font-size: 14px;"><strong>Warden Notes:</strong> "${comments}"</p>` : ''}
    </div>
  `
};
