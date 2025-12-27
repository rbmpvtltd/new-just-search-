import { logger } from "@repo/logger";
import axios from "axios";
import nodemailer from "nodemailer";

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmailOTP(
  email: string,
  otp: string,
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "info@justsearch.net.in",
      to: email,
      subject: "Your OTP for Password Reset - Just Search",
      html: getOTPEmailHTML(otp),
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 20 minutes. Do not share this OTP with anyone.`,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    logger.info("Email OTP sent successfully", {
      messageId: info.messageId,
      email,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send email OTP", { error, email });
    throw new Error("Failed to send OTP via email");
  }
}

export async function sendSMSViaFast2SMSDLT(
  mobile: string,
  otp: string,
): Promise<boolean> {
  try {
    const cleanMobile = mobile.replace(/\D/g, "").slice(-10);

    // For DLT route, you need to register a template with TRAI
    // Template example: "Your OTP is {#var#} for Just Search. Valid for 20 minutes."
    // After registration, you'll get a template_id

    const payload = {
      route: "dlt",
      sender_id: "RBMPLA",
      template_id: "1207174228739240000",
      variables_values: otp,
      numbers: mobile,
      flash: "0",
      schedule_time: "",
      message: "181881",
    };

    logger.info("Sending SMS OTP via Fast2SMS (DLT)", {
      mobile: cleanMobile,
    });

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      payload,
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
        timeout: 10000,
      },
    );

    if (response.data?.return === true) {
      logger.info("SMS OTP sent via Fast2SMS (DLT) successfully", {
        mobile: cleanMobile,
        response: response.data,
      });
      return true;
    } else {
      logger.error("Fast2SMS (DLT) returned non-success response", {
        mobile: cleanMobile,
        response: response.data,
      });
      throw new Error(
        `Fast2SMS error: ${response.data?.message || "Unknown error"}`,
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error("Failed to send SMS via Fast2SMS (DLT)", {
        mobile,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw new Error("Failed to send OTP via SMS");
  }
}

function getOTPEmailHTML(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .otp-box {
          background-color: #f8f9fa;
          border: 2px dashed #007bff;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
          letter-spacing: 8px;
          margin: 10px 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 12px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1 style="color: #007bff; margin: 0;">Just Search</h1>
        </div>
        
        <h2>Password Reset OTP</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Please use the following OTP to complete the process:</p>
        
        <div class="otp-box">
          <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 0; font-size: 12px; color: #666;">Valid for 20 minutes</p>
        </div>
        
        <div class="warning">
          <strong>⚠️ Security Warning:</strong> Never share this OTP with anyone. Just Search will never ask for your OTP via phone or email.
        </div>
        
        <p>If you didn't request this password reset, please ignore this email and ensure your account is secure.</p>
        
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Just Search. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
