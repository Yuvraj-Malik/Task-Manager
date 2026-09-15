import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter based on environment variables.
 * Supports:
 * 1. Gmail or custom service (EMAIL_SERVICE=gmail, EMAIL_USER, EMAIL_PASS)
 * 2. Custom SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 * 3. Ethereal Email test account (automatic fallback for zero-config testing)
 */
const getTransporter = async () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

  // If email credentials are provided
  if (emailUser && emailPass) {
    // Custom SMTP host if specified
    if (process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
        auth: {
          user: (process.env.SMTP_USER || emailUser).trim(),
          pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : emailPass,
        },
      });
    }

    // High-performance direct SSL for Gmail (works reliably on Render cloud)
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  // If credentials are completely missing on the server
  console.warn("⚠️ [EMAIL] EMAIL_USER or EMAIL_PASS environment variable is missing on this server!");
  return null;
};

/**
 * Sends a password reset email with the 6-digit verification code.
 */
export const sendPasswordResetEmail = async (toEmail, resetCode) => {
  const transporter = await getTransporter();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your TaskPulse Password</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1C1917;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F5F0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width:500px;background-color:#ffffff;border-radius:16px;border:1px solid #E7E5E4;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #F5F5F4;">
              <div style="display:inline-block;width:44px;height:44px;background-color:#1D4ED8;border-radius:12px;margin-bottom:12px;line-height:44px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">
                ✓
              </div>
              <h2 style="margin:0;font-size:22px;font-weight:700;color:#0F172A;letter-spacing:-0.02em;">TaskPulse</h2>
              <p style="margin:6px 0 0;font-size:13px;color:#78716C;">Password Reset Request</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#292524;">
                Hello,
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#57534E;">
                We received a request to reset your password for your <strong>TaskPulse</strong> account. Enter the verification code below to set a new password:
              </p>

              <!-- Code Box -->
              <div style="background-color:#F8FAFC;border:2px dashed #93C5FD;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                <span style="display:block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#1D4ED8;margin-bottom:8px;">
                  Your 6-Digit Code
                </span>
                <span style="display:inline-block;font-size:36px;font-weight:800;font-family:monospace;letter-spacing:0.25em;color:#0F172A;padding-left:0.25em;">
                  ${resetCode}
                </span>
              </div>

              <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#78716C;">
                ⏳ This code will expire in <strong>15 minutes</strong>.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#A8A29E;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#FAFAF9;border-top:1px solid #F5F5F4;text-align:center;">
              <p style="margin:0;font-size:12px;color:#A8A29E;">
                &copy; ${new Date().getFullYear()} TaskPulse. High Performance Workspace.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"TaskPulse Support" <${process.env.EMAIL_USER || "no-reply@taskpulse.app"}>`,
    to: toEmail,
    subject: `Your TaskPulse Verification Code: ${resetCode}`,
    text: `Your TaskPulse password reset code is: ${resetCode}. This code expires in 15 minutes. If you did not request this, please ignore this email.`,
    html: htmlContent,
  };

  if (!transporter) {
    console.error(`❌ [TASKPULSE EMAIL] Missing EMAIL_USER or EMAIL_PASS on this server. Cannot dispatch email to ${toEmail}.`);
    return {
      success: false,
      error: "Server email service is not configured. Please add EMAIL_USER and EMAIL_PASS in the Render Dashboard Environment settings.",
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 [EMAIL SENT] Message sent to ${toEmail}: ${info.messageId}`);
    
    // If using Ethereal preview link:
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 [EMAIL PREVIEW URL]: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error(`❌ [EMAIL ERROR] Failed to send email to ${toEmail}:`, err.message);
    // Even if sending failed, we logged to console for safety
    console.log(`🔑 [FALLBACK CODE] Reset code for ${toEmail}: ${resetCode}`);
    return { success: false, error: err.message };
  }
};
